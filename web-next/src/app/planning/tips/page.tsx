import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FactGrid, SplitSection, CtaBanner } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Basic Facts of Pakistan",
  description: "Geography, climate, languages, currency and essential facts.",
};

const facts = [
  { label: "Capital", value: "Islamabad" },
  { label: "Population", value: "~241 million" },
  { label: "Currency", value: "Pakistani Rupee (PKR)" },
  { label: "Languages", value: "Urdu, English + regional" },
  { label: "Time zone", value: "PKT (UTC +5)" },
  { label: "Calling code", value: "+92" },
  { label: "Highest peak", value: "K2 — 8,611 m" },
  { label: "Best season", value: "Apr–Oct (north)" },
  { label: "Electricity", value: "230V · Type C/D" },
];

export default function BasicFactsPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Basic facts"
        title="Basic Facts of Pakistan"
        subtitle="The essentials to know before you travel."
        image="/hero/hunza-5.jpg"
        compact
      />

      <Section>
        <SectionHeading kicker="At a glance" title="Country snapshot" />
        <FactGrid items={facts} />
      </Section>

      <SplitSection kicker="Geography" title="A land of extraordinary diversity" image="/hero/hunza-1.jpg">
        <p>
          Pakistan stretches from the towering peaks of the Karakoram, Himalaya
          and Hindu Kush in the north to the Arabian Sea in the south. In
          between lie fertile plains along the Indus River, vast deserts and
          dramatic plateaus.
        </p>
        <p>
          This diversity means you can ski in the morning and reach warm plains
          the same day — and experience a remarkable range of cultures,
          cuisines and landscapes in a single trip.
        </p>
      </SplitSection>

      <div className="bg-cloud">
        <SplitSection kicker="Climate" title="When to visit" image="/hero/hunza-8.jpg" reverse>
          <p>
            The northern mountains are best from April to October, when passes
            are open and valleys are green. The plains of Punjab and Sindh are
            most comfortable from November to March.
          </p>
          <p>
            Summers in the lowlands can be very hot, while the high north can be
            cold year-round at altitude — pack accordingly.
          </p>
        </SplitSection>
      </div>

      <CtaBanner
        title="Ready to plan the details?"
        text="Learn how to get to Pakistan and how to travel around once you arrive."
        buttonLabel="Getting to Pakistan"
        href="/planning/getting-here"
        image="/hero/hunza-6.jpg"
      />
    </main>
  );
}
