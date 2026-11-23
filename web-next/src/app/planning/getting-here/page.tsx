import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FeatureCard, CtaBanner } from "@/components/ui/primitives";
import { Plane, Globe, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Getting to Pakistan",
  description: "International airports, airlines and entry points.",
};

export default function GettingHerePage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Getting here"
        title="Getting to Pakistan"
        subtitle="How to reach the country by air and land."
        image="/hero/hunza-7.jpg"
        compact
      />

      <Section>
        <SectionHeading
          kicker="By air"
          title="International airports"
          description="Pakistan is served by several international airports with direct connections across Asia, the Middle East and Europe."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Plane} title="Islamabad (ISB)">
            The capital&apos;s modern gateway, ideal for the northern regions.
          </FeatureCard>
          <FeatureCard icon={Plane} title="Karachi (KHI)">
            The largest hub in the south, serving Sindh and the coast.
          </FeatureCard>
          <FeatureCard icon={Plane} title="Lahore (LHE)">
            Gateway to Punjab and Pakistan&apos;s cultural heartland.
          </FeatureCard>
          <FeatureCard icon={Globe} title="Major airlines">
            PIA, Emirates, Qatar Airways, Turkish Airlines, Etihad and more.
          </FeatureCard>
          <FeatureCard icon={FileCheck2} title="Entry requirements">
            A valid passport and visa (or e-visa) are required for most visitors.
          </FeatureCard>
          <FeatureCard icon={Globe} title="Land borders">
            Entry is possible via designated crossings with neighbouring countries.
          </FeatureCard>
        </div>
      </Section>

      <CtaBanner
        title="Apply for your E-Visa"
        text="Most travellers can apply online. Check your eligibility and start your application."
        buttonLabel="Apply E-Visa"
        href="/planning/visa"
        image="/hero/hunza-2.jpg"
      />
    </main>
  );
}
