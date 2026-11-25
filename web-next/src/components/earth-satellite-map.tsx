"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  NavigationControl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import pakistanBorder from "@/data/pakistan-border.json";
import {
  earthPins,
  earthPinStats,
  type EarthPin,
} from "@/lib/earth-destinations";
import {
  PAKISTAN_BOUNDS,
  PAKISTAN_CENTER,
  SALAM_GREEN,
  WORLD_CENTER,
} from "@/lib/earth-brand";
import { ensureMapLibreWorker } from "@/lib/maplibre-setup";

type Props = {
  focus: "pakistan" | "world";
  selected: EarthPin | null;
  onSelect: (pin: EarthPin | null) => void;
  regionFilter: string;
  query: string;
};

function pinsToGeoJSON(pins: EarthPin[]) {
  return {
    type: "FeatureCollection" as const,
    features: pins.map((p) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [p.lng, p.lat],
      },
      properties: {
        slug: p.slug,
        name: p.name.trim(),
        region: p.region,
        regionSlug: p.regionSlug,
        href: p.href,
        blurb: p.blurb,
        color: p.color,
        featured: p.featured,
        exact: p.exact,
      },
    })),
  };
}

export default function EarthSatelliteMap({
  focus,
  selected,
  onSelect,
  regionFilter,
  query,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [hover, setHover] = useState<{
    name: string;
    region: string;
    x: number;
    y: number;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return earthPins.filter((p) => {
      if (regionFilter !== "all" && p.regionSlug !== regionFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.slug.includes(q)
      );
    });
  }, [regionFilter, query]);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    ensureMapLibreWorker();

    const el = containerRef.current;
    // MapLibre CSS forces position:relative on the container — give it real size.
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.minHeight = "100%";

    const map = new MapLibreMap({
      container: el,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution:
              "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "satellite",
            type: "raster",
            source: "satellite",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: PAKISTAN_CENTER,
      zoom: 4.6,
      minZoom: 1.2,
      maxZoom: 12,
      attributionControl: { compact: true },
    });

    map.addControl(
      new NavigationControl({ visualizePitch: false }),
      "bottom-right"
    );

    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(el);
    // Second pass after layout settles (dynamic import / flex).
    requestAnimationFrame(() => map.resize());
    window.setTimeout(() => map.resize(), 120);
    window.setTimeout(() => map.resize(), 400);

    map.on("load", () => {
      map.addSource("pakistan", {
        type: "geojson",
        data: pakistanBorder as never,
      });

      // Soft brand fill
      map.addLayer({
        id: "pakistan-fill",
        type: "fill",
        source: "pakistan",
        paint: {
          "fill-color": SALAM_GREEN,
          "fill-opacity": 0.22,
        },
      });

      // Strong Salam green border (logo brand)
      map.addLayer({
        id: "pakistan-outline",
        type: "line",
        source: "pakistan",
        paint: {
          "line-color": SALAM_GREEN,
          "line-width": 2.75,
          "line-opacity": 0.95,
        },
      });

      map.addSource("destinations", {
        type: "geojson",
        data: pinsToGeoJSON(earthPins),
      });

      // Zoom LOD: tiny dots far out → clearer pins when zoomed in
      map.addLayer({
        id: "dest-glow",
        type: "circle",
        source: "destinations",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3,
            4,
            6,
            8,
            9,
            14,
          ],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.22,
          "circle-blur": 0.8,
        },
      });

      map.addLayer({
        id: "dest-pins",
        type: "circle",
        source: "destinations",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3,
            ["case", ["get", "featured"], 3.2, 2],
            5,
            ["case", ["get", "featured"], 4.5, 3],
            7,
            ["case", ["get", "featured"], 6, 4.2],
            9,
            ["case", ["get", "featured"], 7.5, 5.5],
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3,
            0.8,
            8,
            1.6,
          ],
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2.5,
            0.35,
            4,
            0.85,
            6,
            1,
          ],
        },
      });

      // Selected ring
      map.addSource("selected-pin", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "selected-ring",
        type: "circle",
        source: "selected-pin",
        paint: {
          "circle-radius": 14,
          "circle-color": "transparent",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2.5,
          "circle-opacity": 1,
        },
      });
      map.addLayer({
        id: "selected-core",
        type: "circle",
        source: "selected-pin",
        paint: {
          "circle-radius": 6,
          "circle-color": "#ffffff",
          "circle-stroke-color": SALAM_GREEN,
          "circle-stroke-width": 2,
        },
      });
    });

    const onEnter = (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      const f = e.features?.[0];
      if (!f?.properties) return;
      setHover({
        name: String(f.properties.name),
        region: String(f.properties.region),
        x: e.point.x,
        y: e.point.y,
      });
    };
    const onMove = (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      setHover({
        name: String(f.properties.name),
        region: String(f.properties.region),
        x: e.point.x,
        y: e.point.y,
      });
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = "";
      setHover(null);
    };
    const onClick = (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const slug = String(f.properties.slug);
      const pin = earthPins.find((p) => p.slug === slug) ?? null;
      onSelect(pin);
    };

    map.on("mouseenter", "dest-pins", onEnter);
    map.on("mousemove", "dest-pins", onMove);
    map.on("mouseleave", "dest-pins", onLeave);
    map.on("click", "dest-pins", onClick);

    mapRef.current = map;
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update pin source when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource("destinations") as GeoJSONSource | undefined;
      src?.setData(pinsToGeoJSON(filtered));
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [filtered]);

  // Focus Pakistan / World
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (focus === "world") {
      map.easeTo({ center: WORLD_CENTER, zoom: 1.6, duration: 1100 });
    } else {
      map.fitBounds(PAKISTAN_BOUNDS, { padding: 56, duration: 1100, maxZoom: 5.4 });
    }
  }, [focus]);

  // Fly to selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("selected-pin") as GeoJSONSource | undefined;
    if (!selected) {
      src?.setData({ type: "FeatureCollection", features: [] });
      return;
    }
    src?.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [selected.lng, selected.lat],
          },
          properties: {},
        },
      ],
    });
    map.easeTo({
      center: [selected.lng, selected.lat],
      zoom: Math.max(map.getZoom(), 6.5),
      duration: 900,
    });
  }, [selected]);

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden"
      data-lenis-prevent
    >
      {/* Must be a sized block — MapLibre overrides Tailwind `absolute` via CSS */}
      <div ref={containerRef} className="h-full w-full" />

      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[120%] rounded-xl border border-white/15 bg-[#06132a]/94 px-3 py-2 text-white shadow-2xl backdrop-blur"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="text-[12.5px] font-semibold">{hover.name}</p>
          <p className="text-[11px] text-white/65">{hover.region}</p>
        </div>
      )}

      {selected && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm rounded-2xl border border-white/15 bg-[#071018]/88 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {selected.region}
              </p>
              <p className="mt-1 font-display text-lg font-semibold">
                {selected.name.trim()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
            {selected.blurb || "Explore this destination on Salam Pakistan."}
          </p>
          <Link
            href={selected.href}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink"
          >
            Open destination
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur">
        Satellite · {filtered.length}/{earthPinStats.count} pins · hover for name
      </div>
    </div>
  );
}

/** Compact list used by the atlas chrome */
export function EarthPinSearchList({
  pins,
  selectedSlug,
  onPick,
  query,
  onQuery,
}: {
  pins: EarthPin[];
  selectedSlug?: string;
  onPick: (p: EarthPin) => void;
  query: string;
  onQuery: (q: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <label className="m-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <Search className="h-3.5 w-3.5 text-white/45" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search destinations…"
          className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
        />
      </label>
      <ul className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
        {pins.slice(0, 120).map((pin) => {
          const active = pin.slug === selectedSlug;
          return (
            <li key={pin.slug}>
              <button
                type="button"
                onClick={() => onPick(pin)}
                className={[
                  "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[13px] transition",
                  active
                    ? "bg-white font-semibold text-ink"
                    : "text-white/90 hover:bg-white/10",
                ].join(" ")}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: pin.color }}
                />
                <span className="truncate">{pin.name.trim()}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
