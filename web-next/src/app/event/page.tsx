import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FactGrid, CtaBanner } from "@/components/ui/primitives";
import TileRail from "@/components/tile-rail";
import {
  fetchFestivalTiles,
  placeImageFromDump,
  mediaUrl,
} from "@/lib/salam-api";

export const metadata: Metadata = {
  title: "Festivals & events",
  description:
    "Experience Pakistan's cultural calendar — polo, melas and mountain festivals.",
};

export const revalidate = 3600;

export default async function EventPage() {
  const festivalTiles = await fetchFestivalTiles(8);
  const featured = festivalTiles[0];
  const heroImage =
    featured?.image ||
    placeImageFromDump("shandur-lake") ||
    mediaUrl(null);

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Festivals & events"
        title={featured?.title || "Shandur Polo Festival"}
        subtitle={
          featured?.subtitle
            ? `Next up · ${featured.subtitle}`
            : "Free-style polo on the world's highest polo ground at 3,700 metres."
        }
        image={heroImage}
        compact
      />

      <Section>
        <SectionHeading kicker="At a glance" title="Event details" />
        <FactGrid
          items={[
            { label: "When", value: featured?.subtitle?.split("·")[0]?.trim() || "Seasonal" },
            { label: "Where", value: featured?.subtitle?.split("·")[1]?.trim() || "Pakistan" },
            { label: "Region", value: "Across Pakistan" },
            { label: "Calendar", value: "Updated live" },
          ]}
        />
      </Section>

      <Section className="pt-0">
        <div className="max-w-2xl space-y-4 text-base leading-relaxed text-ink-soft">
          <p>
            From mountain polo on the roof of the world to folk melas in the
            capital, Pakistan&apos;s festival calendar moves with the seasons.
            The events below are ordered from today — upcoming first, with real
            photos from each host destination.
          </p>
        </div>
      </Section>

      <TileRail
        kicker="Coming up"
        title="Festivals & events"
        items={festivalTiles}
      />

      <CtaBanner
        title="Explore destinations nearby"
        text="Discover the regions and places that host Pakistan's festivals."
        buttonLabel="Where to go"
        href="/where-to-go"
        image={placeImageFromDump("hunza") || heroImage}
      />
    </main>
  );
}
