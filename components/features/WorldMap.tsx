"use client";

import dynamic from "next/dynamic";
import { WorldMapRoute } from "@/lib/constants";
import { Skeleton } from "@/components/ui/Skeleton";

interface WorldMapProps {
  routes: WorldMapRoute[];
  height?: number;
  className?: string;
  variant?: "dark" | "light";
}

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function WorldMap({ routes, height = 300, className, variant = "light" }: WorldMapProps) {
  return (
    <div
      style={{ height }}
      className={`relative w-full overflow-hidden rounded-xl ${className ?? ""}`}
    >
      <LeafletMapInner routes={routes} variant={variant} />
    </div>
  );
}
