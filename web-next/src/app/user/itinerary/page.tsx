import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Itinerary" };

const items = [
  { day: "Day 1", title: "Arrive Gilgit · transfer to Hunza", note: "PTDC Motel, Karimabad" },
  { day: "Day 2", title: "Baltit & Altit Forts", note: "Guided heritage walk" },
  { day: "Day 3", title: "Attabad Lake & Passu Cones", note: "Boat ride + photo stops" },
  { day: "Day 4", title: "Khunjerab Pass", note: "China border day trip" },
];

export default function ItineraryPage() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            Hunza Valley trip
          </h2>
          <p className="text-sm text-ink-soft">4 days · June 2026</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Add stop
        </button>
      </div>

      <ol className="relative mt-6 space-y-5 border-l-2 border-line pl-8">
        {items.map((it) => (
          <li key={it.day} className="relative">
            <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {it.day}
            </span>
            <h3 className="mt-0.5 font-display text-base font-semibold text-ink">
              {it.title}
            </h3>
            <p className="text-sm text-ink-soft">{it.note}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 border-t border-line pt-6">
        <Link
          href="/bookings"
          className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Book this itinerary
        </Link>
      </div>
    </div>
  );
}
