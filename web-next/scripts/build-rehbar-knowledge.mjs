import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../src/data");

const byProv = JSON.parse(
  fs.readFileSync(path.join(dataDir, "places-by-province.json"), "utf8")
);
const byCat = JSON.parse(
  fs.readFileSync(path.join(dataDir, "places-by-category.json"), "utf8")
);
const details = JSON.parse(
  fs.readFileSync(path.join(dataDir, "place-details.json"), "utf8")
);
const activities = JSON.parse(
  fs.readFileSync(path.join(dataDir, "activities.json"), "utf8")
);

function strip(html = "") {
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRegion(slug = "") {
  if (slug === "azad-jamu-khashmir" || slug === "azad-jammu-and-kashmir") {
    return "azad-kashmir";
  }
  return slug;
}

const REGION = {
  islamabad: "Islamabad Capital Territory",
  punjab: "Punjab",
  sindh: "Sindh",
  "khyber-pakhtunkhwa": "Khyber Pakhtunkhwa",
  "gilgit-baltistan": "Gilgit-Baltistan",
  balochistan: "Balochistan",
  "azad-kashmir": "Azad Jammu & Kashmir",
};

const map = new Map();

function upsert(raw, regionSlug, categories = []) {
  if (!raw?.slug) return;
  const slug = raw.slug;
  const prev = map.get(slug) || {
    slug,
    name: "",
    regionSlug: "",
    description: "",
    categories: [],
    featured: false,
  };
  const region = normalizeRegion(
    regionSlug || raw.regionSlug || raw.parentProvince || prev.regionSlug || ""
  );
  const cats = new Set([...(prev.categories || []), ...categories]);
  map.set(slug, {
    slug,
    name: raw.name || raw.alias || prev.name || slug,
    regionSlug: region,
    regionName: REGION[region] || region || "Pakistan",
    description: (strip(raw.description || "") || prev.description).slice(
      0,
      420
    ),
    categories: [...cats],
    featured: Boolean(raw.isFeatured || prev.featured),
  });
}

for (const [prov, places] of Object.entries(byProv)) {
  for (const p of places) upsert(p, prov, []);
}
for (const [cat, places] of Object.entries(byCat)) {
  for (const p of places) {
    upsert(p, p.regionSlug || p.parentProvince || "", [cat]);
  }
}

const catalog = [...map.values()]
  .map((d) => ({
    ...d,
    href: d.regionSlug
      ? `/where-to-go/category/${d.regionSlug}/location/${d.slug}`
      : `/where-to-go/locations/${d.slug}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const detailBrief = {};
for (const [slug, raw] of Object.entries(details)) {
  detailBrief[slug] = {
    slug,
    name: raw.name || slug,
    regionSlug: normalizeRegion(raw.regionSlug || ""),
    description: strip(raw.description || "").slice(0, 500),
    longDescription: strip(raw.longDescription || "").slice(0, 1200),
    gettingThere: strip(raw.gettingThere || "").slice(0, 900),
    whatToDo: strip(raw.whatToDo || "").slice(0, 900),
    whenToVisit: strip(raw.timeToVisit || "").slice(0, 700),
    whereToStay: strip(raw.whereToStay || "").slice(0, 700),
    additionalInfo: strip(raw.additionalInformation || "").slice(0, 700),
  };
}

const act = (Array.isArray(activities) ? activities : []).map((a) => ({
  slug: a.slug,
  name: a.name || a.alias || a.slug,
  description: strip(a.description || "").slice(0, 500),
  featured: Boolean(a.isFeatured),
}));

const out = {
  generatedAt: new Date().toISOString(),
  destinationCount: catalog.length,
  destinations: catalog,
  details: detailBrief,
  activities: act,
  regions: Object.entries(REGION).map(([slug, name]) => ({ slug, name })),
};

const outPath = path.join(dataDir, "rehbar-knowledge.json");
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(
  `Wrote ${catalog.length} destinations, ${Object.keys(detailBrief).length} details, ${act.length} activities → ${outPath}`
);
