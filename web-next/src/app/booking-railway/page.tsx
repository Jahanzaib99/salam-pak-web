import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import PartnerGrid from "@/components/partner-grid";
import { railwayPartners } from "@/lib/booking-partners";

export const metadata: Metadata = {
  title: "Book Railway",
  description:
    "Book Pakistan Railways tickets via the official site and trusted online platforms.",
};

export default function BookingRailwayPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Railway"
        title="See Pakistan by rail"
        subtitle="Book tickets through Pakistan Railways and trusted online platforms."
        image="/booking/railway.jpg"
        compact
      />

      <PartnerGrid
        kicker="Railway partners"
        title="Choose where to book"
        description="Each link opens the partner's booking site. Salam Pakistan does not process railway bookings."
        partners={railwayPartners}
      />
    </main>
  );
}
