"use client";

import { setWorkerUrl } from "maplibre-gl";

let configured = false;

/**
 * MapLibre 6 + Next Turbopack leaves the worker URL empty / broken.
 * Prefer the worker copied into /public (same-origin). Fall back to CDN.
 * @see https://github.com/maplibre/maplibre-gl-js/issues/8126
 */
export function ensureMapLibreWorker() {
  if (configured || typeof window === "undefined") return;
  setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
  configured = true;
}
