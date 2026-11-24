import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/page-hero";
import { Section } from "@/components/ui/primitives";
import SmartImage from "@/components/ui/smart-image";
import { fetchActivities } from "@/lib/salam-api";

export const metadata: Metadata = {
  title: "What to Do",
  description:
    "A rush of adrenaline, a relaxing retreat, a culinary awakening — no matter what you seek, it’s all here.",
};

export default async function WhatToDoPage() {
  const activities = await fetchActivities();

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="What to do"
        title="What to do"
        subtitle="A rush of adrenaline, a relaxing retreat, a culinary awakening — no matter what you seek, it’s all here."
        image="/hero/scenic/reg-swat-kandol.jpg"
      />

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <Link
              key={a.slug}
              href={`/what-to-do/activity/${a.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                <SmartImage
                  src={a.image}
                  alt={a.name}
                  fill
                  sizes="(max-width:768px) 90vw, 33vw"
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">
                {a.name}
              </h3>
              {a.description && a.description !== a.name && (
                <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-3">
                  {a.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
