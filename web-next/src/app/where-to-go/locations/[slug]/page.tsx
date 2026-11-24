import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, TileCard } from "@/components/ui/primitives";
import { regions } from "@/lib/nav";
import { regionTiles } from "@/lib/content";
import { fetchPlacesByProvince, placeTile } from "@/lib/salam-api";

export function generateStaticParams() {
  return regions.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  return {
    title: region ? `All ${region.name} destinations` : "All destinations",
  };
}

export default async function RegionAllLocationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  if (!region) notFound();

  const tile = regionTiles.find((t) => t.href.includes(slug));
  const image = tile?.image ?? "/hero/interest/top-tourist-destinations.jpg";
  const places = await fetchPlacesByProvince(slug);
  const featured = places.filter((p) => p.isFeatured);
  const featuredTiles = featured.map((p) => placeTile(p, slug));
  const allTiles = places.map((p) => placeTile(p, slug));

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Where to go"
        title={region.name}
        subtitle={`All destinations in ${region.name}.`}
        image={image}
        compact
      />

      {featuredTiles.length > 0 && (
        <Section>
          <SectionHeading
            kicker="Places"
            title={`Featured locations in ${region.name}`}
            description="Highlights travellers ask about most."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTiles.map((t) => (
              <TileCard key={`featured-${t.href}`} {...t} />
            ))}
          </div>
        </Section>
      )}

      <Section className={featuredTiles.length ? "pt-0" : ""}>
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="Browse"
            title={`All ${region.name} locations`}
            description={`${places.length} destinations.`}
          />
          <Link
            href={`/where-to-go/location/${slug}`}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Back to {region.name}
          </Link>
        </div>

        {allTiles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTiles.map((t) => (
              <TileCard key={t.href} {...t} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">No locations found for this region yet.</p>
        )}
      </Section>
    </main>
  );
}
