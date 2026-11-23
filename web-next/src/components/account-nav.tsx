"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  CalendarCheck,
  Heart,
  Map,
  Star,
  KeyRound,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/user/profile", label: "Profile", icon: User },
  { href: "/user/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/user/wishlist", label: "Wishlist", icon: Heart },
  { href: "/user/itinerary", label: "Itinerary", icon: Map },
  { href: "/user/reviews", label: "My Reviews", icon: Star },
  { href: "/user/change-password", label: "Change Password", icon: KeyRound },
];

export default function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="rounded-2xl border border-line bg-white p-3">
      <ul className="space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "text-ink-soft hover:bg-cloud hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            </li>
          );
        })}
        <li className="pt-1">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-cloud hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </li>
      </ul>
    </nav>
  );
}
