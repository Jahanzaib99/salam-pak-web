"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type BookingType = "flight" | "bus" | "railway" | "accommodation" | "cab";

const fieldSets: Record<
  BookingType,
  { name: string; label: string; type: string; placeholder?: string }[]
> = {
  flight: [
    { name: "from", label: "From", type: "text", placeholder: "Islamabad (ISB)" },
    { name: "to", label: "To", type: "text", placeholder: "Skardu (KDU)" },
    { name: "depart", label: "Departure", type: "date" },
    { name: "passengers", label: "Passengers", type: "number", placeholder: "1" },
  ],
  bus: [
    { name: "from", label: "From", type: "text", placeholder: "Lahore" },
    { name: "to", label: "To", type: "text", placeholder: "Islamabad" },
    { name: "depart", label: "Travel date", type: "date" },
    { name: "passengers", label: "Seats", type: "number", placeholder: "1" },
  ],
  railway: [
    { name: "from", label: "From", type: "text", placeholder: "Karachi" },
    { name: "to", label: "To", type: "text", placeholder: "Lahore" },
    { name: "depart", label: "Travel date", type: "date" },
    { name: "class", label: "Class", type: "text", placeholder: "Business" },
  ],
  accommodation: [
    { name: "city", label: "Destination", type: "text", placeholder: "Hunza" },
    { name: "checkin", label: "Check-in", type: "date" },
    { name: "checkout", label: "Check-out", type: "date" },
    { name: "guests", label: "Guests", type: "number", placeholder: "2" },
  ],
  cab: [
    { name: "pickup", label: "Pickup", type: "text", placeholder: "Gilgit Airport" },
    { name: "drop", label: "Drop-off", type: "text", placeholder: "Karimabad" },
    { name: "date", label: "Date", type: "date" },
    { name: "passengers", label: "Passengers", type: "number", placeholder: "2" },
  ],
};

export default function BookingSearch({ type }: { type: BookingType }) {
  const [submitted, setSubmitted] = useState(false);
  const fields = fieldSets[type];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="rounded-[24px] border border-line bg-white p-5 shadow-[0_18px_50px_-24px_rgba(6,19,42,0.35)] lg:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((f) => (
          <label key={f.name} className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {f.label}
            </span>
            <input
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              min={f.type === "number" ? 1 : undefined}
              className="w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:bg-white"
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
        {submitted && (
          <p className="text-sm text-ink-soft">
            Live availability connects to the booking service — coming soon in this preview.
          </p>
        )}
      </div>
    </form>
  );
}
