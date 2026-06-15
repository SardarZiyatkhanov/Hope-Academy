# Real-geography WorldMap Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abstract navy/dot-grid background of `components/features/WorldMap.tsx` with real continent/country outlines, while preserving the existing animated Baku → Europe routes, pulses, and labels in both `dark` and `light` variants.

**Architecture:** Add `d3-geo` + `topojson-client` + `world-atlas` (low-res world country boundaries). Replace the hand-rolled linear projection with `d3.geoMercator()` fitted to a bounding box around Baku and all destination cities. Render country outlines onto an offscreen canvas once (re-rendered on resize / once geography data loads), then blit that onto the visible canvas each animation frame before drawing the existing route/pulse/label layer (now using the new projection).

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind, Canvas 2D, d3-geo, topojson-client, world-atlas.

---

## Reference: spec

See `docs/superpowers/specs/2026-06-15-real-world-map-background-design.md` for the approved design.

## Reference: current file

The file being modified is `components/features/WorldMap.tsx` (176 lines). It is a `"use client"` component that draws an animated canvas map. It is used, unmodified, by:
- `app/page.tsx` (`variant` default = `"dark"`, `height=360`)
- `app/student/dashboard/page.tsx` (`height=200`)
- `app/admin/page.tsx` (`height=150`)
- `app/admin/map/page.tsx` (`height=520`)

None of these call sites change. All four currently use the default `variant="dark"`. The `light` variant (`app/contact/page.tsx` used it before commit `110bd35` replaced that map with an OpenStreetMap embed) is not currently rendered anywhere, but stays part of `WorldMapProps` and `THEMES` — verify it via the type-check/lint steps rather than a visual check.

---

### Task 1: Add mapping dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

Run:

```bash
npm install d3-geo topojson-client world-atlas
```

Expected: `package.json` `dependencies` gains `d3-geo`, `topojson-client`, and `world-atlas` entries (caret-ranged versions around `3.1.x`, `3.1.x`, and `2.0.x` respectively), and `package-lock.json` is updated.

- [ ] **Step 2: Install type packages**

Run:

```bash
npm install -D @types/d3-geo @types/topojson-client @types/topojson-specification @types/geojson
```

Expected: `package.json` `devDependencies` gains `@types/d3-geo`, `@types/topojson-client`, `@types/topojson-specification`, and `@types/geojson`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add d3-geo, topojson-client, and world-atlas for real map geography"
```

---

### Task 2: Rewrite WorldMap to render real geography

**Files:**
- Modify: `components/features/WorldMap.tsx`

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `components/features/WorldMap.tsx` with:

```tsx
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
  },
  light: {
    background: "bg-white",
    land: "rgba(14,36,84,0.05)",
    border: "rgba(14,36,84,0.12)",
    routeStroke: "rgba(43, 109, 232, 0.25)",
    destLabel: "rgba(14,36,84,0.65)",
    originLabel: "#0E2454",
  },
} as const;

// Extra degrees of lng/lat around Baku + destinations kept in view.
const DEGREE_PADDING = 5;
// Pixel margin between the fitted geography and the canvas edge.
const PIXEL_PADDING = 16;

export function WorldMap({ routes, height = 200, className, variant = "dark" }: WorldMapProps) {
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

      routes.forEach((route, index) => {
        const dest = projection(route.to);
        if (!dest) return;
        const [tx, ty] = dest;
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

        // label
        ctx.fillStyle = theme.destLabel;
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

      ctx.fillStyle = theme.originLabel;
      ctx.font = "600 12px Inter, sans-serif";
      ctx.fillText("Bakı", bx + 8, by - 8);

      frameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);

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
      window.removeEventListener("resize", resize);
    };
  }, [routes, theme]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`relative w-full overflow-hidden rounded-card ${theme.background} ${className ?? ""}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
```

Key differences from the previous version:
- `THEMES` drops `gridDot` and gains `land` / `border` fill/stroke colors per variant.
- The old hand-rolled `project()` function and dot-grid drawing loop are removed.
- A `geoMercator()` projection is fitted (`fitExtent`) to a polygon covering Baku + all destination cities, padded by `DEGREE_PADDING` degrees — this polygon always has non-zero extent, even when `routes` is empty (e.g. `app/admin/page.tsx` with no active applications).
- An offscreen `baseCanvas` renders the real country outlines (via `d3.geoPath`) once per resize / once the `world-atlas` data resolves; the visible canvas blits this each frame via `drawImage` before drawing the animated route layer.
- All coordinate conversions (`BAKU_COORDS`, `route.to`) now go through `projection(...)` instead of the old linear `project(...)`.
- `world-atlas/countries-110m.json` is loaded with a dynamic `import()` so it isn't part of the initial JS bundle. The animation loop (`requestAnimationFrame(draw)`) only starts once that data resolves, so the canvas stays empty (showing the plain `bg-navy`/`bg-white` container background) instead of briefly drawing routes over nothing.

- [ ] **Step 2: Type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors. If TypeScript cannot resolve the `"topojson-specification"` or `"geojson"` ambient types, double-check that `@types/topojson-specification` and `@types/geojson` from Task 1 Step 2 installed successfully (`ls node_modules/@types | grep -E 'geojson|topojson'`).

- [ ] **Step 3: Lint**

Run:

```bash
npm run lint
```

Expected: no new errors in `components/features/WorldMap.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/features/WorldMap.tsx
git commit -m "Render real continent/country outlines behind the animated route map"
```

---

### Task 3: Visual verification

**Files:** none (manual check only)

- [ ] **Step 1: Start the dev server**

Run:

```bash
npm run dev
```

- [ ] **Step 2: Check the home hero (dark variant)**

Open `http://localhost:3000/`. Confirm:
- The hero map (top-right on desktop) shows real continent/country outlines (Europe, Caucasus, North Africa edge) instead of a dotted grid.
- The animated routes from "Bakı" to Berlin, Amsterdam, Vienna, Paris, Warsaw, and Brussels still draw, with traveling gold dots and pulsing blue destination markers, positioned on/near the correct real-world locations for those cities.
- Labels are still readable against the new background.

- [ ] **Step 3: Check the admin pages**

Log in as an admin (or use existing admin test flow) and open `/admin` and `/admin/map`. Confirm:
- `/admin`'s small map (150px) still renders without errors even if there are zero active routes (empty `routes` array) — the real map background should still appear, centered on Baku with `DEGREE_PADDING` margin.
- `/admin/map`'s larger map (520px) renders correctly with any active application routes.

- [ ] **Step 4: Check the student dashboard**

Open `/student/dashboard`. Confirm the 200px map renders the real map background and, if the student has an application with a matching university route, shows that single route correctly.

- [ ] **Step 5: Resize check**

Resize the browser window (or devtools responsive mode) while on `/` and confirm the map redraws correctly at the new size (no stretched/misaligned geography, no leftover dot-grid artifacts).
