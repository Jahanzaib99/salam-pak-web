import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import DestinationTabs from "@/components/destination-tabs";
import { Section, SectionHeading } from "@/components/ui/primitives";
import TileRail from "@/components/tile-rail";
import {
  destinations,
  getDestination,
  getDestinationsByRegion,
  destinationTile,
} from "@/lib/destinations";

const citySlugs = new Set([
  "islamabad",
  "lahore",
  "karachi",
  "peshawar",
  "gilgit",
  "quetta",
]);

export function generateStaticParams() {
  const byRegion = destinations.map((d) => ({
    category: d.regionSlug,
    slug: d.slug,
  }));
  // Live site also uses /category/cities/location/{city}
  const byCities = destinations
    .filter((d) => citySlugs.has(d.slug))
    .map((d) => ({ category: "cities", slug: d.slug }));
  return [...byRegion, ...byCities];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestination(slug);
  return {
    title: dest?.name ?? "Destination",
    description: dest?.tagline,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  const nearby = getDestinationsByRegion(dest.regionSlug)
    .filter((d) => d.slug !== dest.slug)
    .map(destinationTile);

  return (
    <main className="bg-white">
      <PageHero
        eyebrow={dest.regionName}
        title={dest.name}
        subtitle={dest.description}
        image={dest.image}
      />

      <Section>
        <Link
          href={`/where-to-go/location/${dest.regionSlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          <MapPin className="h-4 w-4" />
          {dest.regionName}
        </Link>

        <div className="mt-6">
          <DestinationTabs
            content={{
              welcome: dest.welcome,
              gettingThere: dest.gettingThere,
              whatToDo: dest.whatToDo,
              whenToVisit: dest.whenToVisit,
              whereToStay: dest.whereToStay,
              additionalInfo: dest.additionalInfo,
            }}
          />
        </div>

        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold text-ink">Highlights</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {dest.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Check className="h-3 w-3" />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading kicker={dest.name} title="Images" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[dest.image, "/hero/hunza-3.jpg", "/hero/hunza-8.jpg"].map((src, i) => (
            <div key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <Image
                src={src}
                alt={`${dest.name} ${i + 1}`}
                fill
                sizes="(max-width:768px) 90vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Section>

      {nearby.length > 0 && (
        <div className="bg-cloud">
          <TileRail
            kicker="Nearby"
            title={`Top destinations near ${dest.name}`}
            items={nearby}
          />
        </div>
      )}

      <Section>
        <div className="rounded-2xl border border-line bg-cloud px-6 py-8 text-center sm:px-10">
          <p className="text-sm text-ink-soft">
            Looking for transport or places to stay? We list trusted partner sites for your convenience —
            bookings are completed on their websites.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/booking-accommodation"
              className="rounded-full border-[1.5px] border-ink px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Accommodation partners
            </Link>
            <Link
              href="/planning/getting-around"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Getting around
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
