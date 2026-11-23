import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, CtaBanner } from "@/components/ui/primitives";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Maps",
  description: "Explore interactive and printable tourist maps of Pakistan.",
};

const maps = [
  { title: "Country Guide Map", subtitle: "All of Pakistan", image: "/maps/pakistan-1600.jpg" },
  { title: "Islamabad Capital Territory", subtitle: "Capital region", image: "/maps/islamabad-1600.jpg" },
  { title: "Buddhist Pilgrimage & Heritage Trail", subtitle: "Gandhara", image: "/maps/gandhara-1600.jpg" },
  { title: "Sikh Pilgrimage Heritage Trail", subtitle: "Gurdwaras", image: "/maps/gurdwara-1600.jpg" },
];

export default function MapPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Maps"
        title="Find your way around Pakistan"
        subtitle="Interactive 3D maps and printable guides for every kind of journey."
        image="/hero/hunza-3.jpg"
        compact
      />

      <Section>
        <SectionHeading
          kicker="Explore"
          title="Interactive 3D map"
          description="Fly across Pakistan's provinces and discover destinations in a fully interactive view."
        />
        <Link
          href="/map/3d-map"
          className="group relative block overflow-hidden rounded-[24px]"
        >
          <div className="relative aspect-[21/9]">
            <Image
              src="/maps/pakistan-1600.jpg"
              alt="Interactive 3D map of Pakistan"
              fill
              sizes="(max-width:1024px) 100vw, 1100px"
              className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-white lg:text-3xl">
                Launch the 3D map
              </h3>
              <p className="mt-1 text-sm text-white/85">
                Pan, zoom and explore all seven regions.
              </p>
            </div>
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white text-ink transition-colors group-hover:bg-brand group-hover:text-white">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </Section>

      <Section className="pt-0">
        <SectionHeading kicker="Printable" title="Tourist guide maps" />
        <div className="grid gap-6 sm:grid-cols-2">
          {maps.map((m) => (
            <div key={m.title} className="group overflow-hidden rounded-[20px] border border-line bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={m.image}
                  alt={m.title}
                  fill
                  sizes="(max-width:768px) 90vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {m.subtitle}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Download maps & publications"
        text="Get printable maps, guides and brochures for your trip to Pakistan."
        buttonLabel="Browse publications"
        href="/publications"
        image="/hero/hunza-8.jpg"
      />
    </main>
  );
}
