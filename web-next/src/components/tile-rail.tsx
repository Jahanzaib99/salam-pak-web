"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";

import { TileCard } from "@/components/ui/primitives";
import Reveal from "@/components/reveal";
import type { Tile } from "@/lib/content";

export default function TileRail({
  kicker,
  title,
  description,
  items,
  tall = false,
}: {
  kicker?: string;
  title: string;
  description?: string;
  items: Tile[];
  tall?: boolean;
}) {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
      <Reveal>
        <header className="mb-8 flex items-end justify-between gap-5">
          <div className="max-w-2xl">
            {kicker && (
              <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
                {kicker}
              </span>
            )}
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="mt-2.5 text-base text-ink-soft">{description}</p>
            )}
          </div>
          <div className="hidden flex-none gap-2.5 md:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.4px] border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.4px] border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </header>
      </Reveal>

      <Reveal delay={0.05}>
        <Swiper
          modules={[FreeMode]}
          onSwiper={(s) => (swiperRef.current = s)}
          freeMode
          // No Mousewheel — trackpads send vertical+horizontal together and
          // Swiper was trapping page scroll after Popular destinations.
          spaceBetween={22}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: tall ? 3.3 : 2.6 },
            1280: { slidesPerView: tall ? 4 : 3 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.title}>
              <TileCard {...item} tall={tall} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Reveal>
    </section>
  );
}
