import { tool } from "ai";
import { z } from "zod";
import {
  catalogPreview,
  formatDestinationKnowledge,
  getCatalogStats,
  listActivities,
  listRegions,
  planTripFromKnowledge,
  searchDestinations,
} from "./destination-kb";
import { listFaqQuestions, searchFaqs } from "./faq-kb";

export const rehbarTools = {
  searchDestinations: tool({
    description:
      "Search the Salam Pakistan destination catalogue (all provinces / 360+ places). Use before answering place questions.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("Place, region, or theme e.g. Hunza, Swat, beaches, Sikh heritage"),
      limit: z.number().min(1).max(15).optional(),
    }),
    execute: async ({ query, limit }) => {
      const hits = searchDestinations(query, limit ?? 8);
      return {
        count: hits.length,
        results: hits.map((d) => ({
          name: d.name,
          slug: d.slug,
          region: d.regionName,
          description: d.description.slice(0, 180),
          categories: d.categories,
          href: d.href,
        })),
      };
    },
  }),

  getDestinationInfo: tool({
    description:
      "Load detailed knowledge for one destination (getting there, what to do, when to visit, stay tips).",
    inputSchema: z.object({
      destination: z
        .string()
        .describe("Destination name or slug, e.g. hunza or Lahore"),
    }),
    execute: async ({ destination }) => {
      return {
        knowledge: formatDestinationKnowledge(destination),
      };
    },
  }),

  searchFaqs: tool({
    description:
      "Search traveller FAQs (visa, safety, currency, packing, SIMs, permits, emergencies, etiquette).",
    inputSchema: z.object({
      query: z.string().describe("FAQ topic or question keywords"),
      limit: z.number().min(1).max(8).optional(),
    }),
    execute: async ({ query, limit }) => {
      return {
        faqs: searchFaqs(query, limit ?? 4).map((f) => ({
          question: f.q,
          answer: f.a,
          id: f.id,
        })),
        allTopics: listFaqQuestions(),
      };
    },
  }),

  planItinerary: tool({
    description:
      "Build a day-by-day itinerary from Lahore, Karachi, or Islamabad to a Pakistan destination using official planner routes.",
    inputSchema: z.object({
      destination: z.string().describe("Destination name or slug"),
      origin: z
        .enum(["lahore", "karachi", "islamabad"])
        .optional()
        .describe("Departure city; default islamabad"),
      days: z
        .number()
        .min(2)
        .max(14)
        .optional()
        .describe("Preferred trip length in days"),
    }),
    execute: async ({ destination, origin, days }) => {
      const result = planTripFromKnowledge({ destination, origin, days });
      if (!result) {
        return {
          error: `Could not match destination "${destination}". Try searchDestinations first.`,
        };
      }
      const { plan, destination: dest, origin: from } = result;
      return {
        destination: {
          name: dest.name,
          slug: dest.slug,
          href: dest.href,
          region: dest.regionName,
        },
        origin: from,
        summary: plan.summary,
        durationLabel: plan.durationLabel,
        bestSeason: plan.bestSeason,
        transportOptions: plan.transportOptions,
        steps: plan.steps,
        tips: plan.tips,
        mapLink: "/map/3d-map",
      };
    },
  }),

  listCatalogue: tool({
    description:
      "Summarise how many destinations are loaded and list popular places / regions / activities.",
    inputSchema: z.object({}),
    execute: async () => ({
      stats: getCatalogStats(),
      regions: listRegions(),
      activities: listActivities(),
      popular: catalogPreview(15),
    }),
  }),
};
