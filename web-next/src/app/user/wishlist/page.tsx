import type { Metadata } from "next";
import { TileCard } from "@/components/ui/primitives";
import { regionTiles } from "@/lib/content";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  const saved = regionTiles.slice(0, 4);
  return (
    <div>
      <p className="mb-5 text-sm text-ink-soft">
        {saved.length} saved destinations
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {saved.map((t) => (
          <TileCard key={t.title} {...t} />
        ))}
      </div>
    </div>
  );
}
