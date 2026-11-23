import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Bus,
  CarTaxiFront,
  Plane,
  TrainFront,
} from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import { Section, CtaBanner } from "@/components/ui/primitives";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Bookings",
  description:
    "Find flights, trains, buses, cabs and accommodation via trusted booking partners.",
};

const categories = [
  {
    title: "Accommodation",
    subtitle: "Hotels & guesthouses",
    blurb: "Reserve stays from city hotels to mountain lodges with trusted platforms.",
    image: "/booking/accommodation.jpg",
    href: "/booking-accommodation",
    icon: BedDouble,
    featured: true,
  },
  {
    title: "Flights",
    subtitle: "Airlines & platforms",
    blurb: "Compare domestic and international fares with PIA and leading carriers.",
    image: "/booking/flights.jpg",
    href: "/booking-flight",
    icon: Plane,
    featured: true,
  },
  {
    title: "Railway",
    subtitle: "Pakistan Railways",
    blurb: "Book long-distance trains across the country on official channels.",
    image: "/booking/railway.jpg",
    href: "/booking-railway",
    icon: TrainFront,
  },
  {
    title: "Bus",
    subtitle: "Intercity coaches",
    blurb: "Travel between cities with Daewoo, Faisal Movers and other operators.",
    image: "/booking/bus.jpg",
    href: "/booking-bus",
    icon: Bus,
  },
  {
    title: "Cabs",
    subtitle: "Ride-hailing & transfers",
    blurb: "Airport transfers and city rides with Careem, inDrive and more.",
    image: "/booking/cabs.jpg",
    href: "/cabs",
    icon: CarTaxiFront,
  },
] as const;

export default function BookingsPage() {
  const featured = categories.filter((c) => "featured" in c && c.featured);
  const rest = categories.filter((c) => !("featured" in c && c.featured));

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Bookings"
        title="Plan every part of your journey"
        subtitle="Stay, fly, ride the rails or take the road — we connect you to trusted partners. Bookings are completed on their sites."
        image="/booking/hero.jpg"
        compact
      />

      <Section>
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
              What would you like to book?
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
              Travel & stay, sorted
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              Choose a category to open partner booking sites. Salam Pakistan
              does not process payments or reservations.
            </p>
          </div>
        </Reveal>

        {/* Featured row */}
        <div className="grid gap-5 lg:grid-cols-2">
          {featured.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <BookingCard {...c} large />
            </Reveal>
          ))}
        </div>

        {/* Secondary row */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((c, i) => (
            <Reveal key={c.title} delay={0.08 + i * 0.05}>
              <BookingCard {...c} />
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="border-y border-line bg-cloud">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
            Prefer a human guide? Call the{" "}
            <span className="font-semibold text-ink">24/7 tourism helpline</span>{" "}
            for routes, timings and booking advice.
          </p>
          <Link
            href="tel:1422"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Call 1422 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <CtaBanner
        title="Need a hand planning?"
        text="Browse destinations first, then come back here when you are ready to book."
        buttonLabel="Where to go"
        href="/where-to-go"
        image="/hero/hunza-8.jpg"
      />
    </main>
  );
}

function BookingCard({
  title,
  subtitle,
  blurb,
  image,
  href,
  icon: Icon,
  large = false,
}: {
  title: string;
  subtitle: string;
  blurb: string;
  image: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative block overflow-hidden rounded-[24px] bg-ink",
        large ? "aspect-[16/10] min-h-[280px]" : "aspect-[4/3] min-h-[240px]",
      ].join(" ")}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
      <div className="absolute inset-0 bg-brand/0 transition-colors duration-300 group-hover:bg-brand/10" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 sm:p-6">
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
          {subtitle}
        </span>
        <h3
          className={[
            "mt-1 font-display font-bold tracking-tight text-white",
            large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
          ].join(" ")}
        >
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
          {blurb}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          View partners
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
