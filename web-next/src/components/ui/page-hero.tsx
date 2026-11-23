"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

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
        "relative flex items-end overflow-hidden text-white",
        compact ? "min-h-[58vh] pb-20" : "min-h-[78vh] pb-28",
      ].join(" ")}
    >
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 z-0">
        <Image src={image} alt={title} fill priority className="object-cover" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/55 via-ink/20 to-ink/80" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block pb-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/90 after:absolute after:bottom-0.5 after:left-0 after:h-[3px] after:w-12 after:rounded-full after:bg-brand after:content-['']"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-white/90"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
