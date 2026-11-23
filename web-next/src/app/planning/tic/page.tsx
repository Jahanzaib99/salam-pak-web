import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, CtaBanner } from "@/components/ui/primitives";
import { MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Tourist Information Centers",
  description: "PTDC tourist information centers across Pakistan.",
};

const centers = [
  { city: "Islamabad", address: "PTDC Head Office, Jinnah Avenue, Blue Area", phone: "+92 51 111 555 999" },
  { city: "Lahore", address: "Faletti's Hotel, Egerton Road", phone: "+92 42 111 555 999" },
  { city: "Karachi", address: "Shafi Court, Mereweather Road", phone: "+92 21 111 555 999" },
  { city: "Gilgit", address: "Chinar Bagh, Airport Road", phone: "+92 5811 920 123" },
  { city: "Skardu", address: "K2 Motel, Satellite Town", phone: "+92 5815 450 123" },
  { city: "Peshawar", address: "Dean's Trade Centre, Islamia Road", phone: "+92 91 111 555 999" },
];

export default function TicPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Tourist info"
        title="Tourist Information Centers"
        subtitle="Visit a PTDC center for maps, advice and on-the-ground support."
        image="/hero/hunza-6.jpg"
        compact
      />

      <Section>
        <SectionHeading kicker="Find us" title="PTDC centers across Pakistan" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {centers.map((c) => (
            <div key={c.city} className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-ink">{c.city}</h3>
              <p className="mt-3 flex items-start gap-2 text-sm text-ink-soft">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-brand" />
                {c.address}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                <Phone className="h-4 w-4 flex-none text-brand" />
                {c.phone}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="24/7 Tourism Helpline"
        text="Need assistance during your trip? Call the national tourism helpline anytime."
        buttonLabel="Call 1422"
        href="tel:1422"
        image="/hero/hunza-10.jpg"
      />
    </main>
  );
}
