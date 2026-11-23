import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck } from "lucide-react";

export const metadata: Metadata = { title: "My Bookings" };

const bookings = [
  { title: "PTDC Motel, Hunza", type: "Accommodation", date: "12–15 Jun 2026", status: "Confirmed", image: "/hero/hunza-1.jpg" },
  { title: "Islamabad → Skardu", type: "Flight", date: "12 Jun 2026", status: "Confirmed", image: "/hero/hunza-2.jpg" },
  { title: "Karachi → Lahore", type: "Railway", date: "02 Jul 2026", status: "Pending", image: "/hero/hunza-7.jpg" },
];

export default function MyBookingsPage() {
  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
        >
          <div className="relative h-20 w-28 flex-none overflow-hidden rounded-xl">
            <Image src={b.image} alt={b.title} fill sizes="112px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {b.type}
            </span>
            <h3 className="truncate font-display text-lg font-semibold text-ink">{b.title}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
              <CalendarCheck className="h-4 w-4" />
              {b.date}
            </p>
          </div>
          <span
            className={`flex-none rounded-full px-3 py-1 text-xs font-semibold ${
              b.status === "Confirmed"
                ? "bg-leaf/15 text-leaf"
                : "bg-brand/10 text-brand"
            }`}
          >
            {b.status}
          </span>
        </div>
      ))}
    </div>
  );
}
