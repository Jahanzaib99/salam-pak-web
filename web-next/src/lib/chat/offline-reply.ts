import {
  catalogPreview,
  formatDestinationKnowledge,
  getCatalogStats,
  planTripFromKnowledge,
  searchDestinations,
} from "./destination-kb";
import { FAQS, searchFaqs } from "./faq-kb";
import { ORIGIN_CITIES, type OriginCityId } from "@/lib/map-itinerary";

function detectOrigin(text: string): OriginCityId {
  const t = text.toLowerCase();
  if (/from\s+lahore|lahore\s*→|starting\s+(in\s+)?lahore/.test(t)) return "lahore";
  if (/from\s+karachi|karachi\s*→|starting\s+(in\s+)?karachi/.test(t))
    return "karachi";
  return "islamabad";
}

const KNOWN_DEST_RE =
  /\b(fairy\s+meadows|deosai|naran|kaghan|hunza|skardu|swat|kalam|malam\s+jabba|lahore|karachi|islamabad|gwadar|multan|peshawar|taxila|murree|nathia\s+gali|muzaffarabad|quetta|chitral|gilgit|passu|attabad|khunjerab)\b/i;

/** Prefer explicit place names over accidental captures like "a" before "5-day". */
function extractTripDestination(raw: string): string | null {
  const origin = detectOrigin(raw);

  // "5-day Hunza trip" / "7 days in Skardu"
  const dayPlace = raw.match(
    /(\d+)\s*-?\s*days?\s+(?:in\s+|to\s+)?([A-Za-z][A-Za-z\s'-]{2,40}?)(?:\s+trip|\s+from|\s+for|[.!?,]|$)/i
  );
  if (dayPlace?.[2]) {
    const candidate = dayPlace[2].replace(/\s+trip$/i, "").trim();
    if (candidate && !/^(a|an|the|my|our)$/i.test(candidate)) return candidate;
  }

  const patterned = raw.match(
    /(?:trip\s+to|visit(?:ing)?|days?\s+in|itinerary\s+(?:for|to)|honeymoon\s+(?:in|to))\s+([A-Za-z][A-Za-z\s'-]{2,40}?)(?:\s+from|\s+for|\s+trip|\s+\d|[.!?,]|$)/i
  );
  if (patterned?.[1]) {
    const candidate = patterned[1].replace(/\s+trip$/i, "").trim();
    if (candidate && !/^(a|an|the|my|our)$/i.test(candidate)) return candidate;
  }

  // Known place names, skipping the origin city when phrased as "from X"
  const allKnown = [
    ...raw.matchAll(new RegExp(KNOWN_DEST_RE.source, "gi")),
  ].map((m) => m[1].trim());
  for (const name of allKnown) {
    const key = name.toLowerCase().replace(/\s+/g, "");
    if (key === origin) continue;
    return name;
  }

  // Catalogue search on remaining words
  const cleaned = raw
    .replace(
      /\b(plan|a|an|the|day|days|trip|from|lahore|karachi|islamabad|itinerary|visit|to|for|honeymoon)\b/gi,
      " "
    )
    .replace(/\d+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length >= 3) {
    const hit = searchDestinations(cleaned, 1)[0];
    if (hit) return hit.slug;
  }
  return null;
}

function detectDays(text: string): number | undefined {
  const m = text.match(/(\d+)\s*-?\s*days?/i);
  return m ? Number(m[1]) : undefined;
}

function formatPlan(text: string, destinationHint: string) {
  const result = planTripFromKnowledge({
    destination: destinationHint,
    origin: detectOrigin(text),
    days: detectDays(text),
  });
  if (!result) {
    const suggestions = searchDestinations(destinationHint, 5)
      .map((d) => `• **${d.name}** (${d.regionName})`)
      .join("\n");
    return `I couldn't match that destination yet. Try one of these:\n${suggestions || "• Hunza, Skardu, Swat, Lahore, Karachi"}`;
  }

  const { plan, destination, origin } = result;
  const originName =
    ORIGIN_CITIES.find((c) => c.id === origin)?.name || origin;
  const steps = plan.steps
    .map((s) => {
      const acts = (s.activities || []).map((a) => `  - ${a}`).join("\n");
      return `**${s.day} — ${s.title}**\n${s.note}${acts ? `\n${acts}` : ""}${s.overnight ? `\nOvernight: ${s.overnight}` : ""}`;
    })
    .join("\n\n");

  const transport = plan.transportOptions
    .map((t) => `• ${t.label} (${t.duration}) — ${t.note}`)
    .join("\n");

  return [
    `Here's a **${plan.durationLabel}** plan to **${destination.name}** from **${originName}**.`,
    plan.summary,
    `Best season: ${plan.bestSeason}`,
    "",
    "**How to get there**",
    transport,
    "",
    steps,
    "",
    "**Tips**",
    plan.tips.map((t) => `• ${t}`).join("\n"),
    "",
    `More on the map: /map/3d-map · Destination page: ${destination.href}`,
  ].join("\n");
}

/** Rule-based Rehbar when no AI Gateway key is configured. */
export function offlineRehbarReply(userText: string): string {
  const raw = userText.trim();
  const m = raw.toLowerCase();
  const stats = getCatalogStats();

  if (/^(hi|hello|salam|assalam|hey)\b/.test(m)) {
    return `Assalamu-alaikum! I'm **Rehbar**, your Salam Pakistan trip companion.\n\nI know **${stats.destinationCount} destinations** across Pakistan, plus traveller FAQs.\n\nTry:\n• Plan a 7-day Hunza trip from Islamabad\n• Is Pakistan safe for tourists?\n• Tell me about Skardu\n• Show FAQs`;
  }

  if (/faq|frequent|common question/.test(m) && !/visa|safe|currency/.test(m)) {
    return [
      "Here are common traveller questions — ask any of them:",
      ...FAQS.map((f) => `• ${f.q}`),
    ].join("\n");
  }

  if (
    /itinerary|plan\b|days?\s+in|trip\s+to|honeymoon|from\s+(lahore|karachi|islamabad)/.test(
      m
    )
  ) {
    const dest = extractTripDestination(raw) || "Hunza";
    return formatPlan(raw, dest);
  }

  if (/visa|e-visa|passport/.test(m)) {
    return searchFaqs("visa", 1)[0]
      ? `**${searchFaqs("visa", 1)[0].q}**\n\n${searchFaqs("visa", 1)[0].a}\n\nSee also /planning/visa`
      : "";
  }

  if (/emergency|helpline|1422|police|rescue/.test(m)) {
    return searchFaqs("emergency", 1)
      .map((f) => `**${f.q}**\n\n${f.a}`)
      .join("\n");
  }

  if (/safe|safety|security/.test(m)) {
    const f = searchFaqs("safety", 1)[0];
    return f ? `**${f.q}**\n\n${f.a}` : "";
  }

  if (/currency|atm|pkr|exchange|money/.test(m)) {
    const f = searchFaqs("currency", 1)[0];
    return f ? `**${f.q}**\n\n${f.a}` : "";
  }

  if (/best time|when to visit|season|weather|pack|sim|dress|etiquette|insurance|alcohol|permit|language/.test(m)) {
    const hits = searchFaqs(raw, 2);
    if (hits.length) {
      return hits.map((f) => `**${f.q}**\n\n${f.a}`).join("\n\n---\n\n");
    }
  }

  if (/destinations|where to go|catalogue|catalog|list places/.test(m)) {
    const popular = catalogPreview(12)
      .map((d) => `• **${d.name}** — ${d.regionName}`)
      .join("\n");
    return `I have **${stats.destinationCount}** places loaded. Popular picks:\n${popular}\n\nAsk about any place by name, or open /where-to-go.`;
  }

  // Destination lookup
  const placeQuery = raw.replace(
    /^(tell me about|about|info on|what about)\s+/i,
    ""
  );
  const placeHits = searchDestinations(placeQuery, 3);
  const wantsPlaceDetail =
    /tell me about|what to do in|about\s+\w+/.test(m) ||
    (placeHits.length > 0 &&
      placeHits[0].name
        .split(/\s+/)
        .some((w) => w.length > 2 && m.includes(w.toLowerCase())));

  if (wantsPlaceDetail && placeHits[0]) {
    const top = placeHits[0];
    return `${formatDestinationKnowledge(top.slug)}\n\nWant an itinerary? Ask e.g. “Plan 5 days in ${top.name} from Lahore”.`;
  }

  const faqHits = searchFaqs(raw, 2);
  if (faqHits.length && faqHits[0]) {
    return faqHits.map((f) => `**${f.q}**\n\n${f.a}`).join("\n\n---\n\n");
  }

  if (placeHits.length) {
    return `I found these places:\n${placeHits.map((d) => `• **${d.name}** (${d.regionName}) — ${d.description.slice(0, 100)}`).join("\n")}\n\nAsk for details or a day-by-day plan.`;
  }

  return `I can help with **itineraries** and **FAQs** across **${stats.destinationCount} destinations**.\n\nExamples:\n• Plan a 7-day Hunza trip from Islamabad\n• Do I need a visa?\n• Tell me about Fairy Meadows\n• Show FAQs`;
}
