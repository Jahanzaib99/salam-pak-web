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
    .replace(/<\/p>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    // Fix common UTF-8 mojibake from older dumps
    .replace(/â€”|â€“/g, "—")
    .replace(/â€˜|â€™/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/Ã¢Â€Â”|Ã¢Â€Â“/g, "—")
    .replace(/Ã¢Â†Â’/g, "→")
    .replace(/Ã¢Â—Â\x8F|Ã¢Â€Â¢|â€¢/g, "•")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Split prose / bullet text into clean activity lines. */
function toBullets(text = "", limit = 8) {
  const cleaned = strip(text);
  if (!cleaned) return [];
  const parts = cleaned
    .split(/\n+|•|▪|●|(?:^|\s)[-–—]\s+/)
    .map((s) => s.replace(/^[\d.)\s]+/, "").trim())
    .filter((s) => s.length > 12);
  const unique = [];
  for (const p of parts) {
    if (!unique.some((u) => u.toLowerCase() === p.toLowerCase())) unique.push(p);
    if (unique.length >= limit) break;
  }
  return unique;
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
  const gettingThere = strip(raw.gettingThere || "").slice(0, 1200);
  const whatToDo = strip(raw.whatToDo || "").slice(0, 1200);
  const whenToVisit = strip(raw.timeToVisit || "").slice(0, 900);
  const whereToStay = strip(raw.whereToStay || "").slice(0, 900);
  const additionalInfo = strip(raw.additionalInformation || "").slice(0, 900);
  // Prefer list description from catalog when detail description empty
  const desc =
    strip(raw.description || "").slice(0, 500) ||
    map.get(slug)?.description ||
    "";
  detailBrief[slug] = {
    slug,
    name: raw.name || map.get(slug)?.name || slug,
    regionSlug: normalizeRegion(raw.regionSlug || map.get(slug)?.regionSlug || ""),
    description: desc,
    longDescription: strip(raw.longDescription || "").slice(0, 1400),
    gettingThere,
    whatToDo,
    whenToVisit,
    whereToStay,
    additionalInfo,
    gettingThereBullets: toBullets(raw.gettingThere || "", 6),
    whatToDoBullets: toBullets(raw.whatToDo || "", 10),
    whenToVisitBullets: toBullets(raw.timeToVisit || "", 6),
    whereToStayBullets: toBullets(raw.whereToStay || "", 5),
  };
}

// Enrich catalog rows with short descriptions from details when missing
for (const d of catalog) {
  if (!d.description && detailBrief[d.slug]?.description) {
    d.description = detailBrief[d.slug].description;
  }
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
