import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../src/data");
const kb = JSON.parse(
  fs.readFileSync(path.join(dataDir, "rehbar-knowledge.json"), "utf8")
);

/** Exact / best-known coordinates for named places (lat, lng). */
const KNOWN = {
  hunza: [36.3167, 74.65],
  karimabad: [36.3256, 74.665],
  "baltit-fort": [36.325, 74.669],
  "altit-fort": [36.319, 74.678],
  "attabad-lake": [36.37, 74.87],
  passu: [36.468, 74.895],
  skardu: [35.2971, 75.6335],
  "fairy-meadows": [35.42, 74.58],
  "deosai-national-park": [35.0, 75.4],
  deosai: [35.0, 75.4],
  gilgit: [35.9208, 74.3144],
  shigar: [35.4231, 75.7331],
  "khaplu-valley": [35.1606, 76.3361],
  khaplu: [35.1606, 76.3361],
  "swat-valley": [35.2227, 72.4258],
  swat: [35.2227, 72.4258],
  kalam: [35.48, 72.59],
  "malam-jabba": [34.8, 72.57],
  peshawar: [34.0151, 71.5249],
  islamabad: [33.6844, 73.0479],
  rawalpindi: [33.5651, 73.0169],
  taxila: [33.7458, 72.8057],
  lahore: [31.5204, 74.3587],
  "badshahi-mosque": [31.588, 74.310],
  "lahore-fort": [31.5883, 74.3142],
  multan: [30.1575, 71.5249],
  karachi: [24.8607, 67.0011],
  "clifton-beach": [24.81, 67.0],
  "mohenjo-daro": [27.3292, 68.1389],
  gwadar: [25.1264, 62.3225],
  quetta: [30.1798, 66.975],
  naran: [34.907, 73.65],
  kaghan: [34.78, 73.53],
  murree: [33.907, 73.394],
  "kalash-valley": [35.7, 71.7],
  chitral: [35.851, 71.786],
  "rohtas-fort": [32.965, 73.575],
  harappa: [30.63, 72.865],
  thatta: [24.747, 67.924],
  hyderabad: [25.396, 68.357],
  sukkur: [27.7052, 68.8574],
  faisalabad: [31.4504, 73.135],
  sialkot: [32.4945, 74.5229],
  gujranwala: [32.1877, 74.1945],
  bahawalpur: [29.3956, 71.6836],
  "derawar-fort": [28.39, 71.335],
  "nankana-sahib": [31.449, 73.706],
  kartarpur: [32.136, 74.954],
  "katas-raj-temples": [32.724, 72.975],
  "khewra-salt-mines": [32.648, 73.008],
  "kallar-kahar": [32.776, 72.707],
  "saiful-muluk": [34.876, 73.695],
  "an-soo-lake": [34.82, 73.83],
  "neelum-valley": [34.59, 73.91],
  muzaffarabad: [34.37, 73.47],
  "azad-jammu-and-kashmir": [34.2, 73.5],
  hingol: [25.5, 65.5],
  "princess-of-hope": [25.35, 65.45],
  ziarat: [30.38, 67.73],
  "hanna-lake": [30.25, 67.1],
  mansehra: [34.33, 73.2],
  abbottabad: [34.1688, 73.2215],
  nathia: [34.09, 73.39],
  "nathia-gali": [34.09, 73.39],
  "shogran": [34.62, 73.46],
  "phander-valley": [36.17, 72.95],
  "rama-lake": [35.36, 74.8],
  "satpara-lake": [35.23, 75.63],
  "upper-kachura": [35.45, 75.42],
  "lower-kachura": [35.43, 75.45],
  "khunjerab-pass": [36.85, 75.428],
  "nanga-parbat": [35.2375, 74.5892],
  "rakaposhi": [36.142, 74.489],
};

/** Approximate scatter boxes per province [latMin, latMax, lngMin, lngMax]. */
const REGION_BOX = {
  "gilgit-baltistan": [34.6, 37.0, 72.8, 77.2],
  "khyber-pakhtunkhwa": [31.5, 36.8, 69.5, 74.2],
  islamabad: [33.55, 33.8, 72.9, 73.25],
  punjab: [27.7, 34.0, 70.0, 75.4],
  sindh: [23.7, 28.5, 66.7, 71.1],
  balochistan: [24.8, 32.0, 60.9, 70.3],
  "azad-kashmir": [33.5, 35.1, 73.3, 74.8],
  pakistan: [28.0, 34.0, 66.0, 74.0],
};

const REGION_COLOR = {
  "gilgit-baltistan": "#38bdf8",
  "khyber-pakhtunkhwa": "#34d399",
  islamabad: "#f472b6",
  punjab: "#fbbf24",
  sindh: "#fb7185",
  balochistan: "#a78bfa",
  "azad-kashmir": "#2dd4bf",
};

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unit(n) {
  return (n % 10000) / 10000;
}

function approxInRegion(slug, regionSlug) {
  const box = REGION_BOX[regionSlug] || REGION_BOX.pakistan;
  const h1 = hash(slug);
  const h2 = hash(slug + ":b");
  const lat = box[0] + unit(h1) * (box[1] - box[0]);
  const lng = box[2] + unit(h2) * (box[3] - box[2]);
  return [lat, lng];
}

const pins = kb.destinations.map((d) => {
  const known = KNOWN[d.slug];
  const [lat, lng] = known
    ? known
    : approxInRegion(d.slug, d.regionSlug || "pakistan");
  return {
    slug: d.slug,
    name: d.name,
    lat: Number(lat.toFixed(5)),
    lng: Number(lng.toFixed(5)),
    region: d.regionName || d.regionSlug || "Pakistan",
    regionSlug: d.regionSlug || "pakistan",
    blurb: (d.description || "").slice(0, 160),
    href: d.href,
    featured: Boolean(d.featured),
    exact: Boolean(known),
    color: REGION_COLOR[d.regionSlug] || "#fbbf24",
  };
});

pins.sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return a.name.localeCompare(b.name);
});

const out = {
  generatedAt: new Date().toISOString(),
  count: pins.length,
  exactCount: pins.filter((p) => p.exact).length,
  pins,
};

fs.writeFileSync(
  path.join(dataDir, "earth-pins.json"),
  JSON.stringify(out)
);
console.log(
  `Wrote ${out.count} pins (${out.exactCount} exact coords) → earth-pins.json`
);
