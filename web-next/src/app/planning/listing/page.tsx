import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import TileRail from "@/components/tile-rail";
import { destinationTiles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Popular Destinations",
  description: "Browse popular destinations across Pakistan.",
};

export default function PlanListingPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Destinations"
        title="Popular destinations"
        subtitle="Places travellers ask about most — with guides on how to get there and what to do."
        image="/hero/hunza-3.jpg"
        compact
      />
      <TileRail
        kicker="Must-see"
        title="Start exploring"
        items={destinationTiles}
      />
    </main>
  );
}
