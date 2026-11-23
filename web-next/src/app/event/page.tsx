import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FactGrid, CtaBanner } from "@/components/ui/primitives";
import TileRail from "@/components/tile-rail";
import { eventTiles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shandur Polo Festival",
  description: "Experience the legendary Shandur Polo Festival in Chitral.",
};

export default function EventPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Festival · July"
        title="Shandur Polo Festival"
        subtitle="Free-style polo on the world's highest polo ground at 3,700 metres."
        image="/hero/hunza-4.jpg"
        compact
      />

      <Section>
        <SectionHeading kicker="At a glance" title="Event details" />
        <FactGrid
          items={[
            { label: "When", value: "Early July" },
            { label: "Where", value: "Shandur Pass" },
            { label: "Region", value: "Chitral / Gilgit" },
            { label: "Altitude", value: "3,700 m" },
            { label: "Duration", value: "3 days" },
            { label: "Entry", value: "Free" },
          ]}
        />
      </Section>

      <Section className="pt-0">
        <div className="max-w-2xl space-y-4 text-base leading-relaxed text-ink-soft">
          <p>
            Every July, teams from Chitral and Gilgit meet on the roof of the
            world for a fierce, free-style form of polo played without rules on
            the highest polo ground on earth.
          </p>
          <p>
            Alongside the matches, the festival comes alive with folk music,
            dance, a tent village and traditional food — an unforgettable
            celebration of mountain culture.
          </p>
        </div>
      </Section>

      <TileRail kicker="More festivals" title="Other events to explore" items={eventTiles} />

      <CtaBanner
        title="Explore destinations nearby"
        text="Discover the regions and places that host Pakistan's festivals."
        buttonLabel="Where to go"
        href="/where-to-go"
        image="/hero/hunza-7.jpg"
      />
    </main>
  );
}
