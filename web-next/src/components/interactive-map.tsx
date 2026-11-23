"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import {
  MAP_TABS,
  MapPin,
  MapTab,
  cutoutSrc,
  cutoutSrcSet,
  toCutoutPin,
} from "@/lib/map-views";

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
  const [listQuery, setListQuery] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  const selected = pins.find((p) => p.id === selectedId) ?? null;
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
    setPlaneW(Math.max(...tab.tiers));
  }, [tabId, tab.tiers]);

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
          The red pins are part of the PTDC artwork. Tap any pin to read about
          the place — then open its destination page when one is available.
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
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
              <PinDetail pin={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>

        <aside className="flex max-h-[min(72vh,720px)] flex-col overflow-hidden rounded-[24px] border border-line bg-white">
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
              {filtered.length} of {pins.length} places
            </p>
          </div>

          {selected && (
            <div className="hidden border-b border-line p-4 lg:block">
              <PinDetail pin={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}

          <ul className="min-h-0 flex-1 overflow-y-auto p-2">
            {filtered.map((pin) => {
              const active = pin.id === selectedId;
              return (
                <li key={pin.id}>
                  <button
                    type="button"
                    onClick={() => selectPin(pin)}
                    className={
                      active
                        ? "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-white"
                        : "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-ink hover:bg-cloud"
                    }
                    style={active ? { backgroundColor: tab.accent } : undefined}
                  >
                    <span
                      className={
                        active
                          ? "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold"
                          : "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cloud text-xs font-bold text-brand"
                      }
                    >
                      {pin.n}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-snug">
                        {pin.title}
                      </span>
                      {!active && (
                        <span className="mt-0.5 line-clamp-2 block text-xs text-ink-soft">
                          {pin.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function PinDetail({
  pin,
  onClose,
}: {
  pin: MapPin;
  onClose: () => void;
}) {
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
          className="mt-4 inline-flex text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          Explore destination →
        </Link>
      )}
    </div>
  );
}
