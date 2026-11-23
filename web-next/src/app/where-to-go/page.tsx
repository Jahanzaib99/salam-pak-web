import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, TileCard } from "@/components/ui/primitives";
import TileRail from "@/components/tile-rail";
import { regionTiles } from "@/lib/content";
import {
  interestCategories,
  destinations,
  destinationTile,
} from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Where to Go",
  description:
    "Pakistan has every kind of place for every spirit — explore by interest or by region.",
};

export default function WhereToGoPage() {
  const popular = destinations
    .filter((d) =>
      ["hunza", "fairy-meadows", "lahore", "skardu", "swat-valley", "mohenjo-daro"].includes(
        d.slug
      )
    )
    .map(destinationTile);

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Where to go"
        title="Where to go"
        subtitle="Pakistan has every kind of place for every spirit and for every desire. See where your heart takes you."
        image="/hero/hunza-3.jpg"
      />

      <Section>
        <SectionHeading
          kicker="As per your interest"
          title="Explore by interest"
          description="Heritage trails, mountains, beaches, cities and more."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {interestCategories
            .filter((c) => c.slug !== "cities")
            .map((c) => (
              <TileCard
                key={c.slug}
                title={c.name}
                subtitle="Category"
                image={c.image}
                href={`/where-to-go/category/${c.slug}`}
              />
            ))}
        </div>
      </Section>

      <div className="bg-cloud">
        <Section>
          <SectionHeading
            kicker="Regions"
            title="Explore by region"
            description="Seven regions, each with its own landscapes, cultures and stories."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regionTiles.map((t) => (
              <TileCard key={t.title} {...t} tall />
            ))}
          </div>
        </Section>
      </div>

      <TileRail
        kicker="Popular places"
        title="Must-see destinations"
        description="Iconic valleys, cities and heritage sites."
        items={popular}
      />
    </main>
  );
}
