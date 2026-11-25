import earthPinsData from "@/data/earth-pins.json";

export type EarthPin = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  regionSlug: string;
  blurb: string;
  href: string;
  featured: boolean;
  exact: boolean;
  color: string;
};

type EarthPinsFile = {
  count: number;
  exactCount: number;
  pins: EarthPin[];
};

const data = earthPinsData as EarthPinsFile;

export const EARTH_FOCUS = {
  lat: 30.4,
  lng: 69.3,
  altitude: 1.35,
};

export const earthPins: EarthPin[] = data.pins;

export const earthPinStats = {
  count: data.count,
  exactCount: data.exactCount,
};

export const REGION_FILTERS: { slug: string; label: string; color: string }[] =
  [
    { slug: "all", label: "All", color: "#0f7a6b" },
    { slug: "gilgit-baltistan", label: "Gilgit-Baltistan", color: "#38bdf8" },
    { slug: "khyber-pakhtunkhwa", label: "KP", color: "#34d399" },
    { slug: "islamabad", label: "Islamabad", color: "#f472b6" },
    { slug: "punjab", label: "Punjab", color: "#fbbf24" },
    { slug: "sindh", label: "Sindh", color: "#fb7185" },
    { slug: "balochistan", label: "Balochistan", color: "#a78bfa" },
    { slug: "azad-kashmir", label: "AJK", color: "#2dd4bf" },
  ];
