import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/page-hero";
import { Section, TileCard } from "@/components/ui/primitives";
import {
  fetchActivities,
  fetchActivity,
  fetchPlacesByActivity,
  activityPlaceTile,
} from "@/lib/salam-api";

export async function generateStaticParams() {
  const activities = await fetchActivities();
  return activities.map((a) => ({ activity: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ activity: string }>;
}): Promise<Metadata> {
  const { activity: slug } = await params;
  const activity = await fetchActivity(slug);
  return {
    title: activity?.name ?? "Activity",
    description: activity?.description,
  };
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ activity: string }>;
}) {
  const { activity: slug } = await params;
  const activity = await fetchActivity(slug);
  if (!activity) notFound();

  const places = await fetchPlacesByActivity(slug);
  const tiles = places.map((p) => activityPlaceTile(p, slug));
  const allActivities = await fetchActivities();

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="What to do"
        title={activity.name}
        subtitle={activity.description || activity.name}
        image={activity.image}
        compact
      />

      <Section>
        <div className="mb-10">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
            What to do
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
            All {activity.name}
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            {places.length} places related to {activity.name.toLowerCase()}.
          </p>
        </div>

        {tiles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((t) => (
              <TileCard key={t.href} {...t} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">Places for this activity are coming soon.</p>
        )}
      </Section>

      <Section className="border-t border-line bg-cloud">
        <h2 className="font-display text-2xl font-bold text-ink">
          Browse other activities
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/what-to-do"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          >
            All
          </Link>
          {allActivities.map((a) => (
            <Link
              key={a.slug}
              href={`/what-to-do/activity/${a.slug}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                a.slug === slug
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-ink hover:border-brand hover:text-brand"
              }`}
            >
              {a.name}
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
