import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, TileCard, CtaBanner } from "@/components/ui/primitives";
import { experienceTiles, regionTiles } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tile = experienceTiles.find((t) => t.href.endsWith(slug));
  return { title: tile?.title ?? "Activity" };
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tile = experienceTiles.find((t) => t.href.endsWith(slug));
  const title = tile?.title ?? "Activity";
  const image = tile?.image ?? "/hero/hunza-4.jpg";

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="What to do"
        title={title}
        subtitle={`Where to enjoy ${title.toLowerCase()} across Pakistan.`}
        image={image}
      />

      <Section>
        <SectionHeading
          kicker="Best places"
          title={`Top spots for ${title.toLowerCase()}`}
          description="Our picks of the best regions to enjoy this experience."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regionTiles.slice(0, 6).map((t) => (
            <TileCard key={t.title} {...t} />
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Build it into a trip"
        text="Combine this with other experiences into a complete, bookable itinerary."
        buttonLabel="See itineraries"
        href="/trip"
        image="/hero/hunza-7.jpg"
      />
    </main>
  );
}
