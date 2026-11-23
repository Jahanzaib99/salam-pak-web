import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Section, SectionHeading, FeatureCard } from "@/components/ui/primitives";
import { FileCheck2, Mountain, HeartPulse, Landmark, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Apply E-Visa",
  description: "Check eligibility and apply for a Pakistan tourist visa online.",
};

const visaTypes = [
  { icon: FileCheck2, title: "Tourist Visa on Arrival", href: "https://visa.nadra.gov.pk/visa-on-arrival-tourist/", text: "For eligible nationalities arriving at major airports." },
  { icon: FileCheck2, title: "General Tourist Visa", href: "https://visa.nadra.gov.pk/tourist-visa/", text: "Standard online tourist visa for most travellers." },
  { icon: Mountain, title: "Mountaineering & Trekking", href: "https://visa.nadra.gov.pk/mountaineering-trekking/", text: "For expeditions and high-altitude trekking groups." },
  { icon: Landmark, title: "Religious Tourism", href: "https://visa.nadra.gov.pk/religious-tourism/", text: "For pilgrims visiting religious and heritage sites." },
  { icon: HeartPulse, title: "Medical Tourism", href: "https://visa.nadra.gov.pk/medical-visa/", text: "For visitors seeking medical treatment in Pakistan." },
];

export default function VisaPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="E-Visa"
        title="Apply for your visa online"
        subtitle="Pakistan's online visa system makes it easy to apply before you travel."
        image="/hero/hunza-2.jpg"
        compact
      />

      <Section>
        <SectionHeading
          kicker="Visa categories"
          title="Choose the right visa"
          description="Applications are processed through the official NADRA online visa portal."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visaTypes.map((v) => (
            <a key={v.title} href={v.href} target="_blank" rel="noopener noreferrer" className="group block">
              <FeatureCard icon={v.icon} title={v.title}>
                {v.text}
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Apply on NADRA portal
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </FeatureCard>
            </a>
          ))}
        </div>
      </Section>
    </main>
  );
}
