import {
  GANDHARA_HOTSPOTS,
  GURDWARA_HOTSPOTS,
  ISLAMABAD_HOTSPOTS,
  MapHotspot,
  PAKISTAN_HOTSPOTS,
} from "./map-hotspots";
import { getDestination, destinationHref } from "./destinations";

export interface MapCrop {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MapTab {
  id: string;
  label: string;
  blurb: string;
  accent: string;
  image: string;
  imageAspect: number;
  crop: MapCrop;
  tiers: number[];
  imageW: number;
  imageH: number;
  markerW: number;
  markerH: number;
  hotspots: MapHotspot[];
}

export interface MapPin {
  id: string;
  n: number;
  title: string;
  description: string;
  slug?: string;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  href?: string;
}

/** Hotspot slug aliases → destination slug in this rebuild. */
const SLUG_ALIAS: Record<string, string> = {
  "baltit-fort": "hunza",
  "nanga-parbat": "fairy-meadows",
  "faisal-mosque": "islamabad",
  "pakistan-monument": "islamabad",
  "the-centaurus-mall": "islamabad",
  "daman-e-koh": "islamabad",
  "margalla-hills": "islamabad",
  "taxila-museum": "taxila",
  "jaulian-buddhist-monastery": "taxila",
  "dharmarajika-stupa-and-monastery": "taxila",
  "takht-i-bahi": "taxila",
  "clifton-beach": "karachi",
  "nankana-sahib": "lahore",
  "gurdwara-darbar-sahib-kartarpur": "lahore",
};

export function hrefForHotspot(slug?: string): string | undefined {
  if (!slug) return undefined;
  const destSlug = SLUG_ALIAS[slug] ?? slug;
  const d = getDestination(destSlug);
  return d ? destinationHref(d) : undefined;
}

export const MAP_TABS: MapTab[] = [
  {
    id: "pakistan",
    label: "Pakistan",
    blurb: "71 attractions from the Khunjerab Pass to the Arabian Sea.",
    accent: "#0f7a6b",
    image: "pakistan",
    imageAspect: 1.1103,
    crop: { x: 2.08, y: 10.9473, w: 78.72, h: 88.6028 },
    tiers: [1600, 3200, 3936],
    imageW: 5000,
    imageH: 4001,
    markerW: 25,
    markerH: 40,
    hotspots: PAKISTAN_HOTSPOTS,
  },
  {
    id: "islamabad",
    label: "Islamabad",
    blurb: "45 attractions across the capital, from the Margallas to Rawat Fort.",
    accent: "#3ba9ff",
    image: "islamabad",
    imageAspect: 2.1426,
    crop: { x: 0.5773, y: 28.375, w: 72.9205, h: 54.0417 },
    tiers: [1600, 2779],
    imageW: 3811,
    imageH: 2400,
    markerW: 22,
    markerH: 34,
    hotspots: ISLAMABAD_HOTSPOTS,
  },
  {
    id: "gandhara",
    label: "Gandhara",
    blurb: "The Buddhist heritage trail — stupas, monasteries and rock carvings.",
    accent: "#c45a2c",
    image: "gandhara",
    imageAspect: 2.5548,
    crop: { x: 4.949, y: 22.42, w: 89.3398, h: 51.1362 },
    tiers: [1600, 3200, 5000, 9026],
    imageW: 10103,
    imageH: 6909,
    markerW: 75,
    markerH: 119,
    hotspots: GANDHARA_HOTSPOTS,
  },
  {
    id: "gurdwara",
    label: "Gurdwara",
    blurb: "The Sikh pilgrimage trail, from Nankana Sahib to Kartarpur.",
    accent: "#c9a227",
    image: "gurdwara",
    imageAspect: 1.7895,
    crop: { x: 0, y: 35.9166, w: 60.2864, h: 58.3006 },
    tiers: [1600, 2652],
    imageW: 4399,
    imageH: 2542,
    markerW: 83,
    markerH: 119,
    hotspots: GURDWARA_HOTSPOTS,
  },
];

/** Re-base a measured full-artwork hotspot onto the cut-out image. */
export function toCutoutPin(h: MapHotspot, tab: MapTab): MapPin {
  const gw = h.gw || tab.markerW;
  const gh = h.gh || tab.markerH;
  const c = tab.crop;
  const sx = 100 / c.w;
  const sy = 100 / c.h;

  return {
    id: `${tab.id}-${h.n}`,
    n: h.n,
    title: h.name,
    description: h.blurb,
    slug: h.slug,
    xPct: (h.x - c.x) * sx,
    yPct: (h.y - c.y) * sy,
    wPct: (gw / tab.imageW) * 100 * sx,
    hPct: (gh / tab.imageH) * 100 * sy,
    href: hrefForHotspot(h.slug),
  };
}

export function cutoutSrc(tab: MapTab, ext: "webp" | "png" = "webp"): string {
  // Prefer the largest webp so zoom stays sharp; PNG fallback stays at 1600.
  if (ext === "png") return `/maps/${tab.image}-cut-1600.png`;
  const best = tab.tiers[tab.tiers.length - 1] ?? 1600;
  return `/maps/${tab.image}-cut-${best}.webp`;
}

export function cutoutSrcSet(tab: MapTab): string {
  return tab.tiers
    .map((w) => `/maps/${tab.image}-cut-${w}.webp ${w}w`)
    .join(", ");
}
