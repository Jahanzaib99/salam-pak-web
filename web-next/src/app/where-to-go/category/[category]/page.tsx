import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, TileCard } from "@/components/ui/primitives";
import {
  interestCategories,
  browsableInterestCategories,
  getCategory,
} from "@/lib/destinations";
import { regionTiles } from "@/lib/content";
import { fetchPlacesByCategory, placeTile } from "@/lib/salam-api";

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

  const showRegions = category === "top-tourist-destinations";
  const places = showRegions ? [] : await fetchPlacesByCategory(category);
  const tiles = places.map((p) => placeTile(p, category));

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Where to go"
        title={cat.name}
        subtitle={cat.description}
        image={cat.image}
        compact
      />

      {showRegions ? (
        <Section>
          <SectionHeading kicker="Places" title={cat.name} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regionTiles.map((t) => (
              <TileCard
                key={t.title}
                {...t}
                href={t.href.replace(
                  /\/where-to-go\/location\/([^/]+)$/,
                  "/where-to-go/location/$1"
                )}
              />
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-soft">
            Open a region to see top tourist destinations and show all places.
          </p>
        </Section>
      ) : (
        <Section>
          <SectionHeading
            kicker="Places"
            title={cat.name}
            description={
              places.length
                ? `${places.length} destinations in this collection.`
                : "Select a place to read about getting there, what to do and when to visit."
            }
          />
          {tiles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tiles.map((t) => (
                <TileCard key={t.href} {...t} />
              ))}
            </div>
          ) : (
            <p className="text-ink-soft">
              Destinations for this category are coming soon.
            </p>
          )}
        </Section>
      )}

      <Section className="border-t border-line bg-cloud">
        <SectionHeading
          kicker="Browse"
          title={`Browse ${cat.name}`}
          description="Jump to another interest collection."
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/where-to-go"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          >
            All
          </Link>
          {browsableInterestCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/where-to-go/category/${c.slug}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                c.slug === category
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-ink hover:border-brand hover:text-brand"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <Link
          href="/where-to-go"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          Back to Where to go
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </main>
  );
}
