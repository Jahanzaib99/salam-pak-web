/** Salam Pakistan places — static dump + live API (TLS-tolerant). */

import https from "https";
import placesByProvince from "@/data/places-by-province.json";
import placesByCategory from "@/data/places-by-category.json";
import placeDetails from "@/data/place-details.json";
import activitiesDump from "@/data/activities.json";
import placesByActivityDump from "@/data/places-by-activity.json";

const API = "https://api.salampakistan.gov.pk/api";
const FALLBACK_IMAGE = "/hero/interest/top-tourist-destinations.jpg";

/** Proxy API photos through our app so Next/Image can load them (gov API TLS). */
export function mediaUrl(url?: string | null) {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("https://api.salampakistan.gov.pk/")) {
    return `/api/salam-photo?src=${encodeURIComponent(url)}`;
  }
  return url;
}

export const CATEGORY_IDS: Record<string, string> = {
  "gandhare-heritage": "667020ce557f6d02ad220c4c",
  "sufi-tourism": "667020ba557f6d02ad220c4a",
  "hindu-and-jain-temples": "667020a7557f6d02ad220c48",
  "heritage-and-archaeology-sites": "66701c07557f6d02ad220c2b",
  "sikh-heritage": "6629e8c1e6ebf72bb03cefc8",
  "top-tourist-destinations": "610284db08208f067f7a4d62",
  "beaches-and-islands": "61027add08208f067f7a4d53",
  "unesco-world-heritage-sites": "61027aa508208f067f7a4d51",
  "mountains-and-glaciers": "61027a6a08208f067f7a4d4f",
  "valleys-and-lakes": "6102767008208f067f7a4d4c",
};

type RawPlace = {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
  regionSlug?: string;
  order?: number | string;
  longDescription?: string;
  gettingThere?: string;
  whatToDo?: string;
  timeToVisit?: string;
  whereToStay?: string;
  additionalInformation?: string;
  photos?: string[];
  thumbnails?: string[];
  /** GeoJSON Point — Salam API uses [lng, lat]. */
  location?: { type?: string; coordinates?: number[] };
  lat?: number;
  lng?: number;
};

export type PlaceSummary = {
  slug: string;
  name: string;
  description: string;
  image: string;
  isFeatured: boolean;
  regionSlug: string;
  order: number;
};

export type PlaceDetail = PlaceSummary & {
  longDescription: string;
  welcome: string[];
  gettingThere: string[];
  whatToDo: string[];
  whenToVisit: string[];
  whereToStay: string[];
  additionalInfo: string[];
  photos: string[];
  lat?: number;
  lng?: number;
};

function coordsFromRaw(raw: RawPlace): { lat?: number; lng?: number } {
  const c = raw.location?.coordinates;
  if (Array.isArray(c) && c.length >= 2) {
    const lng = Number(c[0]);
    const lat = Number(c[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }
  const lat = Number(raw.lat);
  const lng = Number(raw.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return {};
}

export function toApiProvinceSlug(slug: string) {
  if (slug === "azad-kashmir") return "azad-jamu-khashmir";
  return slug;
}

export function fromApiProvinceSlug(slug: string) {
  if (slug === "azad-jamu-khashmir" || slug === "azad-jammu-and-kashmir") {
    return "azad-kashmir";
  }
  return slug;
}

function normalize(raw: RawPlace, fallbackRegion = ""): PlaceSummary | null {
  if (!raw?.slug) return null;
  return {
    slug: raw.slug,
    name: raw.name || raw.slug,
    description: stripHtml(raw.description || ""),
    image: mediaUrl(raw.image || FALLBACK_IMAGE),
    isFeatured: Boolean(raw.isFeatured),
    regionSlug: fromApiProvinceSlug(raw.regionSlug || fallbackRegion),
    order:
      typeof raw.order === "number"
        ? raw.order
        : Number.parseInt(String(raw.order ?? ""), 10) || 9999,
  };
}

function sortPlaces(places: PlaceSummary[]) {
  return [...places].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.order - b.order || a.name.localeCompare(b.name);
  });
}

/** Strip HTML tags from API content blobs. */
export function stripHtml(text?: string) {
  if (!text) return "";
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Short clean line for hero subtitles (avoids wall-of-text under the nav). */
export function heroBlurb(text?: string, max = 190) {
  const clean = stripHtml(text)
    .replace(/[●•▪◦]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "";
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? ")
  );
  if (stop > 70) return cut.slice(0, stop + 1).trim();
  return `${cut.replace(/\s+\S*$/, "").trim()}…`;
}

/** Split API prose blobs into readable bullet lines. */
export function proseToBullets(text?: string, max = 8): string[] {
  const clean = stripHtml(text);
  if (!clean) return [];
  return clean
    .split(/\n+|(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 20)
    .slice(0, max);
}

function insecureGetJson(url: string, timeoutMs = 4000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { rejectUnauthorized: false, timeout: timeoutMs },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`API timeout after ${timeoutMs}ms`));
    });
  });
}

async function liveList(path: string): Promise<(RawPlace & { id?: string })[]> {
  try {
    const json = (await insecureGetJson(`${API}${path}`)) as {
      data?: Array<Record<string, unknown>>;
    };
    const rows = json?.data;
    if (!Array.isArray(rows)) return [];
    return rows.map((row) => ({
      slug: String(row.slug || ""),
      name: String(row.alias || row.name || ""),
      description: String(row.description || ""),
      image: String(
        row.thumbnail ||
          (Array.isArray(row.thumbnails) ? row.thumbnails[0] : "") ||
          (Array.isArray(row.photos) ? row.photos[0] : "") ||
          ""
      ),
      isFeatured: Boolean(row.isFeatured),
      regionSlug: String(row.parentProvince || ""),
      order: typeof row.order === "number" ? row.order : 9999,
      id: String(row._id || row.id || ""),
    }));
  } catch {
    return [];
  }
}

export async function fetchPlacesByProvince(
  provinceSlug: string
): Promise<PlaceSummary[]> {
  const apiSlug = toApiProvinceSlug(provinceSlug);
  const live = await liveList(
    `/location?parentProvince=${encodeURIComponent(apiSlug)}&pageSize=0`
  );
  const dump =
    (placesByProvince as unknown as Record<string, RawPlace[]>)[apiSlug] || [];
  const source = live.length ? live : dump;
  return sortPlaces(
    source
      .map((p) => normalize(p, provinceSlug))
      .filter((p): p is PlaceSummary => Boolean(p))
  );
}

export async function fetchPlacesByCategory(
  categorySlug: string
): Promise<PlaceSummary[]> {
  const id = CATEGORY_IDS[categorySlug];
  const dump =
    (placesByCategory as unknown as Record<string, RawPlace[]>)[
      categorySlug
    ] || [];

  let live: RawPlace[] = [];
  if (id) {
    live = await liveList(
      `/location?parentCategories=${encodeURIComponent(JSON.stringify([id]))}&pageSize=0`
    );
  }
  const source = live.length ? live : dump;
  return sortPlaces(
    source
      .map((p) => normalize(p))
      .filter((p): p is PlaceSummary => Boolean(p))
  );
}

/** Prefer full photos; fall back to thumbnails. Never list the same URL twice
 *  (API often returns identical arrays in both fields). */
function uniquePlacePhotos(raw: RawPlace): string[] {
  const sources =
    raw.photos?.length
      ? raw.photos
      : raw.thumbnails?.length
        ? raw.thumbnails
        : raw.image
          ? [raw.image]
          : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of sources) {
    if (!src) continue;
    const key = String(src).split("?")[0].trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(mediaUrl(src));
  }
  return out;
}

function detailFromRaw(raw: RawPlace): PlaceDetail | null {
  const summary = normalize(raw);
  if (!summary) return null;
  const photos = uniquePlacePhotos(raw);
  const welcome = proseToBullets(raw.longDescription || raw.description, 6);
  if (!welcome.length && raw.description?.trim()) {
    welcome.push(raw.description.trim());
  }
  const { lat, lng } = coordsFromRaw(raw);
  return {
    ...summary,
    longDescription: stripHtml(raw.longDescription || raw.description || ""),
    welcome,
    gettingThere: proseToBullets(raw.gettingThere),
    whatToDo: proseToBullets(raw.whatToDo),
    whenToVisit: proseToBullets(raw.timeToVisit),
    whereToStay: proseToBullets(raw.whereToStay),
    additionalInfo: proseToBullets(raw.additionalInformation),
    photos: photos.length ? photos : [summary.image],
    lat,
    lng,
  };
}

export async function fetchPlaceDetail(
  slug: string
): Promise<PlaceDetail | null> {
  try {
    const json = (await insecureGetJson(
      `${API}/location/detail?slug=${encodeURIComponent(slug)}`
    )) as { data?: Record<string, unknown> };
    const x = json?.data;
    if (x?.slug) {
      const loc = x.location as
        | { type?: string; coordinates?: number[] }
        | undefined;
      const raw: RawPlace = {
        slug: String(x.slug),
        name: String(x.alias || x.name || x.slug),
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
        photos: Array.isArray(x.photos) ? (x.photos as string[]) : [],
        thumbnails: Array.isArray(x.thumbnails)
          ? (x.thumbnails as string[])
          : [],
        location: loc,
        lat: typeof x.lat === "number" ? x.lat : undefined,
        lng: typeof x.lng === "number" ? x.lng : undefined,
      };
      const detail = detailFromRaw(raw);
      return detail;

    }
  } catch {
    /* fall through to dump */
  }

  const cached = (placeDetails as unknown as Record<string, RawPlace>)[slug];
  return cached ? detailFromRaw(cached) : null;
}

/** Resolve a place image from the province dump (real API photo when present). */
export function placeImageFromDump(slug: string): string | null {
  const byProv = placesByProvince as unknown as Record<string, RawPlace[]>;
  for (const list of Object.values(byProv)) {
    const hit = list?.find((p) => p.slug === slug);
    if (hit?.image) return mediaUrl(hit.image);
  }
  const details = placeDetails as unknown as Record<string, RawPlace>;
  const detail = details[slug];
  const fromDetail =
    detail?.photos?.[0] || detail?.thumbnails?.[0] || detail?.image;
  return fromDetail ? mediaUrl(fromDetail) : null;
}

export function placeTile(place: PlaceSummary, categorySlug: string) {
  const regionLabel = fromApiProvinceSlug(place.regionSlug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: place.name,
    subtitle: regionLabel || (place.isFeatured ? "Featured" : "Destination"),
    image: place.image || FALLBACK_IMAGE,
    href: `/where-to-go/category/${categorySlug}/location/${place.slug}`,
  };
}

export type Activity = {
  slug: string;
  name: string;
  description: string;
  image: string;
  id: string;
  isFeatured: boolean;
};

type RawActivity = {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  id?: string;
  _id?: string;
  alias?: string;
  thumbnail?: string;
  thumbnails?: string[];
  photos?: string[];
  isFeatured?: boolean;
};

function normalizeActivity(raw: RawActivity): Activity | null {
  if (!raw?.slug) return null;
  const image =
    raw.image ||
    raw.thumbnail ||
    raw.thumbnails?.[0] ||
    raw.photos?.[0] ||
    FALLBACK_IMAGE;
  return {
    slug: raw.slug,
    name: raw.alias || raw.name || raw.slug,
    description: (raw.description || "").trim(),
    image: mediaUrl(image),
    id: raw.id || raw._id || "",
    isFeatured: Boolean(raw.isFeatured),
  };
}

export async function fetchActivities(): Promise<Activity[]> {
  // Official activity list + thumbnails are in the dump. Skip the live
  // round-trip so home / what-to-do don't stall on gov API TLS timeouts.
  return (activitiesDump as RawActivity[])
    .map((a) => normalizeActivity(a))
    .filter((a): a is Activity => Boolean(a));
}

export async function fetchActivity(slug: string): Promise<Activity | null> {
  const all = await fetchActivities();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function fetchPlacesByActivity(
  activitySlug: string
): Promise<PlaceSummary[]> {
  const activity = await fetchActivity(activitySlug);
  const dump =
    (placesByActivityDump as unknown as Record<string, RawPlace[]>)[
      activitySlug
    ] || [];

  let live: RawPlace[] = [];
  if (activity?.id) {
    live = await liveList(
      `/location?parentActivities=${encodeURIComponent(JSON.stringify([activity.id]))}&pageSize=0`
    );
  }

  const source = live.length ? live : dump;
  return sortPlaces(
    source
      .map((p) => normalize(p))
      .filter((p): p is PlaceSummary => Boolean(p))
  );
}

export function activityPlaceTile(place: PlaceSummary, activitySlug: string) {
  return {
    title: place.name,
    subtitle: place.isFeatured ? "Featured" : "Place",
    image: place.image || FALLBACK_IMAGE,
    href: `/what-to-do/activity/${activitySlug}/location/${place.slug}`,
  };
}

export function activityTile(activity: Activity) {
  return {
    title: activity.name,
    image: activity.image,
    href: `/what-to-do/activity/${activity.slug}`,
  };
}

/** Annual cultural festivals — images resolved from real place photos. */
const ANNUAL_FESTIVALS: Array<{
  title: string;
  month: number;
  placeLabel: string;
  placeSlug: string;
  categorySlug: string;
}> = [
  {
    title: "Basant / Spring Festival",
    month: 2,
    placeLabel: "Lahore",
    placeSlug: "lahore",
    categorySlug: "top-tourist-destinations",
  },
  {
    title: "Chilam Joshi Festival",
    month: 5,
    placeLabel: "Kalash Valley",
    placeSlug: "kalash-valley",
    categorySlug: "valleys-and-lakes",
  },
  {
    title: "Shandur Polo Festival",
    month: 7,
    placeLabel: "Chitral",
    placeSlug: "shandur-lake",
    categorySlug: "valleys-and-lakes",
  },
  {
    title: "Silk Route Festival",
    month: 8,
    placeLabel: "Gilgit",
    placeSlug: "karimabad",
    categorySlug: "valleys-and-lakes",
  },
  {
    title: "Tagham Festival",
    month: 8,
    placeLabel: "Shimshal",
    placeSlug: "shimshal",
    categorySlug: "valleys-and-lakes",
  },
  {
    title: "Lok Mela",
    month: 11,
    placeLabel: "Islamabad",
    placeSlug: "lok-virsa-heritage-museum",
    categorySlug: "top-tourist-destinations",
  },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function nextFestivalDate(month: number, now = new Date()) {
  const year = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  // Still in the festival month → treat as current; otherwise next occurrence.
  if (month === currentMonth) {
    return new Date(year, month - 1, now.getDate());
  }
  if (month > currentMonth) {
    return new Date(year, month - 1, 15);
  }
  return new Date(year + 1, month - 1, 15);
}

type RawTrip = {
  title?: string;
  slug?: string;
  date?: number;
  status?: string;
  thumbnails?: string[];
  thumbnail?: string;
  startLocation?: { alias?: string; name?: string; slug?: string };
};

function tripImage(trip: RawTrip) {
  const raw =
    trip.thumbnail ||
    (Array.isArray(trip.thumbnails) ? trip.thumbnails[0] : "") ||
    "";
  return mediaUrl(raw || null);
}

function placeHref(categorySlug: string, placeSlug: string) {
  return `/where-to-go/category/${categorySlug}/location/${placeSlug}`;
}

/** Upcoming festivals & live trips — real API photos, sorted from today. */
export async function fetchFestivalTiles(limit = 6): Promise<
  Array<{ title: string; subtitle?: string; image: string; href: string }>
> {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  type Ranked = {
    title: string;
    subtitle: string;
    image: string;
    href: string;
    at: number;
    key: string;
  };

  const ranked: Ranked[] = [];

  // Live published trips with a future (or today) date.
  try {
    const json = (await insecureGetJson(
      `${API}/trip?pageSize=0&status=published`,
      5000
    )) as { data?: RawTrip[] };
    const trips = Array.isArray(json?.data) ? json.data : [];
    for (const trip of trips) {
      if (!trip?.title || !trip.slug) continue;
      const at = typeof trip.date === "number" ? trip.date : NaN;
      if (!Number.isFinite(at) || at < startOfToday) continue;
      const loc =
        trip.startLocation?.alias ||
        trip.startLocation?.name ||
        "";
      const when = new Date(at);
      const monthLabel = MONTH_NAMES[when.getMonth()]?.toUpperCase() || "";
      ranked.push({
        title: trip.title,
        subtitle: loc
          ? `${monthLabel} · ${loc}`
          : `${monthLabel} ${when.getFullYear()}`,
        image: tripImage(trip),
        href: trip.startLocation?.slug
          ? placeHref(
              "top-tourist-destinations",
              trip.startLocation.slug
            )
          : "/event",
        at,
        key: `trip:${trip.slug}`,
      });
    }
  } catch {
    /* annual calendar still fills the rail */
  }

  // Recurring cultural calendar with real place photos from the dump/API.
  for (const fest of ANNUAL_FESTIVALS) {
    const at = nextFestivalDate(fest.month, now).getTime();
    const image =
      placeImageFromDump(fest.placeSlug) || FALLBACK_IMAGE;
    ranked.push({
      title: fest.title,
      subtitle: `${MONTH_NAMES[fest.month - 1].toUpperCase()} · ${fest.placeLabel}`,
      image,
      href: placeHref(fest.categorySlug, fest.placeSlug),
      at,
      key: `fest:${fest.title}`,
    });
  }

  ranked.sort((a, b) => a.at - b.at || a.title.localeCompare(b.title));

  const seen = new Set<string>();
  const tiles: Array<{
    title: string;
    subtitle?: string;
    image: string;
    href: string;
  }> = [];

  for (const item of ranked) {
    const dedupe = item.title.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    tiles.push({
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      href: item.href,
    });
    if (tiles.length >= limit) break;
  }

  return tiles;
}
