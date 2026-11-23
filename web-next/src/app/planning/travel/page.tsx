import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import TileRail from "@/components/tile-rail";
import { CtaBanner } from "@/components/ui/primitives";
import { destinationTiles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Travel Inspiration",
  description: "Ideas and inspiration for discovering Pakistan.",
};

export default function TravelInspirationPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Inspiration"
        title="Travel inspiration"
        subtitle="Hand-picked destinations to spark your next journey through Pakistan."
        image="/hero/hunza-1.jpg"
        compact
      />

      <TileRail
        kicker="Destinations"
        title="Places worth discovering"
        description="From mountain valleys to ancient cities."
        items={destinationTiles.slice(0, 8)}
      />

      <CtaBanner
        title="Browse every region"
        text="Explore Pakistan by region or by interest — mountains, heritage, beaches and more."
        buttonLabel="Where to go"
        href="/where-to-go"
        image="/hero/hunza-5.jpg"
      />
    </main>
  );
}
