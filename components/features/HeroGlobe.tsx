"use client";

import { useEffect, useRef, useMemo } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { BAKU_COORDS, DEFAULT_WORLD_ROUTES } from "@/lib/constants";

const GRID_STEP = 2.4;
const W = 700;
const H = 520;

function quadBezier(from: [number, number], to: [number, number]): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const lift = dist * 0.35;
  const cx = (x1 + x2) / 2 - (dy / dist) * lift;
  const cy = (y1 + y2) / 2 + (dx / dist) * lift;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

export function HeroGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<[number, number][]>([]);
  const frameRef = useRef(0);

  const projection = useMemo(
    () => geoNaturalEarth1().scale(140).translate([W / 2, H / 2 + 20]).rotate([-30, 0]),
    [],
  );

  const bakuXY = useMemo(() => projection(BAKU_COORDS) as [number, number], [projection]);

  const routeData = useMemo(
    () =>
      DEFAULT_WORLD_ROUTES.map((r) => ({
        ...r,
        xy: projection(r.to) as [number, number],
        path: quadBezier(
          projection(BAKU_COORDS) as [number, number],
          projection(r.to) as [number, number],
        ),
      })).filter((r) => r.xy),
    [projection],
  );

  useEffect(() => {
    let mounted = true;

    async function init() {
      const topoData: Topology = await (
        await fetch("/data/countries-110m.json")
      ).json();
      if (!mounted) return;

      const land = feature(
        topoData,
        topoData.objects.countries,
      ) as unknown as GeoJSON.FeatureCollection;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = W * 2;
      canvas.height = H * 2;
      ctx.scale(2, 2);

      const hitCanvas = document.createElement("canvas");
      hitCanvas.width = W;
      hitCanvas.height = H;
      const hitCtx = hitCanvas.getContext("2d")!;
      const hitPath = geoPath(projection, hitCtx);

      hitCtx.fillStyle = "#000";
      land.features.forEach((f) => {
        hitCtx.beginPath();
        hitPath(f);
        hitCtx.fill();
      });

      const dots: [number, number][] = [];
      for (let lat = -60; lat <= 80; lat += GRID_STEP) {
        for (let lng = -170; lng <= 180; lng += GRID_STEP) {
          const pt = projection([lng, lat]);
          if (!pt || pt[0] < 0 || pt[1] < 0 || pt[0] > W || pt[1] > H) continue;
          const pixel = hitCtx.getImageData(Math.round(pt[0]), Math.round(pt[1]), 1, 1).data;
          if (pixel[3] > 128) dots.push(pt as [number, number]);
        }
      }
      dotsRef.current = dots;

      const mainPath = geoPath(projection, ctx);
      let tick = 0;

      function draw() {
        if (!ctx || !mounted) return;
        tick++;

        ctx.clearRect(0, 0, W, H);

        ctx.fillStyle = "rgba(26, 74, 168, 0.06)";
        ctx.strokeStyle = "rgba(26, 74, 168, 0.15)";
        ctx.lineWidth = 0.5;
        land.features.forEach((f) => {
          ctx.beginPath();
          mainPath(f);
          ctx.fill();
          ctx.stroke();
        });

        const dotA = 0.3 + Math.sin(tick * 0.015) * 0.08;
        ctx.fillStyle = `rgba(77, 142, 247, ${dotA})`;
        dotsRef.current.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 1.1, 0, Math.PI * 2);
          ctx.fill();
        });

        routeData.forEach((r, i) => {
          const p = new Path2D(r.path);
          ctx.strokeStyle = "rgba(77, 142, 247, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.lineDashOffset = -tick * 0.4;
          ctx.stroke(p);
          ctx.setLineDash([]);

          const pulse = Math.sin(tick * 0.035 + i * 0.8) * 0.3 + 0.7;

          ctx.fillStyle = `rgba(107, 163, 255, ${pulse * 0.12})`;
          ctx.beginPath();
          ctx.arc(r.xy[0], r.xy[1], 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(107, 163, 255, ${pulse})`;
          ctx.beginPath();
          ctx.arc(r.xy[0], r.xy[1], 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(14, 36, 84, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        const bp = Math.sin(tick * 0.04) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(232, 160, 32, ${bp * 0.1})`;
        ctx.beginPath();
        ctx.arc(bakuXY[0], bakuXY[1], 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(232, 160, 32, ${bp * 0.25})`;
        ctx.beginPath();
        ctx.arc(bakuXY[0], bakuXY[1], 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#e8a020";
        ctx.beginPath();
        ctx.arc(bakuXY[0], bakuXY[1], 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(14, 36, 84, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        frameRef.current = requestAnimationFrame(draw);
      }

      draw();
    }

    init();
    return () => {
      mounted = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [projection, bakuXY, routeData]);

  return (
    <div
      role="img"
      aria-label="Bakıdan Avropa şəhərlərinə gedən tələbə marşrutlarını göstərən interaktiv xəritə"
      className={`flex items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ width: W, maxWidth: "100%", aspectRatio: `${W}/${H}` }}
        className=""
      />
    </div>
  );
}
