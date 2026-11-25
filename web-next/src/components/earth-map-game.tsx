"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Gamepad2, RotateCcw } from "lucide-react";
import pakistanBorder from "@/data/pakistan-border.json";
import { earthPins, type EarthPin } from "@/lib/earth-destinations";
import {
  PAKISTAN_BOUNDS,
  PAKISTAN_CENTER,
  SALAM_GREEN,
} from "@/lib/earth-brand";
import { ensureMapLibreWorker } from "@/lib/maplibre-setup";

type Round = {
  pin: EarthPin;
  guess: { lng: number; lat: number } | null;
  distanceKm: number | null;
  scored: boolean;
};

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function scoreFromDistance(km: number) {
  if (km <= 25) return 1000;
  if (km <= 75) return 800;
  if (km <= 150) return 600;
  if (km <= 300) return 400;
  if (km <= 500) return 200;
  return Math.max(50, Math.round(1000 - km));
}

function pickPin(exclude: string[] = []): EarthPin {
  const pool = earthPins.filter((p) => p.exact && !exclude.includes(p.slug));
  const list = pool.length ? pool : earthPins.filter((p) => p.featured);
  return list[Math.floor(Math.random() * list.length)];
}

export default function EarthMapGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const guessMarker = useRef<Marker | null>(null);
  const answerMarker = useRef<Marker | null>(null);

  const [roundIndex, setRoundIndex] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState<Round>(() => ({
    pin: pickPin(),
    guess: null,
    distanceKm: null,
    scored: false,
  }));
  const used = useRef<string[]>([round.pin.slug]);

  const hint = useMemo(() => {
    const words = round.pin.blurb.split(/\s+/).slice(0, 14).join(" ");
    return words || `${round.pin.region} · Pakistan`;
  }, [round.pin]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    ensureMapLibreWorker();

    const el = containerRef.current;
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
            attribution: "Tiles © Esri",
            maxzoom: 19,
          },
        },
        layers: [
          { id: "satellite", type: "raster", source: "satellite" },
        ],
      },
      center: PAKISTAN_CENTER,
      zoom: 4.4,
      minZoom: 1.4,
      maxZoom: 11,
    });

    map.addControl(new NavigationControl(), "bottom-right");

    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(el);
    requestAnimationFrame(() => map.resize());
    window.setTimeout(() => map.resize(), 120);

    map.on("load", () => {
      map.addSource("pakistan", {
        type: "geojson",
        data: pakistanBorder as never,
      });
      map.addLayer({
        id: "pakistan-fill",
        type: "fill",
        source: "pakistan",
        paint: { "fill-color": SALAM_GREEN, "fill-opacity": 0.18 },
      });
      map.addLayer({
        id: "pakistan-outline",
        type: "line",
        source: "pakistan",
        paint: {
          "line-color": SALAM_GREEN,
          "line-width": 2.5,
          "line-opacity": 0.95,
        },
      });
      map.fitBounds(PAKISTAN_BOUNDS, { padding: 48, maxZoom: 5.2 });
    });

    map.on("click", (e) => {
      setRound((prev) => {
        if (prev.scored) return prev;
        guessMarker.current?.remove();
        guessMarker.current = new Marker({ color: "#fbbf24" })
          .setLngLat(e.lngLat)
          .addTo(map);
        return {
          ...prev,
          guess: { lng: e.lngLat.lng, lat: e.lngLat.lat },
          distanceKm: null,
        };
      });
    });

    mapRef.current = map;
    return () => {
      ro.disconnect();
      guessMarker.current?.remove();
      answerMarker.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  function checkAnswer() {
    if (!round.guess || round.scored) return;
    const map = mapRef.current;
    if (!map) return;

    const distanceKm = haversineKm(round.guess, {
      lat: round.pin.lat,
      lng: round.pin.lng,
    });
    const points = scoreFromDistance(distanceKm);
    setTotalScore((s) => s + points);

    answerMarker.current?.remove();
    answerMarker.current = new Marker({ color: SALAM_GREEN })
      .setLngLat([round.pin.lng, round.pin.lat])
      .addTo(map);

    map.fitBounds(
      [
        [
          Math.min(round.guess.lng, round.pin.lng),
          Math.min(round.guess.lat, round.pin.lat),
        ],
        [
          Math.max(round.guess.lng, round.pin.lng),
          Math.max(round.guess.lat, round.pin.lat),
        ],
      ],
      { padding: 80, duration: 900, maxZoom: 8 }
    );

    setRound((prev) => ({
      ...prev,
      distanceKm,
      scored: true,
    }));
  }

  function nextRound() {
    const next = pickPin(used.current);
    used.current = [...used.current, next.slug].slice(-12);
    guessMarker.current?.remove();
    answerMarker.current?.remove();
    guessMarker.current = null;
    answerMarker.current = null;
    mapRef.current?.fitBounds(PAKISTAN_BOUNDS, {
      padding: 48,
      duration: 800,
      maxZoom: 5.2,
    });
    setRoundIndex((i) => i + 1);
    setRound({ pin: next, guess: null, distanceKm: null, scored: false });
  }

  function restart() {
    used.current = [];
    const pin = pickPin();
    used.current = [pin.slug];
    guessMarker.current?.remove();
    answerMarker.current?.remove();
    setTotalScore(0);
    setRoundIndex(1);
    setRound({ pin, guess: null, distanceKm: null, scored: false });
    mapRef.current?.fitBounds(PAKISTAN_BOUNDS, {
      padding: 48,
      duration: 800,
      maxZoom: 5.2,
    });
  }

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden"
      data-lenis-prevent
    >
      <div ref={containerRef} className="h-full w-full" />

      <div className="absolute left-4 right-4 top-4 z-20 mx-auto max-w-xl rounded-2xl border border-white/12 bg-[#071018]/88 p-4 text-white shadow-2xl backdrop-blur-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            <Gamepad2 className="h-3.5 w-3.5" />
            Where on the map · Round {roundIndex}
          </p>
          <p className="text-[12px] font-semibold text-white/80">
            Score <span className="text-white">{totalScore}</span>
          </p>
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
          Where is {round.pin.name.trim()}?
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-white/65">
          Hint: {hint}
          {hint.endsWith(".") ? "" : "…"}
        </p>

        {!round.scored ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!round.guess}
              onClick={checkAnswer}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-[12.5px] font-semibold text-[#042f2e] disabled:opacity-40"
            >
              {round.guess ? "Check guess" : "Click the map to place a pin"}
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-[13px] text-emerald-200">
              {round.distanceKm != null
                ? `${round.distanceKm.toFixed(0)} km away · +${scoreFromDistance(round.distanceKm)} pts`
                : ""}
              {" · "}
              <span className="text-white/70">{round.pin.region}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={nextRound}
                className="rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-ink"
              >
                Next place
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-[12.5px] font-semibold text-white/85"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
