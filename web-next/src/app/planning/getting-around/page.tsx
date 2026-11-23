import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FeatureCard, CtaBanner } from "@/components/ui/primitives";
import { Plane, TrainFront, Bus, Car } from "lucide-react";

export const metadata: Metadata = {
  title: "Travel within Pakistan",
  description: "Flights, trains, buses and cabs to travel around Pakistan.",
};

export default function GettingAroundPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Getting around"
        title="Travel within Pakistan"
        subtitle="Your options for moving between cities, valleys and regions."
        image="/hero/hunza-9.jpg"
        compact
      />

      <Section>
        <SectionHeading
          kicker="Transport"
          title="How to get around"
          description="From domestic flights to scenic rail journeys and comfortable coaches."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={Plane} title="Domestic flights">
            Fastest way to reach the north and connect major cities.
          </FeatureCard>
          <FeatureCard icon={TrainFront} title="Railways">
            Scenic and affordable long-distance travel across the plains.
          </FeatureCard>
          <FeatureCard icon={Bus} title="Intercity buses">
            Modern, comfortable coaches connect virtually every city.
          </FeatureCard>
          <FeatureCard icon={Car} title="Cabs & car hire">
            Ride-hailing in cities and private cars with drivers for the hills.
          </FeatureCard>
        </div>
      </Section>

      <CtaBanner
        title="Book your transport"
        text="Reserve buses, flights, railways and cabs in a few taps."
        buttonLabel="Go to bookings"
        href="/bookings"
        image="/hero/hunza-4.jpg"
      />
    </main>
  );
}
