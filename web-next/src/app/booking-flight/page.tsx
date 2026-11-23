import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import PartnerGrid from "@/components/partner-grid";
import { flightPartners } from "@/lib/booking-partners";

export const metadata: Metadata = {
  title: "Book Flights",
  description:
    "Compare and book flights with leading domestic airlines and international travel platforms.",
};

export default function BookingFlightPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Flights"
        title="Book your flight to Pakistan"
        subtitle="Compare fares across leading domestic and international airlines to find the best routes and prices."
        image="/booking/flights.jpg"
        compact
      />

      <PartnerGrid
        kicker="Airlines & platforms"
        title="Choose where to book"
        description="Each link opens the airline or comparison site. Salam Pakistan does not process flight bookings."
        partners={flightPartners}
      />
    </main>
  );
}
