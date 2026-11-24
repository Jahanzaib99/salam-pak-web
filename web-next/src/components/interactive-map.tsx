"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  RotateCcw,
  X,
  Plane,
  Bus,
  Train,
  MapPinned,
  Route,
  ChevronDown,
} from "lucide-react";
import {
  MAP_TABS,
  MapPin,
  MapTab,
  cutoutSrc,
  cutoutSrcSet,
  toCutoutPin,
} from "@/lib/map-views";
import {
  ORIGIN_CITIES,
  OriginCityId,
  buildItinerary,
  type ItineraryPlan,
  type TravelMode,
} from "@/lib/map-itinerary";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.5;
const ZOOM_STEP = 0.35;

export default function InteractiveMap() {
  const [tabId, setTabId] = useState(MAP_TABS[0].id);
  const tab = useMemo(
    () => MAP_TABS.find((t) => t.id === tabId) ?? MAP_TABS[0],
    [tabId]
  );
  const pins = useMemo(() => tab.hotspots.map((h) => toCutoutPin(h, tab)), [tab]);
  const [planeW, setPlaneW] = useState(() => Math.max(...MAP_TABS[0].tiers));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitScale, setFitScale] = useState(0.28);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [originCity, setOriginCity] = useState<OriginCityId | "">("");
  const [listQuery, setListQuery] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  const selected = pins.find((p) => p.id === selectedId) ?? null;
  const plan = useMemo(() => {
    if (!selected || !originCity) return null;
    return buildItinerary(selected, originCity);
  }, [selected, originCity]);
  const viewScale = fitScale * zoomLevel;

  const filtered = useMemo(() => {
    const q = listQuery.trim().toLowerCase();
    if (!q) return pins;
    return pins.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        String(p.n).includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [pins, listQuery]);

  const resetView = useCallback(() => {
    setZoomLevel(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const switchTab = (next: MapTab) => {
    setTabId(next.id);
    setSelectedId(null);
    setOriginCity("");
    setListQuery("");
    resetView();
  };

  const zoomBy = useCallback((delta: number) => {
    setZoomLevel((z) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + delta).toFixed(2)))
    );
  }, []);

  useEffect(() => {
    setSelectedId(null);
    setOriginCity("");
    setPlaneW(Math.max(...tab.tiers));
  }, [tabId, tab.tiers]);

  // Reset city when switching pins so the dropdown feels intentional.
  useEffect(() => {
    setOriginCity("");
  }, [selectedId]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const pad = 48;
      const availW = Math.max(280, el.clientWidth - pad);
      const availH = Math.max(220, el.clientHeight - pad);
      const planeH = planeW / tab.imageAspect;
      setFitScale(Math.min(availW / planeW, availH / planeH));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [planeW, tab.imageAspect]);

  const selectPin = (pin: MapPin) => {
    setSelectedId((id) => (id === pin.id ? null : pin.id));
  };

  const startPan = (e: React.PointerEvent<HTMLDivElement>) => {
    // Never steal pointer from zoom controls / pins / links.
    const t = e.target as HTMLElement;
    if (t.closest("[data-map-ui], button, a, input")) return;

    moved.current = false;
    dragging.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Explore Pakistan
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Interactive 3D maps
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          The red pins are part of the PTDC artwork. Tap a pin, choose Lahore,
          Karachi or Islamabad as your starting city, and get a suggested
          itinerary on the right.
        </p>

        <nav
          className="mt-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Map views"
        >
          {MAP_TABS.map((t) => {
            const active = t.id === tab.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchTab(t)}
                className={
                  active
                    ? "rounded-full px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-brand/40"
                }
                style={active ? { backgroundColor: t.accent } : undefined}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
        <p className="mt-3 text-sm text-ink-soft">{tab.blurb}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative overflow-hidden rounded-[24px] border border-line bg-[#e8f0ec]">
          <div
            ref={stageRef}
            className="relative h-[min(72vh,720px)] w-full cursor-grab touch-none select-none active:cursor-grabbing"
            onWheel={(e) => {
              e.preventDefault();
              zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
            }}
            onPointerDown={startPan}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              moved.current = true;
              setPos({
                x: e.clientX - dragging.current.x,
                y: e.clientY - dragging.current.y,
              });
            }}
            onPointerUp={() => {
              dragging.current = null;
            }}
            onPointerCancel={() => {
              dragging.current = null;
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspective: tilt ? "1400px" : undefined }}
            >
              <div
                className="relative origin-center shrink-0"
                style={{
                  width: planeW,
                  minWidth: planeW,
                  maxWidth: planeW,
                  aspectRatio: String(tab.imageAspect),
                  transform: tilt
                    ? `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${viewScale}) rotateX(14deg) rotateZ(-1.5deg)`
                    : `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${viewScale})`,
                  transition: dragging.current
                    ? "none"
                    : "transform 160ms ease-out",
                }}
                onClick={() => {
                  if (!moved.current) setSelectedId(null);
                }}
              >
                <picture className="pointer-events-none absolute inset-0 block h-full w-full">
                  <source
                    type="image/webp"
                    srcSet={cutoutSrcSet(tab)}
                    sizes={`${Math.max(...tab.tiers)}px`}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={tab.id}
                    src={cutoutSrc(tab, "webp")}
                    srcSet={cutoutSrcSet(tab)}
                    sizes={`${Math.max(...tab.tiers)}px`}
                    width={planeW}
                    height={Math.round(planeW / tab.imageAspect)}
                    alt={`${tab.label} tourist guide map`}
                    draggable={false}
                    decoding="async"
                    fetchPriority="high"
                    onLoad={(e) => {
                      const w = e.currentTarget.naturalWidth;
                      if (w > 0) setPlaneW(w);
                    }}
                    className="h-full w-full max-w-none object-contain drop-shadow-[0_28px_50px_rgba(15,40,30,0.28)]"
                  />
                </picture>

                {pins.map((pin) => {
                  const isSelected = selectedId === pin.id;
                  // Hit target stays ~44px on screen at any zoom.
                  const screenHit = 44 / Math.max(viewScale, 0.05);
                  const hit = Math.min(
                    10,
                    Math.max(pin.wPct, pin.hPct, (screenHit / planeW) * 100)
                  );
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      data-map-ui
                      aria-label={`${pin.n}. ${pin.title}`}
                      title={pin.title}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPin(pin);
                      }}
                      className={
                        isSelected
                          ? "map-pin is-selected"
                          : "map-pin"
                      }
                      style={{
                        left: `${pin.xPct}%`,
                        top: `${pin.yPct}%`,
                        width: `${hit}%`,
                        height: `${hit}%`,
                        transform: "translate(-50%, -50%)",
                        zIndex: isSelected ? 30 : undefined,
                      }}
                    >
                      {/* Soft dual ripple — Google Maps style presence */}
                      <span className="map-pin__pulse" aria-hidden />
                      <span className="map-pin__pulse-2" aria-hidden />
                      <span className="map-pin__shadow" aria-hidden />
                      {/* Rings the printed red pin; remount to replay bounce */}
                      <span
                        key={isSelected ? `bounce-${pin.id}` : `idle-${pin.id}`}
                        className="map-pin__ring"
                        aria-hidden
                      />
                      <span className="map-pin__hit" />
                      <span className="sr-only">{pin.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls — outside pan capture via data-map-ui */}
            <div
              data-map-ui
              className="absolute bottom-4 right-4 z-30 flex flex-col gap-2"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                data-map-ui
                aria-label="Zoom in"
                onClick={(e) => {
                  e.stopPropagation();
                  zoomBy(ZOOM_STEP);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm hover:bg-cloud"
              >
                <Plus size={18} />
              </button>
              <button
                type="button"
                data-map-ui
                aria-label="Zoom out"
                onClick={(e) => {
                  e.stopPropagation();
                  zoomBy(-ZOOM_STEP);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm hover:bg-cloud"
              >
                <Minus size={18} />
              </button>
              <button
                type="button"
                data-map-ui
                aria-label="Reset view"
                onClick={(e) => {
                  e.stopPropagation();
                  resetView();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm hover:bg-cloud"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                data-map-ui
                aria-pressed={tilt}
                aria-label={tilt ? "Flatten map" : "Tilt map"}
                onClick={(e) => {
                  e.stopPropagation();
                  setTilt((t) => !t);
                }}
                className="flex h-10 items-center justify-center rounded-full border border-line bg-white px-3 text-xs font-semibold uppercase tracking-wide text-ink shadow-sm hover:bg-cloud"
              >
                {tilt ? "3D" : "2D"}
              </button>
            </div>

            <p className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-[240px] rounded-full bg-white/85 px-3 py-1.5 text-xs text-ink-soft backdrop-blur-sm">
              Drag to pan · +/− to zoom · tap a red pin
            </p>
          </div>

          {selected && (
            <div className="border-t border-line bg-white p-5 lg:hidden">
              <PinDetail
                pin={selected}
                originCity={originCity}
                onOriginChange={setOriginCity}
                plan={plan}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}
        </div>

        <aside className="flex max-h-[min(78vh,820px)] flex-col overflow-hidden rounded-[24px] border border-line bg-white">
          {!selected ? (
            <>
              <div className="border-b border-line p-4">
                <label className="sr-only" htmlFor="map-pin-search">
                  Search pins
                </label>
                <input
                  id="map-pin-search"
                  type="search"
                  placeholder="Search pins…"
                  value={listQuery}
                  onChange={(e) => setListQuery(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cloud px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
                <p className="mt-2 text-xs text-ink-soft">
                  {filtered.length} of {pins.length} places · tap a pin to plan
                </p>
              </div>

              <ul className="min-h-0 flex-1 overflow-y-auto p-2">
                {filtered.map((pin) => (
                  <li key={pin.id}>
                    <button
                      type="button"
                      onClick={() => selectPin(pin)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-ink hover:bg-cloud"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cloud text-xs font-bold text-brand">
                        {pin.n}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-snug">
                          {pin.title}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-xs text-ink-soft">
                          {pin.description}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="hidden min-h-0 flex-1 overflow-y-auto lg:block">
              <div className="p-4">
                <PinDetail
                  pin={selected}
                  originCity={originCity}
                  onOriginChange={setOriginCity}
                  plan={plan}
                  onClose={() => setSelectedId(null)}
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function modeIcon(mode?: TravelMode) {
  switch (mode) {
    case "flight":
      return Plane;
    case "rail":
      return Train;
    case "road":
    case "bus":
      return Bus;
    case "return":
      return Route;
    default:
      return MapPinned;
  }
}

function PinDetail({
  pin,
  originCity,
  onOriginChange,
  plan,
  onClose,
}: {
  pin: MapPin;
  originCity: OriginCityId | "";
  onOriginChange: (id: OriginCityId | "") => void;
  plan: ItineraryPlan | null;
  onClose: () => void;
}) {
  const origin = ORIGIN_CITIES.find((c) => c.id === originCity);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Pin {pin.n}
          </p>
          <h3 className="mt-1 font-display text-xl text-ink">{pin.title}</h3>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="rounded-full p-1 text-ink-soft hover:bg-cloud hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{pin.description}</p>
      {pin.href && (
        <Link
          href={pin.href}
          className="mt-3 inline-flex text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          Explore destination →
        </Link>
      )}

      <div className="mt-5 rounded-2xl border border-line bg-cloud/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          Plan your trip
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Choose Lahore, Karachi or Islamabad — we&apos;ll build a day-by-day
          route to <span className="font-medium text-ink">{pin.title}</span>{" "}
          with travel times and tips.
        </p>

        <label className="mt-4 block text-xs font-semibold text-ink" htmlFor="origin-city">
          Starting city
        </label>
        <div className="relative mt-1.5">
          <select
            id="origin-city"
            value={originCity}
            onChange={(e) =>
              onOriginChange((e.target.value || "") as OriginCityId | "")
            }
            className="w-full appearance-none rounded-xl border border-line bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-ink outline-none focus:border-brand"
          >
            <option value="">Select city…</option>
            {ORIGIN_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
        </div>

        {origin && (
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            {origin.airport} · {origin.blurb}
          </p>
        )}
      </div>

      {plan && origin && (
        <div className="mt-5 space-y-5">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="font-display text-base font-semibold text-ink">
                {origin.name} → {pin.title}
              </h4>
              <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                {plan.durationLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{plan.summary}</p>
            <p className="mt-2 text-xs text-ink-soft">
              <span className="font-semibold text-ink">Best season:</span>{" "}
              {plan.bestSeason}
            </p>
          </div>

          {plan.transportOptions.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                How to get there
              </p>
              <ul className="mt-2 space-y-2">
                {plan.transportOptions.map((opt) => {
                  const Icon = modeIcon(opt.mode);
                  return (
                    <li
                      key={opt.label}
                      className="rounded-xl border border-line bg-white p-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cloud text-brand">
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink">{opt.label}</p>
                          <p className="text-xs font-medium text-brand">{opt.duration}</p>
                          {opt.costHint && (
                            <p className="mt-0.5 text-xs text-ink-soft">{opt.costHint}</p>
                          )}
                          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                            {opt.note}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              Day-by-day
            </p>
            <ol className="relative mt-3 space-y-5 border-l-2 border-line pl-5">
              {plan.steps.map((step) => {
                const Icon = modeIcon(step.mode);
                return (
                  <li key={`${step.day}-${step.title}`} className="relative">
                    <span className="absolute -left-[27px] flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
                      <Icon className="h-3 w-3" aria-hidden />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                      {step.day}
                    </span>
                    <p className="mt-0.5 text-sm font-semibold leading-snug text-ink">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                      {step.note}
                    </p>
                    {step.durationHint && (
                      <p className="mt-1 text-[11px] font-medium text-brand">
                        {step.durationHint}
                      </p>
                    )}
                    {step.activities && step.activities.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {step.activities.map((a) => (
                          <li
                            key={a}
                            className="flex gap-2 text-xs leading-snug text-ink-soft"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.overnight && (
                      <p className="mt-2 text-[11px] text-ink-soft">
                        Overnight:{" "}
                        <span className="font-semibold text-ink">{step.overnight}</span>
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {plan.tips.length > 0 && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Traveller tips
              </p>
              <ul className="mt-2 space-y-1.5">
                {plan.tips.map((tip) => (
                  <li key={tip} className="text-xs leading-relaxed text-amber-950/80">
                    · {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pb-1">
            <Link
              href="/booking-flight"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
            >
              <Plane className="h-3.5 w-3.5" />
              Flights
            </Link>
            <Link
              href="/booking-bus"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink hover:border-brand/40"
            >
              <Bus className="h-3.5 w-3.5" />
              Buses
            </Link>
            <Link
              href="/booking-railway"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink hover:border-brand/40"
            >
              <Train className="h-3.5 w-3.5" />
              Rail
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
