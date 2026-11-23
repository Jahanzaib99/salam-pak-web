import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore destinations across Pakistan.",
};

/** Legacy /trip route — redirect to Where to Go (information site). */
export default function TripRedirectPage() {
  redirect("/where-to-go");
}
