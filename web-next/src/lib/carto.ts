/** CARTO basemap helpers for MapLibre. */

/** Public CARTO GL styles (no key required for basemaps.cartocdn.com). */
export const CARTO_GL_STYLES = {
  voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  darkMatter: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
} as const;

export function getCartoApiKey() {
  return (
    process.env.CARTO_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_CARTO_API_KEY?.trim() ||
    ""
  );
}

/**
 * Raster Voyager tiles (fallback if GL style fetch fails).
 * Appends api_key when present — harmless on public CDN if unused.
 */
export function cartoVoyagerRasterTiles(apiKey?: string) {
  const key = apiKey?.trim();
  const base =
    "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
  return key ? `${base}?api_key=${encodeURIComponent(key)}` : base;
}
