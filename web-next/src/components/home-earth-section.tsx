import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EarthAtlas from "@/components/earth-atlas";
import { SALAM_GREEN } from "@/lib/earth-brand";

/**
 * Home mid-page section: interactive Earth Atlas in place of the old photo CTA.
 * EarthAtlas is a client component (MapLibre / Three); this wrapper stays a Server Component.
 */
export default function HomeEarthSection() {
  return (
    <section className="relative overflow-hidden bg-[#02080f] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${SALAM_GREEN}33, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 30%, rgba(56,189,248,0.12), transparent 50%), #02080f`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 xl:px-6 lg:py-16">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-6 sm:mb-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
              Salam Pakistan · Earth atlas
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
              Discover where to go next
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-base">
              Browse destinations across every region — from Hunza to
              Mohenjo-daro. Spin the globe, explore satellite view, or play the
              geography game.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/where-to-go"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand hover:text-white"
            >
              Where to go
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/map/earth-3d"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 backdrop-blur transition hover:border-white/35 hover:bg-white/10 hover:text-white"
            >
              Full atlas
            </Link>
          </div>
        </header>

        <EarthAtlas />
      </div>
    </section>
  );
}
