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

type PlaceDetailKb = {
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
  gettingThereBullets?: string[];
  whatToDoBullets?: string[];
  whenToVisitBullets?: string[];
  whereToStayBullets?: string[];
};

type KnowledgeFile = {
  destinationCount: number;
  destinations: DestSummary[];
  details: Record<string, PlaceDetailKb>;
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

  const gettingThereBullets =
    detail?.gettingThereBullets?.length
      ? detail.gettingThereBullets
      : curated?.gettingThere || [];
  const whatToDoBullets =
    detail?.whatToDoBullets?.length
      ? detail.whatToDoBullets
      : curated?.whatToDo || curated?.highlights || [];
  const whenToVisitBullets =
    detail?.whenToVisitBullets?.length
      ? detail.whenToVisitBullets
      : curated?.whenToVisit || [];
  const whereToStayBullets =
    detail?.whereToStayBullets?.length
      ? detail.whereToStayBullets
      : curated?.whereToStay || [];

  return {
    slug,
    name: (detail?.name || curated?.name || summary?.name || slug).trim(),
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
      gettingThereBullets.join(" ") ||
      "",
    whatToDo:
      detail?.whatToDo ||
      whatToDoBullets.join(" ") ||
      "",
    whenToVisit:
      detail?.whenToVisit ||
      whenToVisitBullets.join(" ") ||
      "",
    whereToStay:
      detail?.whereToStay ||
      whereToStayBullets.join(" ") ||
      "",
    additionalInfo:
      detail?.additionalInfo ||
      (curated?.additionalInfo || []).join(" ") ||
      "",
    gettingThereBullets,
    whatToDoBullets,
    whenToVisitBullets,
    whereToStayBullets,
    categories: summary?.categories || [],
    tagline: curated?.tagline || "",
  };
}

/** Compact text block injected into the LLM / fallback replies. */
export function formatDestinationKnowledge(slugOrName: string): string {
  const d = getDestinationBrief(slugOrName);
  if (!d) return `No destination matched "${slugOrName}".`;

  const bulletBlock = (label: string, bullets: string[], prose: string) => {
    if (bullets.length) {
      return `**${label}**\n${bullets.map((b) => `• ${b}`).join("\n")}`;
    }
    if (prose) return `**${label}**\n${prose}`;
    return "";
  };

  const parts = [
    `**${d.name}**`,
    d.tagline ? `*${d.tagline}*` : "",
    `Region: ${d.regionName || d.regionSlug || "Pakistan"}`,
    d.categories.length ? `Themes: ${d.categories.join(", ")}` : "",
    d.description ? `Overview: ${d.description}` : "",
    d.longDescription && d.longDescription !== d.description
      ? `Details: ${d.longDescription.slice(0, 600)}`
      : "",
    bulletBlock("Getting there", d.gettingThereBullets, d.gettingThere),
    bulletBlock("What to do", d.whatToDoBullets, d.whatToDo),
    bulletBlock("When to visit", d.whenToVisitBullets, d.whenToVisit),
    bulletBlock("Where to stay", d.whereToStayBullets, d.whereToStay),
    d.additionalInfo ? `**Extra tips**\n${d.additionalInfo}` : "",
    `Page: ${d.href}`,
  ].filter(Boolean);

  return parts.join("\n\n");
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

  let plan = enrichPlanWithDestination(buildItinerary(pin, origin), dest, origin);

  // Soft-trim if user asked for fewer/more days — keep structure honest.
  if (opts.days && opts.days > 0 && plan.steps.length > opts.days + 1) {
    plan = {
      ...plan,
      durationLabel: `${opts.days} days (condensed from ${plan.durationLabel})`,
      steps: plan.steps.slice(0, Math.max(opts.days, 2)),
      tips: [
        ...plan.tips,
        `You asked for about ${opts.days} days — this is a condensed cut of the fuller circuit.`,
      ],
    };
  }

  return { destination: dest, origin, plan };
}

type DestBrief = NonNullable<ReturnType<typeof getDestinationBrief>>;

/** Merge live/catalog travel fields into the structural route plan. */
function enrichPlanWithDestination(
  plan: ItineraryPlan,
  dest: DestBrief,
  origin: OriginCityId
): ItineraryPlan {
  const travel = dest.gettingThereBullets.length
    ? dest.gettingThereBullets
    : dest.gettingThere
      ? [dest.gettingThere.slice(0, 220)]
      : [];
  const activities = dest.whatToDoBullets.length
    ? dest.whatToDoBullets
    : dest.whatToDo
      ? dest.whatToDo
          .split(/[.•\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 16)
          .slice(0, 8)
      : [];
  const seasons = dest.whenToVisitBullets.length
    ? dest.whenToVisitBullets
    : dest.whenToVisit
      ? [dest.whenToVisit.slice(0, 180)]
      : [];
  const stays = dest.whereToStayBullets.length
    ? dest.whereToStayBullets
    : dest.whereToStay
      ? [dest.whereToStay.slice(0, 160)]
      : [];
  const extras = dest.additionalInfo
    ? dest.additionalInfo
        .split(/[.•\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20)
        .slice(0, 4)
    : [];

  const transportOptions = [...plan.transportOptions];
  if (travel.length) {
    transportOptions.unshift({
      mode: "road",
      label: `How to reach ${dest.name}`,
      duration: "See official guide",
      note: travel.slice(0, 3).join(" · "),
    });
  }

  let activityCursor = 0;
  const steps = plan.steps.map((step) => {
    const next = { ...step, activities: [...(step.activities || [])] };
    const isExplore =
      step.mode === "explore" ||
      /explore|discover|welcome|sight|in\s+/i.test(`${step.title} ${step.note}`) ||
      step.title.toLowerCase().includes(dest.name.toLowerCase());

    if (isExplore && activities.length) {
      const chunk = activities.slice(activityCursor, activityCursor + 3);
      activityCursor += 3;
      if (chunk.length) {
        const merged = [...chunk, ...next.activities];
        next.activities = merged.filter(
          (a, i, arr) =>
            arr.findIndex((x) => x.toLowerCase() === a.toLowerCase()) === i
        );
      }
      if (!next.note || next.note.length < 40) {
        next.note =
          dest.description.slice(0, 220) ||
          `Explore ${dest.name} using local guides and the official place page.`;
      }
    }

    if (
      !next.overnight &&
      stays[0] &&
      (isExplore || /arrive|check/i.test(step.title))
    ) {
      next.overnight = stays[0].slice(0, 80);
    }

    // Attach official travel note to the first outbound travel day
    if (
      (step.mode === "flight" || step.mode === "road" || step.mode === "bus") &&
      travel[0] &&
      /depart|→|to\s+|from\s+/i.test(step.title) &&
      !/return/i.test(step.title)
    ) {
      next.note = `${step.note}\nOfficial access: ${travel[0]}`.trim();
    }

    return next;
  });

  // If the structural plan never absorbed activities, append an explore day.
  if (activities.length && activityCursor === 0) {
    const insertAt = Math.max(1, steps.length - 1);
    steps.splice(insertAt, 0, {
      day: `Day ${insertAt + 1}`,
      title: `Explore ${dest.name}`,
      note:
        dest.description.slice(0, 220) ||
        `Focus on the highlights of ${dest.name}.`,
      mode: "explore",
      activities: activities.slice(0, 5),
      overnight: stays[0]?.slice(0, 80) || `Near ${dest.name}`,
    });
  }

  const tips = [
    ...plan.tips,
    ...extras,
    stays[1] ? `Stay tip: ${stays[1]}` : "",
    `Full guide: ${dest.href}`,
    `Helpline 1422 · Depart from ${ORIGIN_CITIES.find((c) => c.id === origin)?.name || origin}`,
  ].filter(Boolean);

  return {
    ...plan,
    summary:
      dest.description ||
      plan.summary ||
      `Suggested route from ${origin} to ${dest.name}.`,
    bestSeason: seasons[0] || plan.bestSeason,
    transportOptions,
    steps,
    tips: tips.filter(
      (t, i, arr) => arr.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i
    ),
  };
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
