import { NextResponse } from "next/server";
import {
  SURROUNDINGS_FILTERS,
  getSurroundingsFilter,
  type NearbyPlace,
} from "@/lib/surroundings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NominatimItem = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
};

type GoogleNearbyResult = {
  place_id?: string;
  name?: string;
  vicinity?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
};

type GoogleNearbyResponse = {
  status?: string;
  error_message?: string;
  results?: GoogleNearbyResult[];
};

const cache = new Map<string, { at: number; places: NearbyPlace[]; source: string }>();
const CACHE_MS = 15 * 60 * 1000;

function viewbox(lat: number, lng: number, radiusKm = 12) {
  const dLat = radiusKm / 111;
  const dLng = radiusKm / (111 * Math.cos((lat * Math.PI) / 180) || 1);
  return `${lng - dLng},${lat + dLat},${lng + dLng},${lat - dLat}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

async function fromGoogle(
  lat: number,
  lng: number,
  type: string,
  apiKey: string
): Promise<NearbyPlace[]> {
  const filter = getSurroundingsFilter(type);
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  );
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", "8000");
  url.searchParams.set("type", filter.googleType);
  if (filter.googleKeyword) {
    url.searchParams.set("keyword", filter.googleKeyword);
  }
  url.searchParams.set("key", apiKey);

  const res = await withTimeout(
    fetch(url.toString(), { cache: "no-store" }),
    7000,
    "Google Places"
  );
  if (!res.ok) throw new Error(`Google Places HTTP ${res.status}`);

  const json = (await withTimeout(
    res.json() as Promise<GoogleNearbyResponse>,
    5000,
    "Google Places parse"
  )) as GoogleNearbyResponse;
  if (json.status && json.status !== "OK" && json.status !== "ZERO_RESULTS") {
    throw new Error(json.error_message || `Google Places ${json.status}`);
  }

  const places: NearbyPlace[] = [];
  for (const item of json.results || []) {
    const pLat = item.geometry?.location?.lat;
    const pLng = item.geometry?.location?.lng;
    if (!Number.isFinite(pLat) || !Number.isFinite(pLng)) continue;
    places.push({
      id: item.place_id || `google/${pLat},${pLng}`,
      name: item.name || item.vicinity || filter.label,
      lat: pLat!,
      lng: pLng!,
      kind: filter.label,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${pLat},${pLng}`,
    });
    if (places.length >= 30) break;
  }
  return places;
}

async function fromNominatim(
  lat: number,
  lng: number,
  type: string
): Promise<NearbyPlace[]> {
  const filter = getSurroundingsFilter(type);
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", filter.query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "30");
  url.searchParams.set("viewbox", viewbox(lat, lng));
  url.searchParams.set("bounded", "1");
  url.searchParams.set("addressdetails", "0");

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "SalamPakistanWeb/1.0 (destination surroundings map)",
    },
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);

  const items = (await res.json()) as NominatimItem[];
  const places: NearbyPlace[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const pLat = Number(item.lat);
    const pLng = Number(item.lon);
    if (!Number.isFinite(pLat) || !Number.isFinite(pLng)) continue;
    const id = `nominatim/${item.place_id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    places.push({
      id,
      name:
        item.name ||
        item.display_name.split(",")[0]?.trim() ||
        filter.label,
      lat: pLat,
      lng: pLng,
      kind: filter.label,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${pLat},${pLng}`,
    });
  }
  return places;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const type = String(searchParams.get("type") || "food");

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 }
    );
  }

  if (!SURROUNDINGS_FILTERS.some((f) => f.id === type)) {
    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  }

  const cacheKey = `${type}:${lat.toFixed(3)},${lng.toFixed(3)}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return NextResponse.json({
      places: hit.places,
      type,
      count: hit.places.length,
      source: hit.source,
      cached: true,
    });
  }

  // Only real Google Maps keys (AIza…). CARTO keys must not be sent to Google.
  const googleKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  const useGoogle = Boolean(googleKey?.startsWith("AIza"));
  let places: NearbyPlace[] = [];
  let source = "nominatim";
  let error: string | undefined;

  if (useGoogle && googleKey) {
    try {
      places = await fromGoogle(lat, lng, type, googleKey);
      source = "google";
    } catch (err) {
      error = err instanceof Error ? err.message : "Google Places failed";
    }
  }

  if (!places.length) {
    try {
      places = await fromNominatim(lat, lng, type);
      source = "nominatim";
      if (places.length) error = undefined;
    } catch (err) {
      error =
        error ||
        (err instanceof Error ? err.message : "Nearby lookup failed");
    }
  }

  if (places.length) {
    cache.set(cacheKey, { at: Date.now(), places, source });
  }

  return NextResponse.json({
    places,
    type,
    count: places.length,
    source,
    ...(error && !places.length ? { error } : {}),
  });
}
