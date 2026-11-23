"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/reveal";
import { scrollToId } from "@/lib/scroll";

export default function CtaBanner({ targetId }: { targetId: string }) {
  return (
    <section className="relative overflow-hidden py-28 text-white">
      <Image
        src="/hero/hunza-6.jpg"
        alt="Explore Pakistan"
        fill
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover"
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-ink/80 via-ink/40 to-ink/10" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            Guides for your journey through Pakistan
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            From the peaks of the north to ancient heritage trails — download a
            guide and explore with confidence.
          </p>
          <button
            type="button"
            onClick={() => scrollToId(targetId)}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-brand hover:text-white"
          >
            Browse publications
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
