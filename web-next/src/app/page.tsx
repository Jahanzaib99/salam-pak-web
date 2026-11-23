import HomeHero from "@/components/home-hero";
import TileRail from "@/components/tile-rail";
import { Section, SectionHeading, FeatureCard, CtaBanner, PrimaryButton } from "@/components/ui/primitives";
import { MountainSnow, Landmark, Compass, FileCheck2 } from "lucide-react";
import { regionTiles, experienceTiles, eventTiles, destinationTiles } from "@/lib/content";
import { interestCategories } from "@/lib/destinations";
import { TileCard } from "@/components/ui/primitives";

export default function Home() {
  const interestTiles = interestCategories
    .filter((c) =>
      ["top-tourist-destinations", "mountains-and-glaciers", "valleys-and-lakes", "unesco-world-heritage-sites", "heritage-and-archaeology-sites", "beaches-and-islands"].includes(
        c.slug
      )
    )
    .map((c) => ({
      title: c.name,
      subtitle: "Where to go",
      image: c.image,
      href: `/where-to-go/category/${c.slug}`,
    }));

  return (
    <main className="bg-white">
      <HomeHero />

      <Section className="text-center">
        <SectionHeadingCentered />
      </Section>

      <TileRail
        kicker="Where to go"
        title="Regions of Pakistan"
        description="Seven regions, each with its own landscapes, cultures and stories."
        items={regionTiles}
        tall
      />

      <TileRail
        kicker="Must-see"
        title="Popular destinations"
        description="Iconic valleys, cities and heritage sites."
        items={destinationTiles.slice(0, 8)}
      />

      <div className="bg-cloud">
        <Section>
          <SectionHeading
            kicker="As per your interest"
            title="Explore by interest"
            description="Mountains, heritage, beaches, valleys and more."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interestTiles.map((t) => (
              <TileCard key={t.title} {...t} />
            ))}
          </div>
        </Section>
      </div>

      <TileRail
        kicker="What to do"
        title="Unforgettable experiences"
        description="From high-altitude treks to ancient heritage trails and vibrant bazaars."
        items={experienceTiles}
      />

      <Section>
        <SectionHeading
          kicker="Before you travel"
          title="Practical information"
          description="Everything you need to know to explore Pakistan with confidence."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={FileCheck2} title="Apply E-Visa">
            Check eligibility and apply online for a tourist visa.
          </FeatureCard>
          <FeatureCard icon={Compass} title="Getting around">
            How to travel by air, rail, bus and cab across the country.
          </FeatureCard>
          <FeatureCard icon={MountainSnow} title="Best time to visit">
            Seasons and weather for mountains, plains and coast.
          </FeatureCard>
          <FeatureCard icon={Landmark} title="Culture & etiquette">
            Local customs and tips for respectful, responsible travel.
          </FeatureCard>
        </div>
        <div className="mt-10">
          <PrimaryButton href="/explore-pakistan">Explore Pakistan</PrimaryButton>
        </div>
      </Section>

      <CtaBanner
        title="Discover where to go next"
        text="Browse destinations across every region — from Hunza to Mohenjo-daro."
        buttonLabel="Where to go"
        href="/where-to-go"
        image="/hero/hunza-6.jpg"
      />

      <div className="bg-cloud">
        <TileRail
          kicker="What's on"
          title="Festivals & events"
          description="Experience Pakistan's vibrant cultural calendar."
          items={eventTiles}
        />
      </div>
    </main>
  );
}

function SectionHeadingCentered() {
  return (
    <div className="mx-auto max-w-3xl">
      <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
        Salam Pakistan
      </span>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink lg:text-[2.6rem] lg:leading-tight">
        A land of towering peaks, ancient civilisations and timeless hospitality
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        Home to five of the world&apos;s fourteen highest mountains, UNESCO World
        Heritage sites and some of the friendliest people on earth — Pakistan is
        one of the most rewarding destinations you can discover.
      </p>
    </div>
  );
}
