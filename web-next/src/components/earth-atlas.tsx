"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Compass,
  Earth,
  Gamepad2,
  List,
  Satellite,
  X,
} from "lucide-react";
import {
  REGION_FILTERS,
  earthPinStats,
  earthPins,
  type EarthPin,
} from "@/lib/earth-destinations";
import { SALAM_GREEN } from "@/lib/earth-brand";

const EarthGlobe = dynamic(() => import("@/components/earth-globe"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-[#02080f] text-sm text-white/60">
      Loading 3D globe…
    </div>
  ),
});

const EarthSatelliteMap = dynamic(
  () => import("@/components/earth-satellite-map"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-[#02080f] text-sm text-white/60">
        Loading satellite map…
      </div>
    ),
  }
);

const EarthPinSearchList = dynamic(
  () =>
    import("@/components/earth-satellite-map").then((m) => m.EarthPinSearchList),
  { ssr: false }
);

const EarthMapGame = dynamic(() => import("@/components/earth-map-game"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-[#02080f] text-sm text-white/60">
      Loading game…
    </div>
  ),
});

type Mode = "satellite" | "globe" | "games";
type Focus = "pakistan" | "world";

export default function EarthAtlas() {
  const [mode, setMode] = useState<Mode>("satellite");
  const [focus, setFocus] = useState<Focus>("pakistan");
  const [selected, setSelected] = useState<EarthPin | null>(null);
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");
  const [listOpen, setListOpen] = useState(false);

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

  return (
    <div className="relative isolate h-[78vh] min-h-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#02080f] shadow-[0_40px_100px_-40px_rgba(2,8,15,0.9)] lg:h-[84vh]">
      {/* Thin top chrome */}
      <div className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-white/12 bg-black/45 p-1 backdrop-blur-xl">
            {(
              [
                { id: "satellite", label: "Satellite", Icon: Satellite },
                { id: "globe", label: "3D Globe", Icon: Earth },
                { id: "games", label: "Games", Icon: Gamepad2 },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                  mode === id
                    ? "bg-white text-ink shadow"
                    : "text-white/75 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {mode !== "games" && (
            <div className="inline-flex rounded-full border border-white/12 bg-black/45 p-1 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setFocus("pakistan")}
                className={[
                  "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                  focus === "pakistan"
                    ? "bg-white text-ink"
                    : "text-white/75 hover:text-white",
                ].join(" ")}
              >
                Pakistan
              </button>
              <button
                type="button"
                onClick={() => setFocus("world")}
                className={[
                  "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                  focus === "world"
                    ? "bg-white text-ink"
                    : "text-white/75 hover:text-white",
                ].join(" ")}
              >
                Whole world
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "satellite" && (
            <button
              type="button"
              onClick={() => setListOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md hover:bg-white/15"
            >
              <List className="h-3.5 w-3.5" />
              {listOpen ? "Hide list" : "Browse pins"}
            </button>
          )}
          <Link
            href="/map/3d-map"
            className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[12px] font-semibold text-white/80 backdrop-blur hover:text-white"
          >
            Illustrated map
          </Link>
        </div>
      </div>

      {/* Brand note */}
      {mode !== "games" && (
        <div className="absolute left-3 top-[3.6rem] z-20 max-w-[240px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white backdrop-blur-md sm:left-4 sm:top-16">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            <Compass className="h-3 w-3" />
            Salam Pakistan
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-white/70">
            Border in brand green{" "}
            <span
              className="mx-0.5 inline-block h-2 w-2 rounded-full align-middle"
              style={{ background: SALAM_GREEN }}
            />{" "}
            <code className="text-[10px] text-white/55">{SALAM_GREEN}</code>
            {" · "}
            {earthPinStats.count} destinations
          </p>
        </div>
      )}

      {/* Region chips — satellite only */}
      {mode === "satellite" && (
        <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/45 p-1.5 backdrop-blur-xl">
            {REGION_FILTERS.map((r) => {
              const active = region === r.slug;
              return (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => setRegion(r.slug)}
                  className={[
                    "shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition",
                    active
                      ? "bg-white text-ink shadow"
                      : "text-white/75 hover:bg-white/10",
                  ].join(" ")}
                >
                  <span
                    className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                    style={{ background: r.color }}
                  />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stage */}
      <div className="absolute inset-0 z-0">
        {mode === "satellite" && (
          <EarthSatelliteMap
            focus={focus}
            selected={selected}
            onSelect={setSelected}
            regionFilter={region}
            query={query}
          />
        )}
        {mode === "globe" && <EarthGlobe embedded />}
        {mode === "games" && <EarthMapGame />}
      </div>

      {/* Optional pin list */}
      {mode === "satellite" && listOpen && (
        <aside className="absolute bottom-16 right-3 top-16 z-30 flex w-[min(300px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#071018]/85 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
            <p className="text-[12px] font-semibold">
              {filtered.length} destinations
            </p>
            <button
              type="button"
              onClick={() => setListOpen(false)}
              className="rounded-lg p-1 text-white/60 hover:bg-white/10"
              aria-label="Close list"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <EarthPinSearchList
            pins={filtered}
            selectedSlug={selected?.slug}
            query={query}
            onQuery={setQuery}
            onPick={(p) => {
              setSelected(p);
              setFocus("pakistan");
            }}
          />
        </aside>
      )}
    </div>
  );
}
