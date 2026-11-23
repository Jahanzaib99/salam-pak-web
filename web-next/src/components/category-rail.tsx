"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";

import PublicationCard from "@/components/publication-card";
import Reveal from "@/components/reveal";
import { iconMap } from "@/components/icon-map";
import type { PublicationCategory } from "@/lib/publications";

export default function CategoryRail({
  category,
}: {
  category: PublicationCategory;
}) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const Icon = iconMap[category.icon];
  const showNav = category.items.length > 1;

  return (
    <section
      id={category.id}
      className="scroll-mt-24 border-b border-line py-10 last:border-b-0 lg:py-14"
    >
      <Reveal>
        <header className="mb-7 flex items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-brand">
              <Icon className="h-4 w-4" />
              {category.items.length}{" "}
              {category.items.length === 1 ? "publication" : "publications"}
            </span>
            <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
              {category.title}
            </h2>
            <p className="mt-1.5 text-base text-ink-soft">{category.tagline}</p>
          </div>

          {showNav && (
            <div className="hidden flex-none gap-2.5 pb-1.5 md:flex">
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
          )}
        </header>
      </Reveal>

      <Reveal delay={0.05}>
        <Swiper
          modules={[FreeMode]}
          onSwiper={(s) => (swiperRef.current = s)}
          freeMode
          spaceBetween={26}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1280: { slidesPerView: 4 },
          }}
        >
          {category.items.map((item) => (
            <SwiperSlide key={item.title}>
              <PublicationCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Reveal>
    </section>
  );
}
