import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import InteractiveMap from "@/components/interactive-map";
import { CtaBanner } from "@/components/ui/primitives";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "3D Interactive Map",
  description:
    "Explore Pakistan’s illustrated 3D tourist maps — tap the red pins to discover destinations.",
};

export default function ThreeDMapPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Interactive map"
        title="Explore Pakistan in 3D"
        subtitle="Pan, zoom and tap the red pins already drawn into the PTDC artwork."
        image="/maps/pakistan-cut-1600.webp"
        compact
      />

      <section className="py-12 lg:py-16">
        <Reveal>
          <InteractiveMap />
        </Reveal>
      </section>

      <CtaBanner
        title="Ready to go deeper?"
        text="Browse each region’s highlights, trips and places to stay."
        buttonLabel="Where to go"
        href="/where-to-go"
        image="/hero/hunza-5.jpg"
      />
    </main>
  );
}
