import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, TileCard, CtaBanner } from "@/components/ui/primitives";
import { experienceTiles } from "@/lib/content";

export const metadata: Metadata = {
  title: "What to Do",
  description: "Experiences and activities across Pakistan.",
};

export default function WhatToDoPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="What to do"
        title="Unforgettable experiences"
        subtitle="Trek to glaciers, walk ancient streets, taste street food and witness living traditions."
        image="/hero/hunza-4.jpg"
      />

      <Section>
        <SectionHeading
          kicker="Activities"
          title="Choose your adventure"
          description="Browse by the kind of experience you're looking for."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experienceTiles.map((t) => (
            <TileCard key={t.title} {...t} tall />
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Travel responsibly"
        text="Discover how to explore Pakistan sustainably and respectfully — download our Responsible Tourism guide."
        buttonLabel="View publications"
        href="/publications"
        image="/hero/hunza-9.jpg"
      />
    </main>
  );
}
