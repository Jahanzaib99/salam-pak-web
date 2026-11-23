import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import PartnerGrid from "@/components/partner-grid";
import { busPartners } from "@/lib/booking-partners";

export const metadata: Metadata = {
  title: "Book Bus",
  description:
    "Explore Pakistan's premier bus service providers and book your intercity journey.",
};

export default function BookingBusPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Bus"
        title="Discover, catch buses seamlessly"
        subtitle="Explore Pakistan's premier bus service providers for convenient travel across the country."
        image="/booking/bus.jpg"
        compact
      />

      <PartnerGrid
        kicker="Bus operators"
        title="Choose a provider to book"
        description="Each link opens the operator's own booking site. Salam Pakistan does not process bus bookings."
        partners={busPartners}
      />
    </main>
  );
}
