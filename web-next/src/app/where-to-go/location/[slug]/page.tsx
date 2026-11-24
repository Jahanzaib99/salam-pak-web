import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import { Section, TileCard } from "@/components/ui/primitives";
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
  return { title: region ? region.name : "Region" };
}

const blurbs: Record<string, string> = {
  "gilgit-baltistan":
    "Explore the untamed and stunning nature that surrounds Gilgit — from serene meadows to calming rivers and imposing peaks.",
  balochistan:
    "A land that is yet to be explored by travellers around the world — deserts, coastline and highland valleys.",
  punjab:
    "Punjab, “The Land of Five Rivers”, is a culturally and historically rich province, with extra-ordinary landscape.",
  sindh:
    "Sindh's landscape of alluvial plains, Indus heritage and the Arabian Sea coast.",
  "khyber-pakhtunkhwa":
    "Peaks, valleys and the ancient Gandhara civilisation — from Swat to Peshawar.",
  islamabad:
    "Pakistan's green planned capital at the foot of the Margalla Hills.",
  "azad-kashmir":
    "Green valleys, rivers and mountain scenery in Azad Jammu & Kashmir.",
};

const FEATURED_PAGE_SIZE = 12;

export default async function RegionLocationPage({
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
  const previewTiles = places
    .slice(0, FEATURED_PAGE_SIZE)
    .map((p) => placeTile(p, slug));
  const allHref = `/where-to-go/locations/${slug}`;

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Where to go"
        title={region.name}
        subtitle={blurbs[slug] ?? `Discover the best of ${region.name}.`}
        image={image}
      />

      <Section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
              Places
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
              Top tourist destinations of {region.name}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              {places.length} places to explore across {region.name}.
            </p>
          </div>
          <Link
            href={allHref}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            Show all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {previewTiles.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {previewTiles.map((t) => (
              <TileCard key={t.href} {...t} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink-soft">
            Destination guides for this region are being added. Browse{" "}
            <Link href="/where-to-go" className="font-semibold text-brand hover:underline">
              all categories
            </Link>{" "}
            meanwhile.
          </p>
        )}

        {places.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              href={allHref}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Show all destinations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Section>
    </main>
  );
}
