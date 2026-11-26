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
const S = "/hero/scenic";

export const regionTiles: Tile[] = [
  {
    title: "Gilgit-Baltistan",
    subtitle: "Mountains & valleys",
    image: `${H}/hunza-8.jpg`,
    href: "/where-to-go/location/gilgit-baltistan",
  },
  {
    title: "Khyber Pakhtunkhwa",
    subtitle: "Peaks & heritage",
    image: `${S}/reg-swat-kandol.jpg`,
    href: "/where-to-go/location/khyber-pakhtunkhwa",
  },
  {
    title: "Punjab",
    subtitle: "History & culture",
    image: `${S}/reg-badshahi-facade.jpg`,
    href: "/where-to-go/location/punjab",
  },
  {
    title: "Sindh",
    subtitle: "Coast & civilisation",
    image: `${S}/reg-mohenjo.jpg`,
    href: "/where-to-go/location/sindh",
  },
  {
    title: "Balochistan",
    subtitle: "Deserts & coastline",
    image: `${S}/reg-hingol.jpg`,
    href: "/where-to-go/location/balochistan",
  },
  {
    title: "Azad Kashmir",
    subtitle: "Green valleys",
    image: `${S}/reg-islamabad-hills.jpg`,
    href: "/where-to-go/location/azad-kashmir",
  },
  {
    title: "Islamabad",
    subtitle: "The capital",
    image: `${S}/reg-islamabad-dusk.jpg`,
    href: "/where-to-go/location/islamabad",
  },
];

export const destinationTiles: Tile[] = destinations.map((d) =>
  destinationTile(d)
);
