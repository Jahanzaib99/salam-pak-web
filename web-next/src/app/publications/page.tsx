import PublicationsHero from "@/components/publications-hero";
import CategoryFilter from "@/components/category-filter";
import CategoryRail from "@/components/category-rail";
import CtaBanner from "@/components/cta-banner";
import { categories } from "@/lib/publications";

export default function PublicationsPage() {
  const filterItems = categories.map((c) => ({
    id: c.id,
    title: c.title,
    icon: c.icon,
    count: c.items.length,
  }));

  return (
    <main className="bg-white">
      <PublicationsHero firstCategoryId={categories[0].id} />

      {/* rounded lip that slides over the hero */}
      <div className="relative z-20 -mt-14 h-14 rounded-t-[34px] bg-white" />

      <CategoryFilter items={filterItems} />

      <div className="mx-auto max-w-6xl px-6 pt-4 pb-6">
        {categories.map((category) => (
          <CategoryRail key={category.id} category={category} />
        ))}
      </div>

      <CtaBanner targetId={categories[0].id} />
    </main>
  );
}
