import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import PartnerGrid from "@/components/partner-grid";
import { accommodationPartners } from "@/lib/booking-partners";

export const metadata: Metadata = {
  title: "Book Accommodation",
  description:
    "Find hotels and stays across Pakistan via Booking.com, Google Hotels and Agoda.",
};

export default function BookingAccommodationPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Accommodation"
        title="Explore and book accommodation"
        subtitle="Discover and reserve hotels and stays for your trip to Pakistan."
        image="/booking/accommodation.jpg"
        compact
      />

      <PartnerGrid
        kicker="Booking platforms"
        title="Choose where to book"
        description="Each link opens the platform's own site. Salam Pakistan does not process accommodation bookings."
        partners={accommodationPartners}
      />
    </main>
  );
}
