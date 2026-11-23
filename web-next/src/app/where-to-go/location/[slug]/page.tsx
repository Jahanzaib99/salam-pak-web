import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, TileCard } from "@/components/ui/primitives";
import { regions } from "@/lib/nav";
import { regionTiles } from "@/lib/content";
import {
  getDestinationsByRegion,
  destinationTile,
} from "@/lib/destinations";

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
  return { title: region ? region.name : "Region" };
}

const blurbs: Record<string, string> = {
  "gilgit-baltistan":
    "Explore the untamed and stunning nature that surrounds Gilgit — from serene meadows to calming rivers and imposing peaks.",
  balochistan:
    "A land that is yet to be explored by travellers around the world — deserts, coastline and highland valleys.",
  punjab:
    "The Land of Five Rivers — culturally and historically rich, with extraordinary monuments and cuisine.",
  sindh:
    "Sindh's landscape of alluvial plains, Indus heritage and the Arabian Sea coast.",
  "khyber-pakhtunkhwa":
    "Peaks, valleys and the ancient Gandhara civilisation — from Swat to Peshawar.",
  islamabad:
    "Pakistan's green planned capital at the foot of the Margalla Hills.",
  "azad-kashmir":
    "Green valleys, rivers and mountain scenery in Azad Jammu & Kashmir.",
};

export default async function RegionLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  if (!region) notFound();

  const tile = regionTiles.find((t) => t.href.includes(slug));
  const image = tile?.image ?? "/hero/hunza-1.jpg";
  const places = getDestinationsByRegion(slug).map(destinationTile);

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Where to go"
        title={region.name}
        subtitle={blurbs[slug] ?? `Discover the best of ${region.name}.`}
        image={image}
      />

      <Section>
        <SectionHeading
          kicker="Places"
          title={`Top tourist destinations of ${region.name}`}
          description="Select a destination to learn how to get there, what to do and when to visit."
        />
        {places.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((t) => (
              <TileCard key={t.title} {...t} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">
            Destination guides for this region are being added. Browse{" "}
            <Link href="/where-to-go" className="font-semibold text-brand hover:underline">
              all categories
            </Link>{" "}
            meanwhile.
          </p>
        )}
      </Section>
    </main>
  );
}
