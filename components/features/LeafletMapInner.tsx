"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BAKU_COORDS, WorldMapRoute } from "@/lib/constants";

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

function makeMarkerIcon(color: string, pulse = false) {
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
          border:2.5px solid white;
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

interface LeafletMapInnerProps {
  routes: WorldMapRoute[];
}

export default function LeafletMapInner({ routes }: LeafletMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

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

    // CartoDB Voyager — closest free tile to Google Maps style
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    const [bakuLng, bakuLat] = BAKU_COORDS;

    // Baku marker (origin — gold)
    L.marker([bakuLat, bakuLng], { icon: makeMarkerIcon("#e8a020", true) })
      .addTo(map)
      .bindPopup("<b>Bakı</b><br>Başlanğıc nöqtəsi");

    const allPoints: L.LatLngTuple[] = [[bakuLat, bakuLng]];

    routes.forEach((route) => {
      const [destLng, destLat] = route.to;
      allPoints.push([destLat, destLng]);

      // Curved arc line
      const pts = arcPoints(BAKU_COORDS, route.to);
      L.polyline(pts, {
        color: "#1a4aa8",
        weight: 2,
        opacity: 0.65,
        dashArray: "6 4",
        lineCap: "round",
      }).addTo(map);

      // Destination marker (blue)
      L.marker([destLat, destLng], { icon: makeMarkerIcon("#2b6de8", true) })
        .addTo(map)
        .bindPopup(`<b>${route.label}</b>`);
    });

    // Fit view to all points
    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [32, 32] });
    } else {
      map.setView([bakuLat, bakuLng], 5);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update routes without remounting the map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old layers (keep tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    const [bakuLng, bakuLat] = BAKU_COORDS;
    L.marker([bakuLat, bakuLng], { icon: makeMarkerIcon("#e8a020", true) })
      .addTo(map)
      .bindPopup("<b>Bakı</b><br>Başlanğıc nöqtəsi");

    const allPoints: L.LatLngTuple[] = [[bakuLat, bakuLng]];

    routes.forEach((route) => {
      const [destLng, destLat] = route.to;
      allPoints.push([destLat, destLng]);

      const pts = arcPoints(BAKU_COORDS, route.to);
      L.polyline(pts, {
        color: "#1a4aa8",
        weight: 2,
        opacity: 0.65,
        dashArray: "6 4",
        lineCap: "round",
      }).addTo(map);

      L.marker([destLat, destLng], { icon: makeMarkerIcon("#2b6de8", true) })
        .addTo(map)
        .bindPopup(`<b>${route.label}</b>`);
    });

    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [32, 32] });
    }
  }, [routes]);

  return <div ref={containerRef} className="h-full w-full" />;
}
