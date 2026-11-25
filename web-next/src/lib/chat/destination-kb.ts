import knowledge from "@/data/rehbar-knowledge.json";
import { destinations as curatedDestinations } from "@/lib/destinations";
import {
  buildItinerary,
  ORIGIN_CITIES,
  type OriginCityId,
  type ItineraryPlan,
} from "@/lib/map-itinerary";
import type { MapPin } from "@/lib/map-views";

export type DestSummary = {
  slug: string;
  name: string;
  regionSlug: string;
  regionName: string;
  description: string;
  categories: string[];
  featured: boolean;
  href: string;
};

type KnowledgeFile = {
  destinationCount: number;
  destinations: DestSummary[];
  details: Record<
    string,
    {
      slug: string;
      name: string;
      regionSlug: string;
      description: string;
      longDescription: string;
      gettingThere: string;
      whatToDo: string;
      whenToVisit: string;
      whereToStay: string;
      additionalInfo: string;
    }
  >;
  activities: {
    slug: string;
    name: string;
    description: string;
    featured: boolean;
  }[];
  regions: { slug: string; name: string }[];
};

const kb = knowledge as KnowledgeFile;

export function getCatalogStats() {
  return {
    destinationCount: kb.destinationCount,
    detailCount: Object.keys(kb.details).length,
    activityCount: kb.activities.length,
    regionCount: kb.regions.length,
    curatedHubCount: curatedDestinations.length,
  };
}

export function listRegions() {
  return kb.regions;
}

export function listActivities() {
  return kb.activities;
}

export function searchDestinations(query: string, limit = 8): DestSummary[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    return kb.destinations
      .filter((d) => d.featured)
      .concat(kb.destinations)
      .filter((d, i, arr) => arr.findIndex((x) => x.slug === d.slug) === i)
      .slice(0, limit);
  }

  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = kb.destinations
    .map((d) => {
      const hay =
        `${d.name} ${d.slug} ${d.regionName} ${d.regionSlug} ${d.description} ${d.categories.join(" ")}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (d.slug === t || d.name.toLowerCase() === t) score += 12;
        if (d.name.toLowerCase().includes(t)) score += 6;
        if (d.slug.includes(t)) score += 5;
        if (d.regionName.toLowerCase().includes(t)) score += 3;
        if (d.categories.some((c) => c.includes(t))) score += 3;
        if (hay.includes(t)) score += 1;
      }
      if (d.featured) score += 1;
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.d.name.localeCompare(b.d.name));

  return scored.slice(0, limit).map((x) => x.d);
}

function resolveSlug(slugOrName: string): string | null {
  const q = slugOrName.toLowerCase().trim();
  if (!q) return null;
  const exact = kb.destinations.find(
    (d) => d.slug === q || d.name.toLowerCase() === q
  );
  if (exact) return exact.slug;
  const hit = searchDestinations(q, 1)[0];
  return hit?.slug ?? null;
}

export function getDestinationBrief(slugOrName: string) {
  const slug = resolveSlug(slugOrName);
  if (!slug) return null;

  const summary = kb.destinations.find((d) => d.slug === slug);
  const detail = kb.details[slug];
  const curated = curatedDestinations.find((d) => d.slug === slug);

  return {
    slug,
    name: detail?.name || curated?.name || summary?.name || slug,
    regionSlug:
      detail?.regionSlug || curated?.regionSlug || summary?.regionSlug || "",
    regionName: curated?.regionName || summary?.regionName || "",
    href:
      summary?.href ||
      (curated
        ? `/where-to-go/category/${curated.regionSlug}/location/${curated.slug}`
        : `/where-to-go`),
    description:
      detail?.description ||
      curated?.description ||
      summary?.description ||
      "",
    longDescription:
      detail?.longDescription || curated?.description || "",
    gettingThere:
      detail?.gettingThere ||
      (curated?.gettingThere || []).join(" ") ||
      "",
    whatToDo:
      detail?.whatToDo ||
      (curated?.whatToDo || []).join(" ") ||
      (curated?.highlights || []).join("; ") ||
      "",
    whenToVisit:
      detail?.whenToVisit ||
      (curated?.whenToVisit || []).join(" ") ||
      "",
    whereToStay:
      detail?.whereToStay ||
      (curated?.whereToStay || []).join(" ") ||
      "",
    additionalInfo:
      detail?.additionalInfo ||
      (curated?.additionalInfo || []).join(" ") ||
      "",
    categories: summary?.categories || [],
    tagline: curated?.tagline || "",
  };
}

/** Compact text block injected into the LLM / fallback replies. */
export function formatDestinationKnowledge(slugOrName: string): string {
  const d = getDestinationBrief(slugOrName);
  if (!d) return `No destination matched "${slugOrName}".`;

  const parts = [
    `# ${d.name}`,
    d.tagline ? `Tagline: ${d.tagline}` : "",
    `Region: ${d.regionName || d.regionSlug || "Pakistan"}`,
    d.categories.length ? `Themes: ${d.categories.join(", ")}` : "",
    d.description ? `Overview: ${d.description}` : "",
    d.longDescription ? `Details: ${d.longDescription}` : "",
    d.gettingThere ? `Getting there: ${d.gettingThere}` : "",
    d.whatToDo ? `What to do: ${d.whatToDo}` : "",
    d.whenToVisit ? `When to visit: ${d.whenToVisit}` : "",
    d.whereToStay ? `Where to stay: ${d.whereToStay}` : "",
    d.additionalInfo ? `Extra: ${d.additionalInfo}` : "",
    `Page: ${d.href}`,
  ].filter(Boolean);

  return parts.join("\n");
}

export function planTripFromKnowledge(opts: {
  destination: string;
  origin?: OriginCityId;
  days?: number;
}): { plan: ItineraryPlan; destination: NonNullable<ReturnType<typeof getDestinationBrief>>; origin: OriginCityId } | null {
  const dest = getDestinationBrief(opts.destination);
  if (!dest) return null;

  const origin: OriginCityId =
    opts.origin && ORIGIN_CITIES.some((c) => c.id === opts.origin)
      ? opts.origin!
      : "islamabad";

  const pin: MapPin = {
    id: dest.slug,
    n: 1,
    title: dest.name,
    description: `${dest.description} ${dest.whatToDo}`.slice(0, 280),
    slug: dest.slug,
    xPct: 50,
    yPct: 50,
    wPct: 2,
    hPct: 2,
    href: dest.href,
  };

  const plan = buildItinerary(pin, origin);

  // Soft-trim if user asked for fewer/more days — keep structure honest.
  if (opts.days && opts.days > 0 && plan.steps.length > opts.days + 1) {
    return {
      destination: dest,
      origin,
      plan: {
        ...plan,
        durationLabel: `${opts.days} days (condensed from ${plan.durationLabel})`,
        steps: plan.steps.slice(0, Math.max(opts.days, 2)),
        tips: [
          ...plan.tips,
          `You asked for about ${opts.days} days — this is a condensed cut of the fuller circuit.`,
        ],
      },
    };
  }

  return { destination: dest, origin, plan };
}

export function catalogPreview(limit = 12): DestSummary[] {
  const featured = kb.destinations.filter((d) => d.featured);
  const rest = kb.destinations.filter((d) => !d.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function knowledgeSystemDigest(): string {
  const stats = getCatalogStats();
  const top = catalogPreview(20)
    .map((d) => `- ${d.name} (${d.regionName}) [${d.slug}]`)
    .join("\n");
  const acts = kb.activities
    .map((a) => `- ${a.name}: ${a.description.slice(0, 120)}`)
    .join("\n");
  const regions = kb.regions.map((r) => r.name).join(", ");

  return [
    `Knowledge base loaded: ${stats.destinationCount} destinations, ${stats.detailCount} rich place guides, ${stats.activityCount} activity themes, ${stats.curatedHubCount} curated hubs.`,
    `Regions: ${regions}`,
    `Popular destinations:`,
    top,
    `Activity themes:`,
    acts,
  ].join("\n");
}
