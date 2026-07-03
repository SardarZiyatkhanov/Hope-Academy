"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BAKU_COORDS, WorldMapRoute } from "@/lib/constants";

// lucide "plane" icon path — kept as raw SVG so it can live inside a
// Leaflet divIcon (no React tree available in this canvas).
const PLANE_SVG_PATH =
  "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";
// The glyph's drawn nose points up-right (~-45deg in screen atan2-with-y-down
// terms); rotation math below compensates by this constant.
const PLANE_ICON_BASE_ANGLE = -45;
// How far apart (in arc-fraction) to sample two points for the bearing.
// Fixed and non-zero so bearing never degenerates into a zero vector,
// including right at the start/end of the arc.
const BEARING_SAMPLE_EPS = 0.03;

function haversineKm(from: [number, number], to: [number, number]): number {
  const R = 6371;
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - ((-2 * x + 2) ** 2) / 2;
}

// Interpolated lat/lng at fraction t (0-1) along a point array.
function positionAt(pts: L.LatLngTuple[], t: number): L.LatLngTuple {
  const lastIdx = pts.length - 1;
  const idx = Math.min(Math.max(t, 0), 1) * lastIdx;
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, lastIdx);
  const frac = idx - i0;
  const [lat0, lng0] = pts[i0];
  const [lat1, lng1] = pts[i1];
  return [lat0 + (lat1 - lat0) * frac, lng0 + (lng1 - lng0) * frac];
}

// Position + travel bearing at fraction t (0-1) along a point array,
// walking forward (dir=1) or backward (dir=-1). Bearing is sampled over a
// fixed window around t rather than between adjacent array points, so it
// stays well-defined (non-zero vector) even exactly at t=0 or t=1.
function sampleArc(pts: L.LatLngTuple[], t: number, dir: 1 | -1) {
  const latlng = positionAt(pts, t);
  const ta = Math.max(0, t - BEARING_SAMPLE_EPS);
  const tb = Math.min(1, t + BEARING_SAMPLE_EPS);
  const [latA, lngA] = positionAt(pts, ta);
  const [latB, lngB] = positionAt(pts, tb);

  const travelAngle = (Math.atan2(-(latB - latA), lngB - lngA) * 180) / Math.PI;
  const rotation = travelAngle - PLANE_ICON_BASE_ANGLE + (dir === -1 ? 180 : 0);

  return { latlng, rotation };
}

function makePlaneIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `
      <div class="plane-rotor" style="width:26px;height:26px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          style="display:block;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.45));">
          <path d="${PLANE_SVG_PATH}" fill="${color}" stroke="white" stroke-width="1.5"
            stroke-linejoin="round"/>
        </svg>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

interface PlaneState {
  marker: L.Marker;
  rotor: HTMLElement | null;
  points: L.LatLngTuple[];
  flightMs: number;
  pauseMs: number;
  phaseOffsetMs: number;
}

// One flight cycle: ease out, pause, ease back, pause.
function planePhase(elapsedMs: number, flightMs: number, pauseMs: number) {
  const cycle = 2 * flightMs + 2 * pauseMs;
  const t = ((elapsedMs % cycle) + cycle) % cycle;
  if (t < flightMs) return { t: easeInOutQuad(t / flightMs), dir: 1 as const };
  if (t < flightMs + pauseMs) return { t: 1, dir: 1 as const };
  if (t < 2 * flightMs + pauseMs) {
    const back = easeInOutQuad((t - flightMs - pauseMs) / flightMs);
    return { t: 1 - back, dir: -1 as const };
  }
  return { t: 0, dir: -1 as const };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function buildPlane(
  map: L.Map,
  route: WorldMapRoute,
  pts: L.LatLngTuple[],
  lineColor: string,
  index: number
): PlaneState {
  const distanceKm = haversineKm(BAKU_COORDS, route.to);
  const flightMs = Math.min(16000, Math.max(6000, 6000 + (distanceKm / 1000) * 1100));
  const marker = L.marker(pts[0], {
    icon: makePlaneIcon(lineColor),
    interactive: false,
    keyboard: false,
  }).addTo(map);
  const rotor = marker.getElement()?.querySelector<HTMLElement>(".plane-rotor") ?? null;

  return {
    marker,
    rotor,
    points: pts,
    flightMs,
    pauseMs: 800,
    phaseOffsetMs: index * 1500,
  };
}

function renderPlaneFrame(plane: PlaneState, t: number, dir: 1 | -1) {
  const { latlng, rotation } = sampleArc(plane.points, t, dir);
  plane.marker.setLatLng(latlng);
  if (plane.rotor) plane.rotor.style.transform = `rotate(${rotation}deg)`;
}

function startPlaneAnimation(planes: PlaneState[], rafRef: { current: number | null }) {
  if (planes.length === 0) return;

  if (prefersReducedMotion()) {
    planes.forEach((plane) => renderPlaneFrame(plane, 0.5, 1));
    return;
  }

  const start = performance.now();
  const tick = (now: number) => {
    const elapsed = now - start;
    planes.forEach((plane) => {
      const { t, dir } = planePhase(elapsed + plane.phaseOffsetMs, plane.flightMs, plane.pauseMs);
      renderPlaneFrame(plane, t, dir);
    });
    rafRef.current = requestAnimationFrame(tick);
  };
  rafRef.current = requestAnimationFrame(tick);
}

// Compute a curved arc as intermediate LatLng points (quadratic Bezier in geo space)
function arcPoints(
  from: [number, number], // [lng, lat]
  to: [number, number],
  steps = 40
): L.LatLngTuple[] {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;

  // Perpendicular lift: rotate midpoint vector 90° and scale by distance
  const dx = lng2 - lng1;
  const dy = lat2 - lat1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const lift = dist * 0.25;

  // Control point: midpoint shifted perpendicular (upward in map space)
  const ctrlLng = (lng1 + lng2) / 2 - dy * (lift / dist);
  const ctrlLat = (lat1 + lat2) / 2 + dx * (lift / dist);

  const pts: L.LatLngTuple[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = (1 - t) ** 2 * lng1 + 2 * (1 - t) * t * ctrlLng + t ** 2 * lng2;
    const lat = (1 - t) ** 2 * lat1 + 2 * (1 - t) * t * ctrlLat + t ** 2 * lat2;
    pts.push([lat, lng]);
  }
  return pts;
}

function makeMarkerIcon(color: string, pulse = false, borderColor = "white") {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:14px;height:14px;">
        ${pulse ? `<div style="
          position:absolute;inset:-5px;
          border-radius:50%;
          background:${color};
          opacity:0.25;
          animation:markerPulse 1.8s ease-out infinite;
        "></div>` : ""}
        <div style="
          width:14px;height:14px;
          border-radius:50%;
          background:${color};
          border:2.5px solid ${borderColor};
          box-shadow:0 1px 6px rgba(0,0,0,0.25);
        "></div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

const PULSE_CSS = `
  @keyframes markerPulse {
    0%   { transform:scale(1); opacity:0.35; }
    70%  { transform:scale(2.8); opacity:0; }
    100% { transform:scale(1); opacity:0; }
  }
`;

const TILES = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    markerBorder: "white",
    lineColor: "#1a4aa8",
    lineOpacity: 0.65,
    originColor: "#e8a020",
    destColor: "#2b6de8",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    markerBorder: "#0e2454",
    lineColor: "#4d8ef7",
    lineOpacity: 0.55,
    originColor: "#e8a020",
    destColor: "#6ba3ff",
  },
} as const;

interface LeafletMapInnerProps {
  routes: WorldMapRoute[];
  variant?: "dark" | "light";
  animatePlanes?: boolean;
}

export default function LeafletMapInner({
  routes,
  variant = "light",
  animatePlanes: animatePlanesEnabled = false,
}: LeafletMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Inject pulse keyframe CSS once
    if (!document.getElementById("leaflet-pulse-css")) {
      const style = document.createElement("style");
      style.id = "leaflet-pulse-css";
      style.textContent = PULSE_CSS;
      document.head.appendChild(style);
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
      attributionControl: true,
    });
    mapRef.current = map;

    if (variant === "dark") {
      containerRef.current.classList.add("leaflet-dark");
    }

    const theme = TILES[variant];

    L.tileLayer(theme.url, {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const [bakuLng, bakuLat] = BAKU_COORDS;

    L.marker([bakuLat, bakuLng], { icon: makeMarkerIcon(theme.originColor, true, theme.markerBorder) })
      .addTo(map)
      .bindPopup("<b>Bakı</b><br>Başlanğıc nöqtəsi");

    const allPoints: L.LatLngTuple[] = [[bakuLat, bakuLng]];
    const planes: PlaneState[] = [];

    routes.forEach((route, index) => {
      const [destLng, destLat] = route.to;
      allPoints.push([destLat, destLng]);

      const pts = arcPoints(BAKU_COORDS, route.to);
      L.polyline(pts, {
        color: theme.lineColor,
        weight: 2,
        opacity: theme.lineOpacity,
        dashArray: "6 4",
        lineCap: "round",
      }).addTo(map);

      L.marker([destLat, destLng], { icon: makeMarkerIcon(theme.destColor, true, theme.markerBorder) })
        .addTo(map)
        .bindPopup(`<b>${route.label}</b>`);

      if (animatePlanesEnabled) planes.push(buildPlane(map, route, pts, theme.lineColor, index));
    });

    if (animatePlanesEnabled) startPlaneAnimation(planes, rafRef);

    // Fit view to all points
    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [32, 32] });
    } else {
      map.setView([bakuLat, bakuLng], 5);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update routes without remounting the map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Stop the previous animation loop before tearing down its markers.
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Remove old layers (keep tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    const theme = TILES[variant];
    const [bakuLng, bakuLat] = BAKU_COORDS;
    L.marker([bakuLat, bakuLng], { icon: makeMarkerIcon(theme.originColor, true, theme.markerBorder) })
      .addTo(map)
      .bindPopup("<b>Bakı</b><br>Başlanğıc nöqtəsi");

    const allPoints: L.LatLngTuple[] = [[bakuLat, bakuLng]];
    const planes: PlaneState[] = [];

    routes.forEach((route, index) => {
      const [destLng, destLat] = route.to;
      allPoints.push([destLat, destLng]);

      const pts = arcPoints(BAKU_COORDS, route.to);
      L.polyline(pts, {
        color: theme.lineColor,
        weight: 2,
        opacity: theme.lineOpacity,
        dashArray: "6 4",
        lineCap: "round",
      }).addTo(map);

      L.marker([destLat, destLng], { icon: makeMarkerIcon(theme.destColor, true, theme.markerBorder) })
        .addTo(map)
        .bindPopup(`<b>${route.label}</b>`);

      if (animatePlanesEnabled) planes.push(buildPlane(map, route, pts, theme.lineColor, index));
    });

    if (animatePlanesEnabled) startPlaneAnimation(planes, rafRef);

    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [32, 32] });
    }
  }, [routes, variant, animatePlanesEnabled]);

  return <div ref={containerRef} className="h-full w-full" />;
}
