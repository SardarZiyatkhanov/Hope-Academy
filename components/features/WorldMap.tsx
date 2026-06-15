"use client";

import { useEffect, useRef } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { BAKU_COORDS, WorldMapRoute } from "@/lib/constants";

interface WorldMapProps {
  routes: WorldMapRoute[];
  height?: number;
  className?: string;
  variant?: "dark" | "light";
}

const THEMES = {
  dark: {
    background: "bg-navy",
    land: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.10)",
    routeStroke: "rgba(43, 109, 232, 0.35)",
    destLabel: "rgba(255,255,255,0.85)",
    originLabel: "#FFFFFF",
    labelBg: "rgba(14,36,84,0.65)",
  },
  light: {
    background: "bg-white",
    land: "rgba(14,36,84,0.05)",
    border: "rgba(14,36,84,0.12)",
    routeStroke: "rgba(43, 109, 232, 0.25)",
    destLabel: "rgba(14,36,84,0.65)",
    originLabel: "#0E2454",
    labelBg: "rgba(255,255,255,0.75)",
  },
} as const;

// Extra degrees of lng/lat around Baku + destinations kept in view.
const DEGREE_PADDING = 5;
// Pixel margin between the fitted geography and the canvas edge.
const PIXEL_PADDING = 16;

interface LabelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const LABEL_HEIGHT = 14;
const LABEL_PADDING = 3;

function rectsOverlap(a: LabelRect, b: LabelRect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

// Search radii (px) and directions tried, in order, when placing a label.
// Starting close to the anchor and spiraling outward lets dense clusters of
// destinations push their labels apart into open space.
const SEARCH_RADII = [8, 16, 26, 38, 52, 68];
const SEARCH_DIRECTIONS: [number, number][] = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

// Tries positions in a spiral around the anchor point and picks the first
// one that stays on-canvas and doesn't collide with already-placed labels.
function placeLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  anchorX: number,
  anchorY: number,
  canvasWidth: number,
  canvasHeight: number,
  placed: LabelRect[]
): { x: number; y: number; rect: LabelRect } {
  const textWidth = ctx.measureText(text).width;

  const rectFor = (fx: number, fy: number): LabelRect => ({
    x: fx - LABEL_PADDING,
    y: fy - LABEL_HEIGHT - LABEL_PADDING,
    width: textWidth + LABEL_PADDING * 2,
    height: LABEL_HEIGHT + LABEL_PADDING * 2,
  });

  let fallback: { x: number; y: number; rect: LabelRect } | null = null;

  for (const radius of SEARCH_RADII) {
    for (const [dx, dy] of SEARCH_DIRECTIONS) {
      const centerX = anchorX + dx * radius;
      const centerY = anchorY + dy * radius;
      const fx = centerX - textWidth / 2;
      const fy = centerY + LABEL_HEIGHT / 2;
      const rect = rectFor(fx, fy);
      if (!fallback) fallback = { x: fx, y: fy, rect };

      const inBounds = rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= canvasWidth && rect.y + rect.height <= canvasHeight;
      if (inBounds && !placed.some((p) => rectsOverlap(rect, p))) {
        return { x: fx, y: fy, rect };
      }
    }
  }

  return fallback as { x: number; y: number; rect: LabelRect };
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  rect: LabelRect,
  background: string,
  color: string
) {
  ctx.fillStyle = background;
  roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 3);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

export function WorldMap({ routes, height, className, variant = "dark" }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = THEMES[variant];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseCanvas = document.createElement("canvas");
    const baseCtx = baseCanvas.getContext("2d");

    let frameId = 0;
    let cancelled = false;
    let land: GeoJSON.FeatureCollection | null = null;
    const start = performance.now();

    const points: [number, number][] = [BAKU_COORDS, ...routes.map((route) => route.to)];
    const lngs = points.map((point) => point[0]);
    const lats = points.map((point) => point[1]);
    const minLng = Math.min(...lngs) - DEGREE_PADDING;
    const maxLng = Math.max(...lngs) + DEGREE_PADDING;
    const minLat = Math.min(...lats) - DEGREE_PADDING;
    const maxLat = Math.max(...lats) + DEGREE_PADDING;

    const bounds: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: "Feature",
      properties: null,
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [minLng, minLat],
            [maxLng, minLat],
            [maxLng, maxLat],
            [minLng, maxLat],
            [minLng, minLat],
          ],
        ],
      },
    };

    const projection = geoMercator();
    const path = geoPath(projection);

    const drawBase = () => {
      if (!baseCtx) return;
      const rect = container.getBoundingClientRect();
      baseCtx.clearRect(0, 0, rect.width, rect.height);
      if (!land) return;

      path.context(baseCtx);
      baseCtx.beginPath();
      path(land);
      baseCtx.fillStyle = theme.land;
      baseCtx.fill();
      baseCtx.strokeStyle = theme.border;
      baseCtx.lineWidth = 0.75;
      baseCtx.stroke();
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      baseCanvas.width = rect.width * dpr;
      baseCanvas.height = rect.height * dpr;
      if (baseCtx) {
        baseCtx.setTransform(1, 0, 0, 1, 0, 0);
        baseCtx.scale(dpr, dpr);
      }

      projection.fitExtent(
        [
          [PIXEL_PADDING, PIXEL_PADDING],
          [rect.width - PIXEL_PADDING, rect.height - PIXEL_PADDING],
        ],
        bounds
      );

      drawBase();
    };
    resize();

    const draw = (time: number) => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(baseCanvas, 0, 0, w, h);

      const elapsed = (time - start) / 1000;
      const origin = projection(BAKU_COORDS);
      if (!origin) {
        frameId = requestAnimationFrame(draw);
        return;
      }
      const [bx, by] = origin;

      const destinations = routes
        .map((route, index) => {
          const dest = projection(route.to);
          return dest ? { route, index, x: dest[0], y: dest[1] } : null;
        })
        .filter((value): value is { route: WorldMapRoute; index: number; x: number; y: number } => value !== null);

      destinations.forEach(({ route, index, x: tx, y: ty }) => {
        const mx = (bx + tx) / 2;
        const my = Math.min(by, ty) - h * 0.18;

        // route curve
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(mx, my, tx, ty);
        ctx.strokeStyle = theme.routeStroke;
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

      // Labels are placed last, with collision avoidance, so a dense
      // cluster of destinations doesn't end up with overlapping text.
      const placed: LabelRect[] = [];

      ctx.font = "600 12px Inter, sans-serif";
      const bakuLabel = placeLabel(ctx, "Bakı", bx, by, w, h, placed);
      placed.push(bakuLabel.rect);
      drawLabel(ctx, "Bakı", bakuLabel.x, bakuLabel.y, bakuLabel.rect, theme.labelBg, theme.originLabel);

      ctx.font = "12px Inter, sans-serif";
      destinations.forEach(({ route, x: tx, y: ty }) => {
        const label = placeLabel(ctx, route.label, tx, ty, w, h, placed);
        placed.push(label.rect);
        drawLabel(ctx, route.label, label.x, label.y, label.rect, theme.labelBg, theme.destLabel);
      });

      frameId = requestAnimationFrame(draw);
    };

    // Catches the initial layout pass (when the container's size isn't yet
    // known on the first synchronous resize() call above) as well as any
    // later size changes from window resizes or layout shifts.
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    // Until the geography data loads, the canvas stays empty so the
    // container's plain background shows through (no dot-grid flash).
    import("world-atlas/countries-110m.json").then((module) => {
      if (cancelled) return;
      const topo = module.default as unknown as Topology;
      land = feature(topo, topo.objects.countries as GeometryCollection) as GeoJSON.FeatureCollection;
      drawBase();
      frameId = requestAnimationFrame(draw);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [routes, theme]);

  return (
    <div
      ref={containerRef}
      style={height !== undefined ? { height } : undefined}
      className={`relative w-full overflow-hidden rounded-card ${theme.background} ${className ?? ""}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
