"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

export default function PublicationsHero({
  firstCategoryId,
}: {
  firstCategoryId: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[86vh] items-end overflow-hidden pb-32 text-white"
    >
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/hero/hunza-1.jpg"
          alt="Hunza Valley, Pakistan"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/50 via-ink/15 to-ink/75" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block pb-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/90 after:absolute after:bottom-1 after:left-0 after:h-[3px] after:w-12 after:rounded-full after:bg-brand after:content-['']"
        >
          Salam Pakistan Library
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-display text-6xl font-extrabold leading-none tracking-tight sm:text-7xl lg:text-8xl"
        >
          Publications
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-lg leading-relaxed text-white/90"
        >
          Explore a variety of publications from all over Pakistan — barometers,
          guides, newsletters, books and maps, free to download.
        </motion.p>

        <motion.button
          type="button"
          onClick={() => scrollToId(firstCategoryId)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="group mt-9 inline-flex items-center gap-3 rounded-full border-[1.6px] border-white/70 px-7 py-3 text-sm font-semibold transition-colors hover:border-white hover:bg-white hover:text-ink"
        >
          Start exploring
          <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
