import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FeatureCard } from "@/components/ui/primitives";
import { ShieldCheck, HeartPulse, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Advisory",
  description: "Health, safety and travel guidance for Pakistan.",
};

export default function AdvisoryPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Travel advisory"
        title="Health & safety"
        subtitle="Up-to-date guidance to help you travel safely and confidently."
        image="/hero/hunza-8.jpg"
        compact
      />

      <Section>
        <SectionHeading kicker="Good to know" title="Travel with confidence" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={ShieldCheck} title="Entry requirements">
            Keep your passport, visa and any required documents up to date before travel.
          </FeatureCard>
          <FeatureCard icon={HeartPulse} title="Health & altitude">
            Acclimatise gradually in the high north and carry basic medication.
          </FeatureCard>
          <FeatureCard icon={Phone} title="Emergency contacts">
            Save the 24/7 Tourism Helpline 1422 and local emergency numbers.
          </FeatureCard>
        </div>
      </Section>
    </main>
  );
}
