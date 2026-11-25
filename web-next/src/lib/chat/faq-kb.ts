export type FaqEntry = {
  id: string;
  q: string;
  a: string;
  tags: string[];
};

/** Official traveller FAQ knowledge for Rehbar. */
export const FAQS: FaqEntry[] = [
  {
    id: "visa",
    q: "Do I need a visa to visit Pakistan?",
    a: "Most nationalities need a visa. Pakistan offers an online e-Visa usually approved in 7–10 days. Tourist e-Visa: typically 30 days. Business e-Visa: typically 90 days. Visa on Arrival is available for many eligible nationalities. Apply via NADRA / Pakistan Online Visa System, or see /planning/visa on this site.",
    tags: ["visa", "e-visa", "passport", "entry", "arrival"],
  },
  {
    id: "safety",
    q: "Is Pakistan safe for tourists?",
    a: "Northern Pakistan (Hunza, Skardu, Gilgit, Naran, Swat) is very popular with tourists. Islamabad and Lahore are also tourist-friendly. Use Tourist Police helpline 1422 for 24/7 assistance. Some border or sensitive areas require permits — check local advice before travel.",
    tags: ["safe", "safety", "security", "police", "1422"],
  },
  {
    id: "best-time",
    q: "What is the best time to visit Pakistan?",
    a: "It depends on the region: Northern areas (Hunza, Skardu) Apr–Oct; cities (Lahore, Karachi) Nov–Mar for milder weather; winter sports Dec–Feb (Murree, Malam Jabba); cherry blossoms Apr–May in Hunza. Monsoon can affect road travel in July–August.",
    tags: ["weather", "season", "when", "best time", "months"],
  },
  {
    id: "permits",
    q: "Do I need permits for K2 base camp or restricted areas?",
    a: "Foreigners typically need an NOC for K2 base camp, Nanga Parbat base camp, Concordia trek, and some Khunjerab Pass / border-adjacent areas. Apply through a licensed tour operator or the relevant tourism authority — often 48–72 hours once documents are complete.",
    tags: ["permit", "noc", "k2", "trekking", "restricted"],
  },
  {
    id: "currency",
    q: "What currency do I need? Can I use ATMs?",
    a: "Currency is the Pakistani Rupee (PKR). ATMs (Visa/Mastercard/UnionPay) work widely in cities. Carry cash in northern valleys where cards are limited. Exchange at banks, airports, or authorised money changers only.",
    tags: ["currency", "pkr", "atm", "money", "cash", "exchange"],
  },
  {
    id: "language",
    q: "What language do people speak?",
    a: "Urdu is the national language and English is widely used in cities, hotels, and tourist areas. Regional languages include Punjabi, Sindhi, Pashto, Balochi, and Burushaski (Hunza). Most major signs are in English and Urdu.",
    tags: ["language", "english", "urdu"],
  },
  {
    id: "islamabad-hunza",
    q: "How do I get from Islamabad to Hunza?",
    a: "Flight: Islamabad → Gilgit (~1 hr, weather-dependent), then ~2.5 hrs drive on the KKH. Road: ~18–22 hours via the Karakoram Highway — scenic but long; break overnight in Chilas or Gilgit. Book flights flexibly for weather delays.",
    tags: ["hunza", "gilgit", "kkh", "transport", "flight", "road"],
  },
  {
    id: "packing",
    q: "What should I pack for northern areas?",
    a: "Even in summer, nights are cold at altitude. Pack layers (fleece/light jacket), sturdy walking shoes, sunblock and sunglasses, a refillable bottle, modest clothing for villages and shrines, and cash (ATMs are sparse). For high treks, add proper boots and warm layers.",
    tags: ["pack", "packing", "clothes", "gear", "northern"],
  },
  {
    id: "alcohol",
    q: "Is alcohol available?",
    a: "Alcohol is restricted for Muslims. Non-Muslims may purchase from licensed shops in major cities or some hotel bars, and foreigners can sometimes obtain a liquor permit via select hotels. Availability is limited outside large cities.",
    tags: ["alcohol", "liquor", "drink"],
  },
  {
    id: "dress",
    q: "What is the dress code / cultural etiquette?",
    a: "Pakistan is a conservative Muslim country. Women: loose clothing covering shoulders and knees; scarf useful for shrines/mosques. Men: long trousers preferred. Remove shoes before mosques and many homes. Ask before photographing people, especially women.",
    tags: ["dress", "etiquette", "culture", "mosque", "modesty"],
  },
  {
    id: "sim",
    q: "Internet, SIM cards & connectivity?",
    a: "Tourist SIMs (Jazz, Zong, Telenor, Ufone) are available at airports with your passport. 4G is strong in cities. In the north, SCOM often has the best coverage; remote valleys (Fairy Meadows, upper Hunza) can have limited or no signal.",
    tags: ["sim", "internet", "wifi", "connectivity", "scom"],
  },
  {
    id: "insurance",
    q: "Do I need travel insurance?",
    a: "Strongly recommended — especially for northern travel and trekking. Standard policies may exclude high-altitude activity; add an adventure-sports rider above ~3,500 m and include medical evacuation coverage.",
    tags: ["insurance", "medical", "evacuation"],
  },
  {
    id: "emergency",
    q: "What are the emergency numbers?",
    a: "Police 15 · Rescue 1122 · Fire 16 · Tourist Police / PTDC helpline 1422. Save 1422 before you travel.",
    tags: ["emergency", "helpline", "1422", "police", "rescue"],
  },
  {
    id: "getting-here",
    q: "How do I get to Pakistan?",
    a: "Major international gateways are Islamabad (ISB), Lahore (LHE), and Karachi (KHI). From the airport use official taxis/ride-hailing, then domestic flights or motorways to continue. See /planning/getting-here for more.",
    tags: ["airport", "flight", "arrival", "getting here"],
  },
  {
    id: "getting-around",
    q: "How do I travel within Pakistan?",
    a: "Domestic flights link major cities and Gilgit/Skardu (weather permitting). Motorways (M-2, M-1, Swat Motorway) and coaches (Daewoo, Faisal Movers) cover intercity routes. Trains suit some corridors. In cities use Careem/InDrive/taxis. See /planning/getting-around.",
    tags: ["transport", "bus", "train", "domestic", "getting around"],
  },
  {
    id: "tic",
    q: "Where can I find tourist information?",
    a: "Tourist Information Centers (TICs) and PTDC offices help with maps, permits guidance, and local tips. Helpline 1422. Browse /planning/tic on Salam Pakistan.",
    tags: ["tic", "information", "ptdc", "help"],
  },
  {
    id: "budget",
    q: "What is a realistic daily budget?",
    a: "Budget travellers often manage on modest guesthouse + local food + shared transport. Mid-range (hotels + private car) costs more, especially with domestic flights to Gilgit/Skardu. Northern road trips add fuel/driver costs. Ask Rehbar for a destination-specific plan.",
    tags: ["budget", "cost", "price", "cheap", "money"],
  },
  {
    id: "women",
    q: "Is Pakistan suitable for women travellers?",
    a: "Many women travel Pakistan successfully, especially in groups or with guides in the north. Dress modestly, prefer reputable hotels, use registered transport, and keep Tourist Police 1422 handy. Solo travellers often stick to well-known tourist circuits.",
    tags: ["women", "solo", "female", "safety"],
  },
];

export function searchFaqs(query: string, limit = 5): FaqEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return FAQS.slice(0, limit);

  const scored = FAQS.map((faq) => {
    const hay = `${faq.q} ${faq.a} ${faq.tags.join(" ")}`.toLowerCase();
    let score = 0;
    for (const token of q.split(/\s+/).filter(Boolean)) {
      if (hay.includes(token)) score += 2;
      if (faq.tags.some((t) => t.includes(token) || token.includes(t))) score += 3;
      if (faq.q.toLowerCase().includes(token)) score += 4;
    }
    if (hay.includes(q)) score += 6;
    return { faq, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return (scored.length ? scored.map((s) => s.faq) : FAQS).slice(0, limit);
}

export function listFaqQuestions() {
  return FAQS.map((f) => ({ id: f.id, q: f.q }));
}
