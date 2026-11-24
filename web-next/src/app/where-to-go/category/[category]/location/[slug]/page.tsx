import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import DestinationTabs from "@/components/destination-tabs";
import { Section, SectionHeading } from "@/components/ui/primitives";
import TileRail from "@/components/tile-rail";
import SmartImage from "@/components/ui/smart-image";
import { mediaUrl } from "@/lib/salam-api";
import {
  destinations,
  interestCategories,
  getDestination,
  getDestinationsByRegion,
  destinationTile,
  getCategory,
} from "@/lib/destinations";
import {
  fetchPlaceDetail,
  fetchPlacesByProvince,
  fetchPlacesByCategory,
  placeTile,
} from "@/lib/salam-api";
import { regions } from "@/lib/nav";

const citySlugs = new Set([
  "islamabad",
  "lahore",
  "karachi",
  "peshawar",
  "gilgit",
  "quetta",
]);

/** Allow live API place slugs beyond the curated static set. */
export const dynamicParams = true;

export function generateStaticParams() {
  const byRegion = destinations.map((d) => ({
    category: d.regionSlug,
    slug: d.slug,
  }));
  const byCities = destinations
    .filter((d) => citySlugs.has(d.slug))
    .map((d) => ({ category: "cities", slug: d.slug }));
  const byInterest = interestCategories.flatMap((cat) =>
    cat.destinationSlugs.map((slug) => ({ category: cat.slug, slug }))
  );
  return [...byRegion, ...byCities, ...byInterest];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const local = getDestination(slug);
  if (local) {
    return { title: local.name, description: local.tagline };
  }
  const remote = await fetchPlaceDetail(slug);
  return {
    title: remote?.name ?? "Destination",
    description: remote?.description,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const local = getDestination(slug);
  const remote = local ? null : await fetchPlaceDetail(slug);
  if (!local && !remote) notFound();

  const name = local?.name ?? remote!.name;
  const description =
    local?.description ??
    (remote!.longDescription || remote!.description);
  const image = mediaUrl(local?.image ?? remote!.image);
  const regionSlug = local?.regionSlug || remote?.regionSlug || category;
  const regionMeta = regions.find((r) => r.slug === regionSlug);
  const regionName =
    local?.regionName || regionMeta?.name || remote?.regionSlug || "Pakistan";
  const categoryMeta = getCategory(category);

  const content = local
    ? {
        welcome: local.welcome,
        gettingThere: local.gettingThere,
        whatToDo: local.whatToDo,
        whenToVisit: local.whenToVisit,
        whereToStay: local.whereToStay,
        additionalInfo: local.additionalInfo,
      }
    : {
        welcome: remote!.welcome,
        gettingThere: remote!.gettingThere,
        whatToDo: remote!.whatToDo,
        whenToVisit: remote!.whenToVisit,
        whereToStay: remote!.whereToStay,
        additionalInfo: remote!.additionalInfo,
      };

  const highlights = local?.highlights ?? [];
  const gallery = local
    ? [local.image, "/hero/hunza-3.jpg", "/hero/hunza-8.jpg"]
    : remote!.photos.slice(0, 6);

  const nearbyLocal = getDestinationsByRegion(regionSlug)
    .filter((d) => d.slug !== slug)
    .map((d) => destinationTile(d, category));

  let nearby = nearbyLocal;
  if (nearby.length < 3) {
    const fromApi = interestCategories.some((c) => c.slug === category)
      ? await fetchPlacesByCategory(category)
      : await fetchPlacesByProvince(regionSlug);
    nearby = fromApi
      .filter((p) => p.slug !== slug)
      .slice(0, 8)
      .map((p) => placeTile(p, category));
  }

  const regionHref = `/where-to-go/location/${regionSlug}`;
  const categoryHref =
    categoryMeta && category !== regionSlug
      ? `/where-to-go/category/${category}`
      : null;

  return (
    <main className="bg-white">
      <PageHero
        eyebrow={categoryMeta?.name ?? regionName}
        title={name}
        subtitle={description}
        image={image}
      />

      <Section>
        <div className="flex flex-wrap gap-4">
          <Link
            href={regionHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            <MapPin className="h-4 w-4" />
            {regionName}
          </Link>
          {categoryHref && (
            <Link
              href={categoryHref}
              className="text-sm font-semibold text-ink-soft hover:text-brand hover:underline"
            >
              {categoryMeta?.name}
            </Link>
          )}
        </div>

        <div className="mt-6">
          <DestinationTabs content={content} />
        </div>

        {highlights.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-semibold text-ink">
              Highlights
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm text-ink-soft"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-3 w-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {gallery.length > 0 && (
        <Section className="pt-0">
          <SectionHeading kicker={name} title="Images" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((src, i) => (
              <div
                key={src + i}
                className="relative aspect-[4/3] overflow-hidden rounded-[20px]"
              >
                <SmartImage
                  src={mediaUrl(src)}
                  alt={`${name} ${i + 1}`}
                  fill
                  sizes="(max-width:768px) 90vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {nearby.length > 0 && (
        <div className="bg-cloud">
          <TileRail
            kicker="Nearby"
            title={`Top destinations near ${name}`}
            items={nearby}
          />
        </div>
      )}

      <Section>
        <div className="rounded-2xl border border-line bg-cloud px-6 py-8 text-center sm:px-10">
          <p className="text-sm text-ink-soft">
            Looking for transport or places to stay? We list trusted partner
            sites for your convenience — bookings are completed on their
            websites.
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
