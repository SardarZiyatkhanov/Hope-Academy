# Real-geography background for WorldMap

## Goal

`components/features/WorldMap.tsx` currently renders an abstract navy
background with a dot grid behind the animated Baku → European cities
routes. Replace the dot grid with an actual world map (real continent and
country outlines), while keeping all existing animated behavior — route
curves, traveling dots, destination pulses, Baku origin pulse, and labels —
for both the `dark` and `light` variants.

This component is used in four places and none of them need changes:
- `app/page.tsx` (home hero)
- `app/student/dashboard/page.tsx`
- `app/admin/page.tsx`
- `app/admin/map/page.tsx`

## Approach

### Dependencies

Add three small, standard libraries:
- `d3-geo` — geographic projections and path rendering
- `topojson-client` — convert TopoJSON to GeoJSON
- `world-atlas` — provides `countries-110m.json` (low-resolution world
  country boundaries, ~100KB)

### Data loading

- Load `world-atlas/countries-110m.json` via a dynamic `import()` inside the
  component's `useEffect`, so the data is fetched after initial render and
  doesn't bloat the main JS bundle.
- Convert the topojson to a GeoJSON `FeatureCollection` once with
  `topojson-client`'s `feature()`.

### Projection

- Replace the current hand-rolled linear `project()` function with
  `d3.geoMercator()`.
- Fit the projection to the canvas using `.fitExtent()` against a geometry
  built from Baku's coordinates plus every route's destination coordinates,
  preserving the same kind of margin/padding the current implementation uses
  so points aren't drawn at the very edge of the canvas.
- All existing per-point math (route curve control points, traveling dot
  position along the quadratic curve, pulse circles, label positions) stays
  the same — only the coordinate-to-pixel conversion changes from the old
  `project()` to the new d3 projection function.

### Rendering layers

1. **Static base layer (new):** real country/land outlines, drawn with
   `d3.geoPath()` onto an offscreen canvas. Re-rendered when the canvas is
   resized or when the geography data finishes loading. Each animation frame
   blits this offscreen canvas onto the visible canvas with `drawImage`
   before drawing the dynamic layer.
2. **Dynamic layer (existing logic, new projection):** route curves,
   traveling dots, destination pulses, Baku pulse, and labels — drawn every
   frame on top of the base layer, same as today.

The dot-grid background drawing code is removed entirely.

### Theming

- **Dark variant:** ocean/background = existing navy (`bg-navy`); land fill =
  subtle lighter navy; country borders = faint white. Route/dot/pulse/label
  colors unchanged.
- **Light variant:** ocean/background = white; land fill = very light
  gray-blue; country borders = faint navy. Route/dot/pulse/label colors
  unchanged.

### Loading state

While the geography data is loading, render just the plain navy/white
background (no dot grid, no map, no routes) to avoid a flash of the old grid
or a layout shift. The full animation (base layer + dynamic layer) starts
once the data resolves.

## Out of scope

- No changes to `lib/constants.ts` route/city data.
- No changes to the four call sites.
- No new configuration props on `WorldMap` (variant/height/className/routes
  API stays the same).
