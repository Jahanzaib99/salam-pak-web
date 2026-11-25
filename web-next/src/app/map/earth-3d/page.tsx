import type { Metadata } from "next";
import EarthAtlas from "@/components/earth-atlas";
import { earthPinStats } from "@/lib/earth-destinations";
import { SALAM_GREEN } from "@/lib/earth-brand";

export const metadata: Metadata = {
  title: "Earth Atlas (Preview)",
  description:
    "Satellite world map and 3D globe with Pakistan outlined in Salam green, destination pins, and a Where-on-the-map game.",
};

export default function Earth3dMapPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02080f] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${SALAM_GREEN}33, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 30%, rgba(56,189,248,0.12), transparent 50%), #02080f`,
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-5 pb-5 pt-28 xl:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
            Experimental · Earth atlas
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            World map, Pakistan focus
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">
            Satellite tiles for clarity, cinematic 3D globe, and a geography
            game. Pakistan border uses Salam brand green{" "}
            <span className="font-semibold text-emerald-300">{SALAM_GREEN}</span>
            .{" "}
            <span className="font-semibold text-white">
              {earthPinStats.count} destinations
            </span>{" "}
            pinned — hover for names.
          </p>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 xl:px-6">
        <EarthAtlas />
      </section>
    </main>
  );
}
