import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, TileCard } from "@/components/ui/primitives";
import {
  interestCategories,
  getCategory,
  getDestinationsForCategory,
  destinationTile,
} from "@/lib/destinations";
import { regionTiles } from "@/lib/content";

export function generateStaticParams() {
  return interestCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const places = getDestinationsForCategory(category).map(destinationTile);
  const showRegions = category === "top-tourist-destinations";

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Where to go"
        title={cat.name}
        subtitle={cat.description}
        image={cat.image}
        compact
      />

      {showRegions && (
        <Section>
          <SectionHeading kicker="Places" title={cat.name} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regionTiles.map((t) => (
              <TileCard key={t.title} {...t} />
            ))}
          </div>
        </Section>
      )}

      <Section className={showRegions ? "pt-0" : ""}>
        <SectionHeading
          kicker="Destinations"
          title={showRegions ? `All ${cat.name.toLowerCase()}` : cat.name}
          description="Select a place to read about getting there, what to do and when to visit."
        />
        {places.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((t) => (
              <TileCard key={t.title} {...t} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">Destinations for this category are coming soon.</p>
        )}
      </Section>
    </main>
  );
}
