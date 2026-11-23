"use client";

import { useState } from "react";

const tabs = [
  { id: "welcome", label: "Welcome" },
  { id: "gettingThere", label: "Getting There" },
  { id: "whatToDo", label: "What to Do" },
  { id: "whenToVisit", label: "When to Visit" },
  { id: "whereToStay", label: "Where to Stay" },
  { id: "additionalInfo", label: "Additional Information" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function DestinationTabs({
  content,
}: {
  content: Record<TabId, string[]>;
}) {
  const [active, setActive] = useState<TabId>("welcome");
  const paragraphs = content[active] ?? [];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={[
                "flex-none rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                on
                  ? "bg-brand text-white"
                  : "border border-line bg-white text-ink-soft hover:border-ink hover:text-ink",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4 text-base leading-relaxed text-ink-soft">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
    </div>
  );
}
