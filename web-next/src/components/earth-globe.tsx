"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Moon,
  Satellite,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const GLOBE_VIEWS = {
  satellite: {
    id: "satellite" as const,
    label: "Satellite",
    globeImageUrl:
      "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg",
    atmosphereColor: "#93c5fd",
    atmosphereAltitude: 0.18,
  },
  night: {
    id: "night" as const,
    label: "Night",
    globeImageUrl:
      "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg",
    atmosphereColor: "#5eead4",
    atmosphereAltitude: 0.23,
  },
};
import pakistanBorder from "@/data/pakistan-border.json";
import {
  EARTH_FOCUS,
  REGION_FILTERS,
  earthPinStats,
  earthPins,
  type EarthPin,
} from "@/lib/earth-destinations";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type GlobeHandle = {
  pointOfView: (
    pov: { lat: number; lng: number; altitude: number },
    transitionMs?: number
  ) => void;
  controls: () => {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping?: boolean;
  };
};

export default function EarthGlobe({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const globeRef = useRef<GlobeHandle | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<EarthPin | null>(null);
  const [size, setSize] = useState({ w: 1100, h: 700 });
  const [selected, setSelected] = useState<EarthPin | null>(null);
  const [ready, setReady] = useState(false);
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(!embedded);
  const [viewMode, setViewMode] = useState<"satellite" | "night">("satellite");
  const view = GLOBE_VIEWS[viewMode];

  selectedRef.current = selected;

  const polygons = useMemo(
    () => (pakistanBorder as { features: object[] }).features ?? [],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return earthPins.filter((p) => {
      if (region !== "all" && p.regionSlug !== region) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.slug.includes(q)
      );
    });
  }, [region, query]);

  const rings = useMemo(() => (selected ? [selected] : []), [selected]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({
        w: Math.max(320, Math.floor(r.width)),
        h: Math.max(480, Math.floor(r.height)),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const focusPakistan = useCallback((ms = 1400) => {
    globeRef.current?.pointOfView(
      {
        lat: EARTH_FOCUS.lat,
        lng: EARTH_FOCUS.lng,
        altitude: EARTH_FOCUS.altitude,
      },
      ms
    );
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      focusPakistan(1800);
      const controls = globeRef.current?.controls?.();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.28;
        controls.enableDamping = true;
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [ready, focusPakistan]);

  const onSelect = useCallback((pin: EarthPin | null) => {
    setSelected(pin);
    setPanelOpen(true);
    if (!pin) return;
    globeRef.current?.pointOfView(
      { lat: pin.lat, lng: pin.lng, altitude: 0.72 },
      1000
    );
    const controls = globeRef.current?.controls?.();
    if (controls) controls.autoRotate = false;
  }, []);

  return (
    <div
      className={
        embedded
          ? "relative h-full w-full overflow-hidden bg-[#02080f]"
          : "relative isolate min-h-[78vh] overflow-hidden rounded-[28px] border border-white/10 bg-[#02080f] shadow-[0_40px_100px_-40px_rgba(2,8,15,0.9)] lg:min-h-[84vh]"
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 58% 42%, rgba(16,185,129,0.2), transparent 62%), radial-gradient(ellipse 45% 35% at 15% 85%, rgba(56,189,248,0.1), transparent 55%), linear-gradient(180deg, rgba(2,8,15,0.05) 0%, rgba(2,8,15,0.65) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,.7), transparent), radial-gradient(1px 1px at 78% 18%, rgba(255,255,255,.45), transparent), radial-gradient(1.2px 1.2px at 36% 68%, rgba(255,255,255,.35), transparent), radial-gradient(1px 1px at 88% 58%, rgba(255,255,255,.55), transparent), radial-gradient(1px 1px at 55% 12%, rgba(255,255,255,.4), transparent)",
        }}
      />

      {/* Top chrome */}
      <div
        className={[
          "absolute z-20 flex flex-wrap items-start justify-between gap-3",
          embedded
            ? "inset-x-0 top-14 p-3 sm:top-16 sm:p-4"
            : "inset-x-0 top-0 p-4 sm:p-5",
        ].join(" ")}
      >
        {!embedded && (
          <div className="max-w-md rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white shadow-2xl backdrop-blur-xl">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              <Sparkles className="h-3 w-3" />
              Living Earth · Preview
            </p>
            <h2 className="mt-1.5 font-display text-[1.4rem] font-semibold leading-tight tracking-tight">
              Every destination, on Earth
            </h2>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">
              <b className="font-semibold text-white">
                {earthPinStats.count} pins
              </b>{" "}
              · hover a pin for its name · click to open details. Drag to orbit,
              scroll to zoom.
            </p>
          </div>
        )}

        <div
          className={[
            "flex flex-wrap items-center gap-2",
            embedded ? "ml-auto" : "",
          ].join(" ")}
        >
          <div className="inline-flex rounded-full border border-white/15 bg-black/35 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("satellite")}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                viewMode === "satellite"
                  ? "bg-white text-ink shadow"
                  : "text-white/75 hover:text-white",
              ].join(" ")}
            >
              <Satellite className="h-3.5 w-3.5" />
              Day
            </button>
            <button
              type="button"
              onClick={() => setViewMode("night")}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                viewMode === "night"
                  ? "bg-white text-ink shadow"
                  : "text-white/75 hover:text-white",
              ].join(" ")}
            >
              <Moon className="h-3.5 w-3.5" />
              Night
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              focusPakistan();
              const controls = globeRef.current?.controls?.();
              if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.28;
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[12px] font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <Compass className="h-3.5 w-3.5" />
            Focus Pakistan
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-3.5 py-2 text-[12px] font-semibold text-[#042f2e] shadow-lg shadow-emerald-900/40 transition hover:brightness-110"
          >
            {panelOpen ? "Hide list" : "Browse pins"}
          </button>
        </div>
      </div>

      {/* Region chips */}
      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-4 sm:bottom-5">
        <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/45 p-1.5 shadow-2xl backdrop-blur-xl">
          {REGION_FILTERS.map((r) => {
            const active = region === r.slug;
            return (
              <button
                key={r.slug}
                type="button"
                onClick={() => setRegion(r.slug)}
                className={[
                  "shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition",
                  active
                    ? "bg-white text-ink shadow"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                  style={{ background: r.color }}
                />
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={wrapRef} className="absolute inset-0 z-0" data-lenis-prevent>
        <Globe
          ref={globeRef as never}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={view.globeImageUrl}
          bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
          atmosphereColor={view.atmosphereColor}
          atmosphereAltitude={view.atmosphereAltitude}
          polygonsData={polygons}
          polygonCapColor={() =>
            viewMode === "satellite"
              ? "rgba(16, 185, 129, 0.32)"
              : "rgba(16, 185, 129, 0.42)"
          }
          polygonSideColor={() => "rgba(52, 211, 153, 0.2)"}
          polygonStrokeColor={() => "#34d399"}
          polygonAltitude={0.015}
          pointsData={filtered}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={(d) =>
            (d as EarthPin).slug === selectedRef.current?.slug
              ? 0.04
              : (d as EarthPin).featured
                ? 0.024
                : 0.016
          }
          pointRadius={(d) => {
            const p = d as EarthPin;
            if (p.slug === selectedRef.current?.slug) return 0.48;
            if (p.featured) return 0.26;
            return 0.16;
          }}
          pointColor={(d) => {
            const p = d as EarthPin;
            if (p.slug === selectedRef.current?.slug) return "#ffffff";
            return p.color;
          }}
          // Name only on hover — never paint all labels on the globe.
          pointLabel={(d) => {
            const p = d as EarthPin;
            const name = p.name.trim().replace(/</g, "&lt;");
            const region = p.region.replace(/</g, "&lt;");
            return `<div style="font:600 12px/1.25 system-ui,sans-serif;padding:8px 11px;border-radius:12px;background:rgba(6,19,42,.94);color:#fff;box-shadow:0 14px 34px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.12)"><div>${name}</div><div style="font:500 11px/1.3;opacity:.68;margin-top:3px">${region}</div><div style="font:500 10px/1.3;opacity:.45;margin-top:4px">Click for details</div></div>`;
          }}
          onPointHover={(d) => {
            const el = document.body;
            el.style.cursor = d ? "pointer" : "grab";
          }}
          onPointClick={(d) => onSelect(d as EarthPin)}
          ringsData={rings}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) =>
            `rgba(110,231,183,${Math.sqrt(1 - t)})`
          }
          ringMaxRadius={2.2}
          ringPropagationSpeed={2.2}
          ringRepeatPeriod={900}
          labelsData={[]}
          onGlobeReady={() => setReady(true)}
        />
      </div>

      {panelOpen && (
        <aside className="absolute bottom-[4.75rem] right-4 top-[5.5rem] z-20 flex w-[min(360px,calc(100%-2rem))] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#071018]/80 text-white shadow-2xl backdrop-blur-2xl sm:right-5">
          <div className="flex items-start justify-between gap-2 border-b border-white/10 px-4 py-3.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
                {filtered.length} of {earthPinStats.count}
              </p>
              <p className="font-display text-base font-semibold">
                {selected ? selected.name.trim() : "Destination atlas"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-white/10 px-3 py-2.5">
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all destinations…"
                className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
              />
            </label>
          </div>

          {selected && (
            <div className="border-b border-white/10 bg-gradient-to-br from-emerald-400/15 via-transparent to-sky-400/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: selected.color }}
                />
                <p className="text-[11.5px] text-emerald-200/90">
                  {selected.region}
                </p>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/75">
                {selected.blurb ||
                  "Explore this destination on Salam Pakistan."}
              </p>
              <Link
                href={selected.href}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink transition hover:bg-emerald-50"
              >
                Open destination
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <ul className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto p-2">
            {filtered.map((pin) => {
              const active = selected?.slug === pin.slug;
              return (
                <li key={pin.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(pin)}
                    className={[
                      "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition",
                      active
                        ? "bg-white text-ink shadow"
                        : "text-white/90 hover:bg-white/[0.08]",
                    ].join(" ")}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/25"
                      style={{ background: pin.color }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">
                        {pin.name.trim()}
                      </span>
                      <span
                        className={[
                          "block truncate text-[11px]",
                          active ? "text-ink/55" : "text-white/45",
                        ].join(" ")}
                      >
                        {pin.region}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-8 text-center text-[13px] text-white/50">
                No destinations match that filter.
              </li>
            )}
          </ul>
        </aside>
      )}
    </div>
  );
}
