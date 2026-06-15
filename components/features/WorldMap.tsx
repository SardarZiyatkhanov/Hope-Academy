"use client";

import { useEffect, useRef } from "react";
import { BAKU_COORDS, WorldMapRoute } from "@/lib/constants";

interface WorldMapProps {
  routes: WorldMapRoute[];
  height?: number;
  className?: string;
}

type Point = [number, number];

function project(coord: Point, bounds: [number, number, number, number], width: number, height: number): Point {
  const [minLng, maxLng, minLat, maxLat] = bounds;
  const x = ((coord[0] - minLng) / (maxLng - minLng)) * width;
  const y = height - ((coord[1] - minLat) / (maxLat - minLat)) * height;
  return [x, y];
}

export function WorldMap({ routes, height = 200, className }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    const start = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const points: Point[] = [BAKU_COORDS, ...routes.map((route) => route.to)];
    const lngs = points.map((point) => point[0]);
    const lats = points.map((point) => point[1]);
    const padding = 5;
    const bounds: [number, number, number, number] = [
      Math.min(...lngs) - padding,
      Math.max(...lngs) + padding,
      Math.min(...lats) - padding,
      Math.max(...lats) + padding,
    ];

    const draw = (time: number) => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // background grid of dots
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      const gap = 20;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const elapsed = (time - start) / 1000;
      const [bx, by] = project(BAKU_COORDS, bounds, w, h);

      routes.forEach((route, index) => {
        const [tx, ty] = project(route.to, bounds, w, h);
        const mx = (bx + tx) / 2;
        const my = Math.min(by, ty) - h * 0.18;

        // route curve
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(mx, my, tx, ty);
        ctx.strokeStyle = "rgba(43, 109, 232, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // animated traveling dot
        const t = (elapsed * 0.12 + route.progress) % 1;
        const px = (1 - t) * (1 - t) * bx + 2 * (1 - t) * t * mx + t * t * tx;
        const py = (1 - t) * (1 - t) * by + 2 * (1 - t) * t * my + t * t * ty;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#E8A020";
        ctx.fill();

        // destination pulse
        const pulse = (Math.sin(elapsed * 2 + index) + 1) / 2;
        ctx.beginPath();
        ctx.arc(tx, ty, 3 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(43, 109, 232, ${0.25 + pulse * 0.3})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#2B6DE8";
        ctx.fill();

        // label
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "12px Inter, sans-serif";
        ctx.fillText(route.label, tx + 6, ty - 6);
      });

      // Baku origin
      const originPulse = (Math.sin(elapsed * 2.5) + 1) / 2;
      ctx.beginPath();
      ctx.arc(bx, by, 4 + originPulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 160, 32, ${0.25 + originPulse * 0.35})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#E8A020";
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "600 12px Inter, sans-serif";
      ctx.fillText("Bakı", bx + 8, by - 8);

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [routes]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`relative w-full overflow-hidden rounded-card bg-navy ${className ?? ""}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
