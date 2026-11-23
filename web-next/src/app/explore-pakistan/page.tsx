import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FeatureCard, CtaBanner } from "@/components/ui/primitives";
import { Info, Plane, Bus, MapPin, FileCheck2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Pakistan",
  description: "Everything you need to plan your trip to Pakistan.",
};

const guides = [
  { icon: Info, title: "Basic Facts of Pakistan", href: "/planning/tips", text: "Geography, climate, languages, currency and essential know-before-you-go." },
  { icon: Plane, title: "Getting to Pakistan", href: "/planning/getting-here", text: "International airports, airlines and entry points into the country." },
  { icon: Bus, title: "Travel within Pakistan", href: "/planning/getting-around", text: "Flights, trains, buses and cabs to move around the country." },
  { icon: FileCheck2, title: "Apply E-Visa", href: "/planning/visa", text: "Check eligibility and apply online for your tourist visa." },
  { icon: MapPin, title: "Tourist Information Centers", href: "/planning/tic", text: "PTDC information centers and offices across Pakistan." },
  { icon: ShieldCheck, title: "Travel advisory", href: "/planning/covid", text: "Health, safety and the latest travel guidance." },
];

export default function ExplorePakistanPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Explore Pakistan"
        title="Plan the perfect trip"
        subtitle="Practical guides and tools to help you prepare for your journey to Pakistan."
        image="/hero/hunza-10.jpg"
      />

      <Section>
        <SectionHeading
          kicker="Travel guides"
          title="Know before you go"
          description="Essential information, from visas to transport and local etiquette."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.title} href={g.href} className="group block">
              <FeatureCard icon={g.icon} title={g.title}>
                {g.text}
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </FeatureCard>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="See Pakistan on the interactive map"
        text="Explore regions, heritage trails and destinations on our 3D interactive map."
        buttonLabel="Open the map"
        href="/map/3d-map"
        image="/hero/hunza-3.jpg"
      />
    </main>
  );
}
