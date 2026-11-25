"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ExternalLink, Loader2, MapPin } from "lucide-react";
import { ensureMapLibreWorker } from "@/lib/maplibre-setup";
import { SALAM_GREEN } from "@/lib/earth-brand";
import { CARTO_GL_STYLES } from "@/lib/carto";
import {
  SURROUNDINGS_FILTERS,
  type NearbyPlace,
} from "@/lib/surroundings";

type Props = {
  name: string;
  lat: number;
  lng: number;
  slug?: string;
};

export default function DestinationSurroundingsMap({
  name,
  lat,
  lng,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const destMarkerRef = useRef<Marker | null>(null);

  const [active, setActive] = useState(SURROUNDINGS_FILTERS[0].id);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);

  const clearPoiMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  // Init map once per destination coordinates
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    ensureMapLibreWorker();

    const el = containerRef.current;
    el.style.width = "100%";
    el.style.height = "100%";

    const map = new MapLibreMap({
      container: el,
      // Official CARTO Voyager GL basemap (MapLibre-compatible).
      style: CARTO_GL_STYLES.voyager,
      center: [lng, lat],
      zoom: 12,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: { compact: true },
    });

    map.addControl(new NavigationControl({ visualizePitch: false }), "bottom-right");

    const pin = createGooglePin({
      color: SALAM_GREEN,
      variant: "dest",
      label: name,
      animate: true,
    });
    destMarkerRef.current = new Marker({ element: pin, anchor: "bottom" })
      .setLngLat([lng, lat])
      .setPopup(
        new Popup({ offset: 28, closeButton: false }).setHTML(
          `<strong style="font-size:13px">${escapeHtml(name)}</strong>`
        )
      )
      .addTo(map);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => map.resize(), 50);
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    requestAnimationFrame(() => map.resize());

    mapRef.current = map;
    return () => {
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      clearPoiMarkers();
      destMarkerRef.current?.remove();
      destMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // Intentionally omit `name` / clearPoiMarkers — remount only when coords change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  // Fetch POIs when filter changes
  useEffect(() => {
    const map = mapRef.current;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setSelected(null);
      clearPoiMarkers();

      try {
        const res = await fetch(
          `/api/nearby-places?lat=${lat}&lng=${lng}&type=${encodeURIComponent(active)}`
        );
        const data = (await res.json()) as {
          places?: NearbyPlace[];
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Could not load places");
        if (cancelled) return;

        const list = data.places || [];
        setPlaces(list);

        if (!map) return;
        list.forEach((p, i) => {
          const el = createGooglePin({
            color: "#ea4335",
            variant: "poi",
            label: p.name,
            animate: i < 24,
            asButton: true,
          });
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            markersRef.current.forEach((m) => {
              m.getElement().classList.remove("is-active");
            });
            el.classList.add("is-active");
            setSelected(p);
            map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 14) });
          });
          const marker = new Marker({ element: el, anchor: "bottom" })
            .setLngLat([p.lng, p.lat])
            .addTo(map);
          markersRef.current.push(marker);
        });
      } catch (err) {
        if (!cancelled) {
          setPlaces([]);
          setError(err instanceof Error ? err.message : "Failed to load places");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Wait a tick so map exists after mount
    const t = window.setTimeout(load, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [active, lat, lng, clearPoiMarkers]);

  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
          {name}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.65rem]">
            Discover the surroundings
          </h2>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-brand"
          >
            <MapPin className="h-3.5 w-3.5" />
            Open destination
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
          <div className="no-scrollbar flex max-h-[7.5rem] flex-wrap gap-1.5 overflow-y-auto rounded-2xl border border-black/5 bg-white/92 p-2 shadow-lg backdrop-blur-md">
            {SURROUNDINGS_FILTERS.map((f) => {
              const on = active === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActive(f.id)}
                  className={[
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize transition",
                    on
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-ink",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={wrapRef} className="relative h-[420px] w-full sm:h-[520px] lg:h-[600px]">
          <div ref={containerRef} className="h-full w-full" data-lenis-prevent />

          {loading && (
            <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-white/35 backdrop-blur-[1px]">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 text-sm font-medium text-white shadow-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
                Finding nearby…
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:left-auto sm:right-4 sm:max-w-sm">
              {error}
            </div>
          )}

          {selected && (
            <div className="absolute bottom-4 left-4 z-10 max-w-xs rounded-2xl border border-line bg-white p-3 shadow-xl sm:left-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
                {selected.kind}
              </p>
              <p className="mt-1 font-display text-base font-semibold text-ink">
                {selected.name}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <a
                  href={selected.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-dark"
                >
                  View on Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    markersRef.current.forEach((m) => {
                      m.getElement().classList.remove("is-active");
                    });
                    setSelected(null);
                  }}
                  className="rounded-full px-2 py-1 text-[11px] font-semibold text-ink-soft hover:text-ink"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-[12px] text-ink-soft sm:px-5">
        <p>
          {loading
            ? "Searching…"
            : places.length
              ? `${places.length} places nearby`
              : "Select a category to explore nearby places"}
        </p>
        <p className="hidden sm:block">Basemap © CARTO · © OpenStreetMap</p>
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Classic Google Maps teardrop pin for MapLibre DOM markers. */
function createGooglePin(opts: {
  color: string;
  variant: "dest" | "poi";
  label: string;
  animate?: boolean;
  asButton?: boolean;
}) {
  const el = document.createElement(opts.asButton ? "button" : "div");
  if (opts.asButton) (el as HTMLButtonElement).type = "button";
  el.className = [
    "gm-pin",
    opts.variant === "dest" ? "gm-pin--dest" : "gm-pin--poi",
    opts.animate ? "gm-pin--animate" : "",
  ]
    .filter(Boolean)
    .join(" ");
  el.setAttribute("aria-label", opts.label);
  el.title = opts.label;
  el.innerHTML = `
    <svg viewBox="0 0 28 40" aria-hidden="true">
      <path
        fill="${opts.color}"
        stroke="#fff"
        stroke-width="1.5"
        d="M14 1.2C7.4 1.2 2 6.6 2 13.2c0 8.1 10.2 23.2 11.4 24.9a.8.8 0 0 0 1.3 0C15.8 36.4 26 21.3 26 13.2 26 6.6 20.6 1.2 14 1.2z"
      />
      <circle cx="14" cy="13.2" r="5.2" fill="#fff"/>
    </svg>
  `;
  return el;
}
