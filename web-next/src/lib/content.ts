import {
  destinations,
  destinationTile,
} from "@/lib/destinations";

export interface Tile {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
}

const H = "/hero";

export const regionTiles: Tile[] = [
  { title: "Gilgit-Baltistan", subtitle: "Mountains & valleys", image: `${H}/hunza-1.jpg`, href: "/where-to-go/location/gilgit-baltistan" },
  { title: "Khyber Pakhtunkhwa", subtitle: "Peaks & heritage", image: `${H}/hunza-3.jpg`, href: "/where-to-go/location/khyber-pakhtunkhwa" },
  { title: "Punjab", subtitle: "History & culture", image: `${H}/hunza-5.jpg`, href: "/where-to-go/location/punjab" },
  { title: "Sindh", subtitle: "Coast & civilisation", image: `${H}/hunza-7.jpg`, href: "/where-to-go/location/sindh" },
  { title: "Balochistan", subtitle: "Deserts & coastline", image: `${H}/hunza-9.jpg`, href: "/where-to-go/location/balochistan" },
  { title: "Azad Kashmir", subtitle: "Green valleys", image: `${H}/hunza-2.jpg`, href: "/where-to-go/location/azad-kashmir" },
  { title: "Islamabad", subtitle: "The capital", image: `${H}/hunza-10.jpg`, href: "/where-to-go/location/islamabad" },
];

export const destinationTiles: Tile[] = destinations.map(destinationTile);

export const experienceTiles: Tile[] = [
  { title: "Trekking & Mountaineering", subtitle: "Adventure", image: `${H}/hunza-4.jpg`, href: "/what-to-do/trekking" },
  { title: "Cultural Heritage", subtitle: "Heritage", image: `${H}/hunza-6.jpg`, href: "/what-to-do/heritage" },
  { title: "Lakes & Valleys", subtitle: "Nature", image: `${H}/hunza-8.jpg`, href: "/what-to-do/nature" },
  { title: "Food & Bazaars", subtitle: "Culture", image: `${H}/hunza-5.jpg`, href: "/what-to-do/food" },
  { title: "Religious Tourism", subtitle: "Pilgrimage", image: `${H}/hunza-2.jpg`, href: "/what-to-do/religious" },
  { title: "Wildlife & Eco", subtitle: "Nature", image: `${H}/hunza-9.jpg`, href: "/what-to-do/wildlife" },
];

export const eventTiles: Tile[] = [
  { title: "Shandur Polo Festival", subtitle: "July · Chitral", image: `${H}/hunza-4.jpg`, href: "/event" },
  { title: "Silk Route Festival", subtitle: "August · Gilgit", image: `${H}/hunza-7.jpg`, href: "/event" },
  { title: "Lok Mela", subtitle: "November · Islamabad", image: `${H}/hunza-10.jpg`, href: "/event" },
  { title: "Basant / Spring Festival", subtitle: "February · Punjab", image: `${H}/hunza-8.jpg`, href: "/event" },
];
