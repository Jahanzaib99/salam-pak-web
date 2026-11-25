import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import DestinationTabs from "@/components/destination-tabs";
import DestinationSurroundingsMap from "@/components/destination-surroundings-map";
import { Section, SectionHeading } from "@/components/ui/primitives";
import TileRail from "@/components/tile-rail";
import SmartImage from "@/components/ui/smart-image";
import { getDestination } from "@/lib/destinations";
import {
  fetchActivity,
  fetchPlaceDetail,
  fetchPlacesByActivity,
  activityPlaceTile,
  mediaUrl,
  stripHtml,
} from "@/lib/salam-api";
import { earthPins } from "@/lib/earth-destinations";
import { regions } from "@/lib/nav";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ activity: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const local = getDestination(slug);
  if (local) return { title: local.name, description: local.tagline };
  const remote = await fetchPlaceDetail(slug);
  return {
    title: remote?.name ?? "Destination",
    description: remote?.description,
  };
}

export default async function ActivityLocationPage({
  params,
}: {
  params: Promise<{ activity: string; slug: string }>;
}) {
  const { activity: activitySlug, slug } = await params;
  const activity = await fetchActivity(activitySlug);
  const local = getDestination(slug);
  const remote = await fetchPlaceDetail(slug);
  if (!local && !remote) notFound();

  const name = local?.name ?? remote!.name;
  const description = stripHtml(
    local?.description ?? (remote!.longDescription || remote!.description)
  );
  const image = mediaUrl(remote?.image || local?.image);
  const regionSlug = local?.regionSlug || remote?.regionSlug || "";
  const regionName =
    local?.regionName ||
    regions.find((r) => r.slug === regionSlug)?.name ||
    "Pakistan";

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

  const gallery =
    remote?.photos?.length
      ? remote.photos.slice(0, 6).map(mediaUrl)
      : local
        ? [mediaUrl(local.image)]
        : [];

  const nearby = (await fetchPlacesByActivity(activitySlug))
    .filter((p) => p.slug !== slug)
    .slice(0, 8)
    .map((p) => activityPlaceTile(p, activitySlug));

  const pinFallback = earthPins.find((p) => p.slug === slug);
  const mapLat = remote?.lat ?? pinFallback?.lat;
  const mapLng = remote?.lng ?? pinFallback?.lng;
  const hasMap =
    typeof mapLat === "number" &&
    typeof mapLng === "number" &&
    Number.isFinite(mapLat) &&
    Number.isFinite(mapLng);

  return (
    <main className="bg-white">
      <PageHero
        eyebrow={activity?.name ?? "What to do"}
        title={name}
        subtitle={description}
        image={image}
      />

      <Section>
        <div className="flex flex-wrap gap-4">
          {activity && (
            <Link
              href={`/what-to-do/activity/${activitySlug}`}
              className="text-sm font-semibold text-brand hover:underline"
            >
              {activity.name}
            </Link>
          )}
          {regionSlug && (
            <Link
              href={`/where-to-go/location/${regionSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-brand hover:underline"
            >
              <MapPin className="h-4 w-4" />
              {regionName}
            </Link>
          )}
        </div>

        <div className="mt-6">
          <DestinationTabs content={content} />
        </div>

        {local?.highlights?.length ? (
          <div className="mt-12">
            <h3 className="font-display text-xl font-semibold text-ink">
              Highlights
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {local.highlights.map((h) => (
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
        ) : null}
      </Section>

      {hasMap && (
        <Section className="pt-0">
          <DestinationSurroundingsMap
            name={name}
            slug={slug}
            lat={mapLat}
            lng={mapLng}
          />
        </Section>
      )}

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
                  src={src}
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
            kicker={activity?.name ?? "Related"}
            title={`More ${activity?.name?.toLowerCase() ?? "places"}`}
            items={nearby}
          />
        </div>
      )}
    </main>
  );
}
