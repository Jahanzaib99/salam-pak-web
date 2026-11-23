import type { Metadata } from "next";
import { Star } from "lucide-react";

export const metadata: Metadata = { title: "My Reviews" };

const reviews = [
  {
    place: "Shangrila Resort, Skardu",
    rating: 5,
    date: "May 2026",
    text: "Breathtaking location by the lake and wonderful staff. Would return in a heartbeat.",
  },
  {
    place: "Eagle's Nest, Hunza",
    rating: 4,
    date: "Apr 2026",
    text: "Unreal sunrise views over Rakaposhi. The road up is rough but worth it.",
  },
  {
    place: "Lahore Fort",
    rating: 5,
    date: "Mar 2026",
    text: "An incredible dive into Mughal history. Go early to beat the crowds.",
  },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.place} className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">{r.place}</h3>
              <p className="text-xs text-ink-soft">{r.date}</p>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < r.rating ? "fill-brand text-brand" : "text-line"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.text}</p>
        </div>
      ))}
    </div>
  );
}
