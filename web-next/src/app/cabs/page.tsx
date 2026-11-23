import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import PartnerGrid from "@/components/partner-grid";
import { cabPartners } from "@/lib/booking-partners";

export const metadata: Metadata = {
  title: "Book a Cab",
  description:
    "Explore Pakistan's cab and ride-hailing providers for convenient travel.",
};

export default function CabsPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Cabs"
        title="Discover, catch cabs seamlessly"
        subtitle="Explore Pakistan's premier cab providers for convenient travel across the country."
        image="/booking/cabs.jpg"
        compact
      />

      <PartnerGrid
        kicker="Cab providers"
        title="Choose a provider to book"
        description="Each link opens the provider's own app or site. Salam Pakistan does not process cab bookings."
        partners={cabPartners}
      />
    </main>
  );
}
