/** POI filter chips for destination “Discover the surroundings” maps. */

export type SurroundingsFilter = {
  id: string;
  label: string;
  /** Google Places Nearby Search `type` (legacy). */
  googleType: string;
  /** Optional keyword for Google Places (hiking / trails). */
  googleKeyword?: string;
  /** Photon / OSM tag filter, e.g. amenity:atm */
  osmTag: string;
  /** Free-text query for Nominatim / Photon bias */
  query: string;
  /** Overpass tag filters (OR) — fallback. */
  overpass: string[];
};

export const SURROUNDINGS_FILTERS: SurroundingsFilter[] = [
  {
    id: "gas_station",
    label: "Gas Stations",
    googleType: "gas_station",
    osmTag: "amenity:fuel",
    query: "fuel",
    overpass: ['["amenity"="fuel"]'],
  },
  {
    id: "atm",
    label: "ATMs",
    googleType: "atm",
    osmTag: "amenity:atm",
    query: "atm",
    overpass: ['["amenity"="atm"]'],
  },
  {
    id: "fuel",
    label: "Fuel",
    googleType: "gas_station",
    osmTag: "amenity:fuel",
    query: "petrol",
    overpass: ['["amenity"="fuel"]'],
  },
  {
    id: "lodging",
    label: "Hotels",
    googleType: "lodging",
    osmTag: "tourism:hotel",
    query: "hotel",
    overpass: ['["tourism"="hotel"]', '["tourism"="guest_house"]'],
  },
  {
    id: "zoo",
    label: "Zoo",
    googleType: "zoo",
    osmTag: "tourism:zoo",
    query: "zoo",
    overpass: ['["tourism"="zoo"]'],
  },
  {
    id: "museum",
    label: "Museums",
    googleType: "museum",
    osmTag: "tourism:museum",
    query: "museum",
    overpass: ['["tourism"="museum"]'],
  },
  {
    id: "hiking",
    label: "Hiking",
    googleType: "park",
    googleKeyword: "hiking",
    osmTag: "route:hiking",
    query: "hiking trail",
    overpass: ['["route"="hiking"]', '["highway"="path"]'],
  },
  {
    id: "food",
    label: "Food",
    googleType: "restaurant",
    osmTag: "amenity:restaurant",
    query: "restaurant",
    overpass: [
      '["amenity"="restaurant"]',
      '["amenity"="fast_food"]',
      '["amenity"="cafe"]',
    ],
  },
  {
    id: "sports",
    label: "Sports and adventures",
    googleType: "gym",
    osmTag: "leisure:sports_centre",
    query: "sports",
    overpass: ['["leisure"="sports_centre"]', '["leisure"="stadium"]'],
  },
  {
    id: "mountain_trail",
    label: "Mountain trails",
    googleType: "park",
    googleKeyword: "trail",
    osmTag: "highway:path",
    query: "trail",
    overpass: ['["highway"="path"]', '["natural"="peak"]'],
  },
  {
    id: "amusement_park",
    label: "Amusement parks",
    googleType: "amusement_park",
    osmTag: "tourism:theme_park",
    query: "amusement park",
    overpass: ['["tourism"="theme_park"]'],
  },
  {
    id: "bank",
    label: "Banks",
    googleType: "bank",
    osmTag: "amenity:bank",
    query: "bank",
    overpass: ['["amenity"="bank"]'],
  },
  {
    id: "hospital",
    label: "Hospitals",
    googleType: "hospital",
    osmTag: "amenity:hospital",
    query: "hospital",
    overpass: ['["amenity"="hospital"]', '["amenity"="clinic"]'],
  },
  {
    id: "supermarket",
    label: "Super markets",
    googleType: "supermarket",
    osmTag: "shop:supermarket",
    query: "supermarket",
    overpass: ['["shop"="supermarket"]'],
  },
  {
    id: "shop",
    label: "Shops",
    googleType: "store",
    osmTag: "shop",
    query: "shop",
    overpass: ['["shop"]'],
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    googleType: "pharmacy",
    osmTag: "amenity:pharmacy",
    query: "pharmacy",
    overpass: ['["amenity"="pharmacy"]'],
  },
  {
    id: "bakery",
    label: "Bakeries",
    googleType: "bakery",
    osmTag: "shop:bakery",
    query: "bakery",
    overpass: ['["shop"="bakery"]'],
  },
  {
    id: "airport",
    label: "Airports",
    googleType: "airport",
    osmTag: "aeroway:aerodrome",
    query: "airport",
    overpass: ['["aeroway"="aerodrome"]'],
  },
  {
    id: "park",
    label: "Parks",
    googleType: "park",
    osmTag: "leisure:park",
    query: "park",
    overpass: ['["leisure"="park"]'],
  },
  {
    id: "church",
    label: "Church",
    googleType: "church",
    osmTag: "amenity:place_of_worship",
    query: "church",
    overpass: ['["amenity"="place_of_worship"]'],
  },
];

export type NearbyPlace = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind: string;
  mapsUrl: string;
};

export function getSurroundingsFilter(id: string) {
  return SURROUNDINGS_FILTERS.find((f) => f.id === id) ?? SURROUNDINGS_FILTERS[0];
}

export function buildOverpassQuery(
  lat: number,
  lng: number,
  filterId: string,
  radiusMeters = 6000
) {
  const filter = getSurroundingsFilter(filterId);
  const around = `(around:${radiusMeters},${lat},${lng})`;
  // Nodes only — faster / less rate-limit pressure.
  const parts = filter.overpass.map((tag) => `node${tag}${around};`);
  return `
[out:json][timeout:20];
(
  ${parts.join("\n  ")}
);
out 30;
`.trim();
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
