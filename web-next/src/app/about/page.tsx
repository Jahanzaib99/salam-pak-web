import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import {
  Section,
  SectionHeading,
  SplitSection,
  FactGrid,
  FeatureCard,
  CtaBanner,
} from "@/components/ui/primitives";
import { Compass, Users, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "About PTDC",
  description: "About the Pakistan Tourism Development Corporation and Salam Pakistan.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="About us"
        title="Welcome to Salam Pakistan"
        subtitle="The official travel platform of the Pakistan Tourism Development Corporation."
        image="/hero/hunza-10.jpg"
        compact
      />

      <SplitSection
        kicker="Our mission"
        title="Opening Pakistan to the world"
        image="/hero/hunza-4.jpg"
      >
        <p>
          Salam Pakistan is the national gateway to travel in Pakistan — from the
          towering peaks of the Karakoram to the ancient cities of the Indus
          Valley and the beaches of the Arabian Sea.
        </p>
        <p>
          Developed by the Pakistan Tourism Development Corporation (PTDC), the
          platform brings destinations, experiences, bookings and trusted
          information together in one place.
        </p>
      </SplitSection>

      <Section className="pt-0">
        <SectionHeading kicker="What we stand for" title="Our values" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Compass} title="Authentic journeys">
            Showcasing the real Pakistan — its people, places and living heritage.
          </FeatureCard>
          <FeatureCard icon={Leaf} title="Responsible tourism">
            Promoting travel that protects nature and benefits local communities.
          </FeatureCard>
          <FeatureCard icon={Users} title="Warm hospitality">
            Helping every visitor feel the legendary welcome of Pakistan.
          </FeatureCard>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading kicker="At a glance" title="Pakistan by the numbers" />
        <FactGrid
          items={[
            { label: "UNESCO World Heritage Sites", value: "6" },
            { label: "Peaks above 7,000m", value: "100+" },
            { label: "Of the world's 14 highest peaks", value: "5" },
            { label: "Provinces & territories", value: "7" },
            { label: "Years of civilisation", value: "5,000+" },
            { label: "National languages", value: "70+" },
          ]}
        />
      </Section>

      <CtaBanner
        title="Start your Pakistan story"
        text="Discover destinations, plan your route and book your journey today."
        buttonLabel="Explore destinations"
        href="/where-to-go"
        image="/hero/hunza-1.jpg"
      />
    </main>
  );
}
