"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const HERO_SHOTS = [
  { src: "/hero/cinematic/01-attabad.jpg", alt: "Attabad Lake, Hunza" },
  { src: "/hero/cinematic/02-peaks.jpg", alt: "Karakoram peaks and alpine meadows" },
  { src: "/hero/cinematic/03-badshahi.jpg", alt: "Badshahi Mosque, Lahore at blue hour" },
  { src: "/hero/cinematic/04-coast.jpg", alt: "Makran coast, Arabian Sea" },
  { src: "/hero/cinematic/05-valley-lake.jpg", alt: "Alpine valley lake in northern Pakistan" },
] as const;

const SLIDE_MS = 5200;

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SHOTS.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden text-center text-white"
    >
      <div className="absolute inset-0 z-0 bg-ink">
        {HERO_SHOTS.map((shot, i) => {
          const active = i === index;
          return (
            <motion.div
              key={shot.src}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                scale: active && !reduceMotion ? 1.12 : 1.04,
                zIndex: active ? 2 : 1,
              }}
              transition={{
                opacity: { duration: 1.4, ease },
                scale: { duration: active ? SLIDE_MS / 1000 : 1.4, ease: "linear" },
              }}
            >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  priority={i === 0}
                  quality={92}
                  className="object-cover"
                  sizes="100vw"
                />
            </motion.div>
          );
        })}

        {!reduceMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-tr from-brand/20 via-transparent to-amber-100/10"
            animate={{ opacity: [0.4, 0.65, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="absolute inset-0 z-[4] bg-gradient-to-b from-ink/55 via-ink/30 to-ink/75" />

      <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_SHOTS.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            aria-label={`Show image ${i + 1}`}
            aria-current={i === index ? true : undefined}
            onClick={() => setIndex(i)}
            className={[
              "h-1.5 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70",
            ].join(" ")}
          />
        ))}
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-5xl px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease }}
          className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl"
        >
          Salam Pakistan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease }}
          className="mt-5 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
        >
          One Journey. Endless Discoveries.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22, ease }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl"
        >
          Adventure, heritage, culture and nature across every province and
          territory — each with its own story to tell.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.32, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/where-to-go"
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-[0_0_28px_6px_rgba(15,122,107,0.35)]"
          >
            Discover Pakistan
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/explore-pakistan"
            className="inline-flex items-center gap-2.5 rounded-full border-[1.6px] border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
          >
            Explore regions
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-white/80" aria-hidden />
      </motion.div>
    </section>
  );
}
