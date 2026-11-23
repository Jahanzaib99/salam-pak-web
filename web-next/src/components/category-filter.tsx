"use client";

import { useEffect, useState } from "react";
import { scrollToId } from "@/lib/scroll";
import { iconMap } from "@/components/icon-map";
import type { IconName } from "@/lib/publications";

export interface FilterItem {
  id: string;
  title: string;
  icon: IconName;
  count: number;
}

export default function CategoryFilter({ items }: { items: FilterItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6">
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-3.5">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToId(item.id)}
                className={[
                  "inline-flex flex-none items-center gap-2 rounded-full border-[1.4px] px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-ink bg-ink text-white"
                    : "border-line text-ink hover:border-ink",
                ].join(" ")}
              >
                <Icon
                  className={isActive ? "h-4 w-4 text-white" : "h-4 w-4 text-brand"}
                />
                <span>{item.title}</span>
                <span
                  className={
                    isActive
                      ? "text-xs font-bold text-white/80"
                      : "text-xs font-bold text-ink-soft/70"
                  }
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
