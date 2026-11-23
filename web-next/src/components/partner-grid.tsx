import { ArrowUpRight } from "lucide-react";
import type { BookingPartner } from "@/lib/booking-partners";
import { DISCLAIMER } from "@/lib/booking-partners";
import { Section, SectionHeading } from "@/components/ui/primitives";
import Reveal from "@/components/reveal";

export default function PartnerGrid({
  kicker,
  title,
  description,
  partners,
}: {
  kicker?: string;
  title: string;
  description?: string;
  partners: BookingPartner[];
}) {
  return (
    <Section>
      <SectionHeading kicker={kicker} title={title} description={description} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.03}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand">
                  {p.name}
                </h3>
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-ink transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {p.description}
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-brand">
                Book now →
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-line bg-cloud px-5 py-4 text-sm leading-relaxed text-ink-soft">
        <strong className="font-semibold text-ink">Important note:</strong>{" "}
        {DISCLAIMER}
      </p>
    </Section>
  );
}
