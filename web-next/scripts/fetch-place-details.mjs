/**
 * Fetch full location details for every place in places-by-province.json
 * and write src/data/place-details.json (then rebuild rehbar knowledge).
 */
import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../src/data");
const API = "https://api.salampakistan.gov.pk/api";
const CONCURRENCY = 6;

const byProv = JSON.parse(
  fs.readFileSync(path.join(dataDir, "places-by-province.json"), "utf8")
);

const existingPath = path.join(dataDir, "place-details.json");
const existing = fs.existsSync(existingPath)
  ? JSON.parse(fs.readFileSync(existingPath, "utf8"))
  : {};

const slugs = [
  ...new Set(
    Object.values(byProv)
      .flat()
      .map((p) => p?.slug)
      .filter(Boolean)
  ),
];

function getJson(url, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { rejectUnauthorized: false, timeout: timeoutMs },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, json: JSON.parse(body) });
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

function toRaw(x) {
  return {
    slug: String(x.slug || ""),
    name: String(x.alias || x.name || x.slug || ""),
    description: String(x.description || ""),
    longDescription: String(x.longDescription || ""),
    image: String(
      x.thumbnail ||
        (Array.isArray(x.thumbnails) ? x.thumbnails[0] : "") ||
        (Array.isArray(x.photos) ? x.photos[0] : "") ||
        ""
    ),
    isFeatured: Boolean(x.isFeatured),
    regionSlug: String(x.parentProvince || ""),
    order: typeof x.order === "number" ? x.order : 9999,
    gettingThere: String(x.gettingThere || ""),
    whatToDo: String(x.whatToDo || ""),
    timeToVisit: String(x.timeToVisit || ""),
    whereToStay: String(x.whereToStay || ""),
    additionalInformation: String(x.additionalInformation || ""),
    photos: Array.isArray(x.photos) ? x.photos : [],
    thumbnails: Array.isArray(x.thumbnails) ? x.thumbnails : [],
    location: x.location || undefined,
  };
}

const out = { ...existing };
let ok = 0;
let fail = 0;
let skipped = 0;

const force = process.argv.includes("--force");

async function fetchOne(slug) {
  // Skip only when we already have rich travel fields (unless --force).
  const prev = out[slug];
  if (
    !force &&
    prev &&
    ((prev.gettingThere && String(prev.gettingThere).length > 80) ||
      (prev.whatToDo && String(prev.whatToDo).length > 80))
  ) {
    skipped += 1;
    return;
  }

  try {
    const { status, json } = await getJson(
      `${API}/location/detail?slug=${encodeURIComponent(slug)}`
    );
    const x = json?.data;
    if (status === 200 && x?.slug) {
      out[slug] = toRaw(x);
      ok += 1;
    } else {
      fail += 1;
    }
  } catch {
    fail += 1;
  }
}

async function runPool(items, worker, size) {
  let i = 0;
  const runners = Array.from({ length: size }, async () => {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx]);
      if ((idx + 1) % 25 === 0 || idx + 1 === items.length) {
        console.log(
          `… ${idx + 1}/${items.length} (ok ${ok}, skip ${skipped}, fail ${fail})`
        );
      }
    }
  });
  await Promise.all(runners);
}

console.log(`Fetching details for ${slugs.length} places…`);
await runPool(slugs, fetchOne, CONCURRENCY);

fs.writeFileSync(existingPath, JSON.stringify(out, null, 0));
console.log(
  `Wrote ${Object.keys(out).length} place details → ${existingPath} (new/updated ${ok}, skipped ${skipped}, failed ${fail})`
);
