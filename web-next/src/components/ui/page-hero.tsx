"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SmartImage from "@/components/ui/smart-image";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  compact?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={ref}
      className={[
        // Keep copy in the lower band and clear the fixed site header.
        "relative flex flex-col justify-end overflow-hidden text-white",
        "pt-28 sm:pt-32",
        compact ? "min-h-[58vh] pb-16 sm:pb-20" : "min-h-[72vh] pb-20 sm:pb-24 lg:min-h-[78vh]",
      ].join(" ")}
    >
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 z-0"
      >
        <SmartImage
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/70 via-ink/35 to-ink/85" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/3 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block pb-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] after:absolute after:bottom-0.5 after:left-0 after:h-[3px] after:w-12 after:rounded-full after:bg-brand after:content-['']"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-xl text-base leading-relaxed text-white/92 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] sm:mt-5 sm:text-lg line-clamp-3"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
