# Admin map plane animation

## Problem

On `/admin/map`, active student routes are already drawn as dashed arcs
from Baku to each destination city (`LeafletMapInner.tsx`). The client
wants a visual sense of motion — a plane flying along each route — so
the map reads as "leads are actively heading to these countries"
rather than a static diagram.

## Scope

- Applies only to `/admin/map` (the full routes map). The small map
  widgets on `/admin` (dashboard overview) and `/student/dashboard`
  are unchanged.
- Purely decorative: not tied to the unused `WorldMapRoute.progress`
  field or to `ApplicationStatus`. That field stays as-is for possible
  future use.

## Behavior

For each route currently rendered as an arc:

- A plane icon flies Baku → destination, pauses ~0.8s, flies back
  destination → Baku, pauses ~0.8s, and repeats indefinitely.
- The icon rotates to face its current direction of travel.
- Flight duration is proportional to the route's great-circle
  distance, clamped to 6–16s, so short and long routes don't all move
  at a visually identical (unrealistic) speed.
- If `prefers-reduced-motion: reduce` is set, planes render static at
  the midpoint of their arc instead of animating (consistent with the
  site's existing global reduced-motion handling).

## Implementation

All changes are inside `components/features/LeafletMapInner.tsx` —
no new files, no new dependencies.

- Reuse the existing `arcPoints()` output (40-point array per route)
  that already drives the dashed polyline — the plane interpolates
  along those same points, so it visually hugs the drawn curve
  exactly.
- One shared `requestAnimationFrame` loop drives every plane marker
  on the map (not one rAF per marker), keyed off a per-route start
  time and computed duration.
- Bearing between consecutive arc points sets the marker's rotation
  each frame.
- Icon: lucide's `Plane` glyph (matches the icon family already used
  elsewhere in the admin UI), rendered as inline SVG inside an
  `L.divIcon`, colored to match the theme's route line color
  (`theme.lineColor`).
- The plane markers are rebuilt whenever `routes` changes (new
  Firestore snapshot) in the existing update effect, alongside the
  polylines and destination markers. The rAF loop is cancelled on
  unmount and whenever markers are rebuilt.

## Out of scope

- No changes to `/admin` dashboard widget or `/student/dashboard`.
- No changes to the `WorldMapRoute.progress` field or how routes are
  computed (`getRouteForApplication`).
- No new configuration/toggle — always on for `/admin/map`, gated
  only by `prefers-reduced-motion`.
