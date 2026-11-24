/**
 * Trip planner for map pins — routes from Lahore / Karachi / Islamabad.
 * Travel times, seasons and tips drawn from public 2025–2026 Pakistan
 * travel guides (KKH / Hunza, Swat Motorway, M-2 corridor, Kartarpur, etc.).
 */

import type { MapPin } from "./map-views";

export type OriginCityId = "lahore" | "karachi" | "islamabad";

export interface OriginCity {
  id: OriginCityId;
  name: string;
  airport: string;
  blurb: string;
}

export const ORIGIN_CITIES: OriginCity[] = [
  {
    id: "islamabad",
    name: "Islamabad",
    airport: "Islamabad International (ISB)",
    blurb: "Best gateway for the north, Taxila and capital day trips.",
  },
  {
    id: "lahore",
    name: "Lahore",
    airport: "Allama Iqbal International (LHE)",
    blurb: "Mughal hub — ~4–5 hrs to Islamabad by M-2, ~2 hrs flight to Karachi.",
  },
  {
    id: "karachi",
    name: "Karachi",
    airport: "Jinnah International (KHI)",
    blurb: "Southern hub — fly north (~2 hrs to ISB/LHE), then continue by road.",
  },
];

export type TravelMode = "flight" | "road" | "rail" | "bus" | "explore" | "return";

export interface TransportOption {
  mode: TravelMode;
  label: string;
  duration: string;
  costHint?: string;
  note: string;
}

export interface ItineraryStep {
  day: string;
  title: string;
  note: string;
  mode?: TravelMode;
  activities?: string[];
  overnight?: string;
  durationHint?: string;
}

export interface ItineraryPlan {
  summary: string;
  durationLabel: string;
  bestSeason: string;
  transportOptions: TransportOption[];
  steps: ItineraryStep[];
  tips: string[];
}

type DestFamily =
  | "hunza"
  | "skardu"
  | "nanga"
  | "swat"
  | "naran"
  | "capital"
  | "taxila"
  | "kartarpur"
  | "lahore"
  | "karachi"
  | "coast"
  | "sindh"
  | "baloch"
  | "punjab"
  | "general";

function textOf(pin: MapPin) {
  return `${pin.title} ${pin.slug ?? ""} ${pin.description}`.toLowerCase();
}

function familyForPin(pin: MapPin): DestFamily {
  const t = textOf(pin);

  if (/baltit|altit|attabad|khunjerab|passu|hunza|karimabad|rakaposhi|eagle/.test(t))
    return "hunza";
  if (/skardu|deosai|shangrila|kachura|shigar|khaplu|k2|baltoro|sarfaranga/.test(t))
    return "skardu";
  if (/nanga|fairy meadows|raikot|bunji/.test(t)) return "nanga";
  if (/swat|malam|kalam|mingora|mahodand|shinkiari|buddha of swat/.test(t)) return "swat";
  if (/naran|saif ul|ansoo|kaghan|babusar/.test(t)) return "naran";
  if (
    /faisal mosque|pakistan monument|centaurus|saidpur|bari imam|golra|rawal|margalla|pir sohawa|shakarparian|daman|islamabad|rawat|pharwala|neela|chattar|bahria|lake view|jinnah stadium|ankara park|kachnar|nstp|dinosaur|marghazar|eye view|shumber|bruti|shahdara|loh-e-dandi|losar|sadhu|zipline|president|supreme court|national assembly|archives|sir syed|rose and jasmine|star and crescent|f-1 traxx|bird aviary|rawal dam|islamabad golf|fatima jinnah/.test(
      t
    )
  )
    return "capital";
  if (/taxila|jaulian|dharma|takht|gandhara/.test(t)) return "taxila";
  if (/kartarpur|nankana|gurdwara|sikh/.test(t)) return "kartarpur";
  if (/lahore|badshahi|shalimar|minar-e-pakistan|shahi qila|wazir|food street|hiran minar/.test(t))
    return "lahore";
  if (/clifton|hawke|keamari|frere|karachi|paradise point|french beach|churna/.test(t))
    return "karachi";
  if (/gwadar|hingol|makran|astola|princess of hope|sphinx|mud volcano|gondrani/.test(t))
    return "coast";
  if (/mohenjo|makli|thatta|hyderabad|ranikot|nagarparkar|gori|bootar|sehwan|uch/.test(t))
    return "sindh";
  if (/quetta|hanna|pir ghaib|reko|bolan|cholistan|derawar|noor mahal|multan|harappa|khewra|rohtas|katas|amb sharif|parachinar|khyber/.test(t))
    return "baloch";
  if (/faisalabad|clock tower|power plant/.test(t)) return "punjab";

  return "general";
}

function sameCity(origin: OriginCityId, family: DestFamily): boolean {
  if (origin === "lahore" && (family === "lahore" || family === "kartarpur")) return family === "lahore";
  if (origin === "karachi" && family === "karachi") return true;
  if (origin === "islamabad" && family === "capital") return true;
  return false;
}

/** Staging leg from Lahore/Karachi into Islamabad before a northern trip. */
function stagingToIslamabad(origin: OriginCityId): ItineraryStep[] {
  if (origin === "islamabad") return [];
  if (origin === "lahore") {
    return [
      {
        day: "Day 1",
        title: "Lahore → Islamabad",
        note: "M-2 motorway ~291 km · 4–5 hrs by Daewoo / Faisal Movers (from ~PKR 1,800) or private car. Flight LHE→ISB ~45–75 min if you prefer speed.",
        mode: "road",
        activities: [
          "Morning departure from Lahore (avoid Friday evening traffic)",
          "Optional stop at Kallar Kahar service area on the M-2",
          "Check into an Islamabad / Rawalpindi hotel near the airport if flying north next day",
        ],
        overnight: "Islamabad or Rawalpindi",
        durationHint: "4–5 hrs road · ~1 hr air",
      },
    ];
  }
  return [
    {
      day: "Day 1",
      title: "Karachi → Islamabad",
      note: "Domestic flight KHI→ISB ~1.5–2 hrs (PIA, Airblue, Fly Jinnah, AirSial). Train/bus (~18–24 hrs) is possible but not recommended for tourists short on time.",
      mode: "flight",
      activities: [
        "Book a morning flight so you keep afternoon buffer",
        "Arrive ISB, transfer to hotel (~40–50 min from airport)",
        "Light walk: Faisal Mosque or Centaurus if energy allows",
      ],
      overnight: "Islamabad",
      durationHint: "~2 hrs flight",
    },
  ];
}

function dayOffset(origin: OriginCityId, startFromIsb = 1): number {
  return origin === "islamabad" ? startFromIsb : startFromIsb + 1;
}

function labelDay(n: number, suffix = ""): string {
  return `Day ${n}${suffix ? ` · ${suffix}` : ""}`;
}

export function buildItinerary(
  pin: MapPin,
  originId: OriginCityId
): ItineraryPlan {
  const origin = ORIGIN_CITIES.find((c) => c.id === originId)!;
  const family = familyForPin(pin);
  const dest = pin.title;

  switch (family) {
    case "hunza":
      return planHunza(pin, origin, dest);
    case "skardu":
      return planSkardu(pin, origin, dest);
    case "nanga":
      return planNanga(pin, origin, dest);
    case "swat":
      return planSwat(pin, origin, dest);
    case "naran":
      return planNaran(pin, origin, dest);
    case "capital":
      return planCapital(pin, origin, dest);
    case "taxila":
      return planTaxila(pin, origin, dest);
    case "kartarpur":
      return planKartarpur(pin, origin, dest);
    case "lahore":
      return planLahore(pin, origin, dest);
    case "karachi":
      return planKarachi(pin, origin, dest);
    case "coast":
      return planCoast(pin, origin, dest);
    case "sindh":
      return planSindh(pin, origin, dest);
    default:
      return planGeneral(pin, origin, dest, family);
  }
}

/* ---------- Legacy export used by older UI bits ---------- */
export type ItineraryStep_Legacy = ItineraryStep;

function planHunza(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  const staging = stagingToIslamabad(origin.id);
  const d = dayOffset(origin.id);

  const steps: ItineraryStep[] = [
    ...staging,
    {
      day: labelDay(d),
      title: "Islamabad → Gilgit → approach Hunza",
      note: "Fastest: PIA ISB→Gilgit ~55–75 min, then 2–2.5 hrs road to Karimabad (~100 km). Road backup: NATCO / Faisal Movers overnight coach 16–18 hrs to Gilgit (PKR ~2,000–5,500), or private car over 2 days via Besham/Chilas on the KKH.",
      mode: "flight",
      activities: [
        "Prefer a morning mountain flight — afternoon winds cancel more often",
        "Keep a flexible / refundable fare; weather can scrub flights for days",
        "From Gilgit airport, hotel pickup or taxi to Karimabad (agree fare first)",
      ],
      overnight: "Karimabad (Hunza)",
      durationHint: "Half day if flight runs · 2 days by road",
    },
    {
      day: labelDay(d + 1),
      title: `Explore ${dest}`,
      note: pin.description,
      mode: "explore",
      activities: [
        "Baltit & Altit Forts + Karimabad bazaar",
        "Eagle’s Nest viewpoint for sunset (weather permitting)",
        "Optional: Duikar, Ultar meadow short hike",
      ],
      overnight: "Karimabad",
    },
    {
      day: labelDay(d + 2),
      title: "Upper Hunza day — Attabad, Passu, Sost",
      note: "Drive through the Attabad tunnels, stop at the lake for a boat, then Passu Cones / Hussaini Bridge. Khunjerab Pass (China border) needs an early start and open season.",
      mode: "explore",
      activities: [
        "Attabad Lake boat ride",
        "Passu Glacier / Cones photo stop",
        "Optional push to Khunjerab (summer; long day)",
      ],
      overnight: "Karimabad or Passu",
    },
    {
      day: labelDay(d + 3, "buffer / return"),
      title: `Return toward ${origin.name}`,
      note: "Fly Gilgit→ISB when clear, or descend the KKH with a night in Chilas / Besham. Then reverse your staging leg to Lahore or Karachi.",
      mode: "return",
      activities: [
        "Build one spare day before any international flight",
        "Many travellers fly one way and road the other",
      ],
      overnight: origin.id === "islamabad" ? "Islamabad" : origin.name,
    },
  ];

  return {
    summary: `A classic Hunza trip from ${origin.name}: stage via Islamabad, fly or drive the Karakoram corridor, then give ${dest} two full valley days.`,
    durationLabel: origin.id === "islamabad" ? "4–5 days" : "5–6 days",
    bestSeason: "May–October (smoothest roads & flights); KKH open year-round via Besham",
    transportOptions: [
      {
        mode: "flight",
        label: "Fly ISB → Gilgit + road",
        duration: "~½ day if flight operates",
        costHint: "Flight often PKR 10–20k · Gilgit→Hunza taxi ~8–12k",
        note: "Weather-dependent ATR flight — never plan a tight same-day connection.",
      },
      {
        mode: "bus",
        label: "NATCO / Faisal Movers coach",
        duration: "16–18 hrs to Gilgit",
        costHint: "Coach ~PKR 2–5.5k · van to Hunza ~400–700",
        note: "Budget classic; overnight coaches miss the daytime scenery.",
      },
      {
        mode: "road",
        label: "Private car on the KKH",
        duration: "2 driving days",
        costHint: "Vehicle often PKR 40–60k round-trip (confirm fuel)",
        note: "Overnight Besham or Chilas; Babusar / Naran shortcut in summer only.",
      },
    ],
    steps,
    tips: [
      "No airport in Hunza — Gilgit is the gateway.",
      "Do not schedule an international departure the same day as a Gilgit flight.",
      "Carry cash; mountain ATMs can be unreliable.",
      "Landslides and weather delays are normal — keep one buffer day.",
    ],
  };
}

function planSkardu(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  const staging = stagingToIslamabad(origin.id);
  const d = dayOffset(origin.id);

  return {
    summary: `Skardu-region trip from ${origin.name} for ${dest}: fly ISB→Skardu when weather allows, then explore lakes, deserts and valley forts.`,
    durationLabel: origin.id === "islamabad" ? "4–5 days" : "5–6 days",
    bestSeason: "May–October (Deosai usually July–September)",
    transportOptions: [
      {
        mode: "flight",
        label: "Fly ISB → Skardu",
        duration: "~1 hr air",
        costHint: "Similar mountain-fare range to Gilgit",
        note: "Multiple operators when weather is clear; still cancellation-prone.",
      },
      {
        mode: "bus",
        label: "Coach via KKH",
        duration: "18–22 hrs to Skardu",
        note: "Longer than Gilgit; break at Chilas if driving.",
      },
    ],
    steps: [
      ...staging,
      {
        day: labelDay(d),
        title: "Islamabad → Skardu",
        note: "Morning flight preferred. On arrival, transfer to Skardu town or Shangrila / Kachura if pre-booked.",
        mode: "flight",
        activities: ["Airport transfer", "Light orientation walk or Kharpocho viewpoint"],
        overnight: "Skardu or Lower Kachura",
        durationHint: "~1 hr flight + transfer",
      },
      {
        day: labelDay(d + 1),
        title: `Focus: ${dest}`,
        note: pin.description,
        mode: "explore",
        activities: [
          "Shangrila / Upper Kachura lakes",
          "Optional Sarfaranga cold desert",
          "Shigar Fort day trip if time",
        ],
        overnight: "Skardu area",
      },
      {
        day: labelDay(d + 2),
        title: "Valley day or Deosai (seasonal)",
        note: "Deosai National Park needs a full day and open season. Otherwise Khaplu or Manthokha waterfall.",
        mode: "explore",
        overnight: "Skardu",
      },
      {
        day: labelDay(d + 3, "return"),
        title: `Skardu → ${origin.name}`,
        note: "Fly Skardu→ISB, then continue to Lahore/Karachi if needed. Keep a spare night in Islamabad for weather.",
        mode: "return",
        overnight: origin.name,
      },
    ],
    tips: [
      "K2 Base Camp is a multi-week trek — not a day trip from Skardu.",
      "Book flexible mountain flights and a buffer night in ISB.",
      "Altitude: take it easy on day one; drink water.",
    ],
  };
}

function planNanga(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  const staging = stagingToIslamabad(origin.id);
  const d = dayOffset(origin.id);

  return {
    summary: `${dest} sits on the Nanga Parbat / Fairy Meadows side of the KKH — plan road time from Islamabad and a jeep + trek approach.`,
    durationLabel: origin.id === "islamabad" ? "3–4 days" : "4–5 days",
    bestSeason: "June–September (Fairy Meadows trail)",
    transportOptions: [
      {
        mode: "road",
        label: "ISB → Raikot Bridge → jeep",
        duration: "1 long day inbound",
        note: "Private car to Raikot, then jeep to Tato, then trek to Fairy Meadows.",
      },
    ],
    steps: [
      ...staging,
      {
        day: labelDay(d),
        title: "Islamabad → Raikot / Tato",
        note: "Drive the KKH toward Chilas / Raikot Bridge. Jeep to Tato village; overnight or continue with daylight for the meadow trek.",
        mode: "road",
        overnight: "Tato or Fairy Meadows camp",
      },
      {
        day: labelDay(d + 1),
        title: dest,
        note: pin.description,
        mode: "explore",
        activities: ["Meadow viewpoints of Nanga Parbat", "Short ridge walks — hire a local guide"],
        overnight: "Fairy Meadows",
      },
      {
        day: labelDay(d + 2, "return"),
        title: `Descend & return to ${origin.name}`,
        note: "Trek/jeep down, then road south. Do not rush night driving on the KKH.",
        mode: "return",
      },
    ],
    tips: [
      "Jeep + trek sections need local operators — book ahead in season.",
      "No facilities like a city hotel; pack warm layers even in summer.",
    ],
  };
}

function planSwat(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  const staging = stagingToIslamabad(origin.id);
  const d = dayOffset(origin.id);

  return {
    summary: `Swat is an easy motorway trip from Islamabad (~5–6 hrs to Malam Jabba). From ${origin.name}, ${dest} works as a 3–5 day valley break.`,
    durationLabel: origin.id === "islamabad" ? "2–3 days" : "3–4 days",
    bestSeason: "April–October; snow sports in winter at Malam Jabba",
    transportOptions: [
      {
        mode: "road",
        label: "M-1 + Swat Motorway (M-16)",
        duration: "ISB→Mingora ~3.5–4 hrs · Malam Jabba 5–6 hrs",
        note: "~280 km to Malam Jabba. Not a sensible same-day round trip.",
      },
      {
        mode: "bus",
        label: "Coach to Mingora + local car",
        duration: "Similar road time",
        note: "Then hire a car for the Malam Jabba climb.",
      },
    ],
    steps: [
      ...staging,
      {
        day: labelDay(d),
        title: `Islamabad → Swat · ${dest}`,
        note: "Leave by 7 am. Route: M-1 → Swat Motorway to Chakdara → N-95 to Mingora → Manglor climb for Malam Jabba.",
        mode: "road",
        activities: [
          "Lunch stop in Fizagat / Mingora",
          "Arrive mid-afternoon for chairlift or valley walk",
        ],
        overnight: "Malam Jabba or Mingora",
        durationHint: "5–6 hrs driving",
      },
      {
        day: labelDay(d + 1),
        title: `Full day around ${dest}`,
        note: pin.description,
        mode: "explore",
        activities: [
          "Malam Jabba chairlift / trails",
          "Optional: Saidu Sharif museum or Jahanabad Buddha",
          "Kalam / Mahodand if extending (add 1–2 days)",
        ],
        overnight: "Swat",
      },
      {
        day: labelDay(d + 2, "return"),
        title: `Return to ${origin.name}`,
        note: "Morning in the valley, afternoon motorway back to Islamabad, then onward flight/road if needed.",
        mode: "return",
      },
    ],
    tips: [
      "Avoid descending the Malam Jabba road after dark in snow.",
      "Friday/Sunday evenings are the busiest on the Swat corridor.",
      "From Lahore, expect 9–11 hrs driving if you skip the Islamabad overnight — better to break the trip.",
    ],
  };
}

function planNaran(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  const staging = stagingToIslamabad(origin.id);
  const d = dayOffset(origin.id);

  return {
    summary: `Naran–Kaghan lakes from ${origin.name}. Saiful Muluk is a jeep day from Naran; plan summer travel.`,
    durationLabel: origin.id === "islamabad" ? "2–3 days" : "3–4 days",
    bestSeason: "June–September (lake access & Babusar)",
    transportOptions: [
      {
        mode: "road",
        label: "ISB → Mansehra → Naran",
        duration: "~6–8 hrs",
        note: "Private car or tourist coaches in peak summer.",
      },
    ],
    steps: [
      ...staging,
      {
        day: labelDay(d),
        title: "Islamabad → Naran",
        note: "Early start via Mansehra / Balakot. Overnight in Naran bazaar hotels.",
        mode: "road",
        overnight: "Naran",
      },
      {
        day: labelDay(d + 1),
        title: dest,
        note: pin.description,
        mode: "explore",
        activities: [
          "Jeep to Saiful Muluk (morning)",
          "Optional Ansoo Lake trek (fit hikers, long day)",
        ],
        overnight: "Naran",
      },
      {
        day: labelDay(d + 2, "return"),
        title: `Return to ${origin.name}`,
        mode: "return",
        note: "Descend to Mansehra / Abbottabad then Islamabad.",
      },
    ],
    tips: [
      "Weekends in July–August are crowded — book rooms ahead.",
      "Babusar Pass toward Chilas is summer-only and closes with snow.",
    ],
  };
}

function planCapital(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  if (origin.id === "islamabad" || sameCity(origin.id, "capital")) {
    return {
      summary: `${dest} is a capital-region outing — most pins are 30–90 minutes from central Islamabad.`,
      durationLabel: "½–1 day",
      bestSeason: "Year-round; Margallas nicest Oct–Apr mornings",
      transportOptions: [
        {
          mode: "road",
          label: "Careem / taxi / self-drive",
          duration: "30–90 min each way",
          note: "Ride-hailing is simplest inside the twin cities.",
        },
      ],
      steps: [
        {
          day: "Morning",
          title: "Leave your Islamabad base",
          note: "Allow traffic time on Kashmir Highway / Margalla Road.",
          mode: "road",
          durationHint: "30–90 min",
        },
        {
          day: "Midday",
          title: dest,
          note: pin.description,
          mode: "explore",
          activities: ["Main visit", "Nearby café or viewpoint if listed"],
        },
        {
          day: "Evening",
          title: "Return to Islamabad",
          note: "Optional dinner in Blue Area, F-6 or Saidu Pur.",
          mode: "return",
        },
      ],
      tips: [
        "Carry water for Margalla trails.",
        "Some Red Zone sites are exterior viewing only.",
      ],
    };
  }

  const staging = stagingToIslamabad(origin.id);
  return {
    summary: `From ${origin.name}, overnight in Islamabad then visit ${dest} as a focused capital day.`,
    durationLabel: "2 days",
    bestSeason: "Year-round",
    transportOptions: [
      origin.id === "lahore"
        ? {
            mode: "road" as const,
            label: "M-2 motorway / coach",
            duration: "4–5 hrs",
            costHint: "Bus from ~PKR 1,800",
            note: "Daewoo, Faisal Movers, Bilal, Skyways — frequent departures.",
          }
        : {
            mode: "flight" as const,
            label: "Fly KHI → ISB",
            duration: "~2 hrs",
            note: "Then local transfer to your hotel and the pin.",
          },
    ],
    steps: [
      ...staging,
      {
        day: "Day 2",
        title: dest,
        note: pin.description,
        mode: "explore",
        activities: ["Morning visit", "Afternoon city highlight (Faisal Mosque / Monument)", "Evening return flight/road"],
        overnight: origin.name,
      },
    ],
    tips: ["If flying back to Karachi, prefer evening departures after sightseeing."],
  };
}

function planTaxila(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  if (origin.id === "islamabad") {
    return {
      summary: `Taxila is ~35–40 km / 45–60 min from Islamabad — ideal half or full day for ${dest}.`,
      durationLabel: "1 day",
      bestSeason: "October–March (cooler for outdoor ruins)",
      transportOptions: [
        {
          mode: "road",
          label: "Private car / taxi",
          duration: "45–60 min each way",
          note: "Sites are spread out — hire for the day, not a single drop-off.",
        },
      ],
      steps: [
        {
          day: "Morning",
          title: "Islamabad → Taxila Museum",
          note: "Start at the museum for context, then Jaulian / Dharmarajika / Sirkap as time allows.",
          mode: "road",
        },
        {
          day: "Midday–afternoon",
          title: dest,
          note: pin.description,
          mode: "explore",
          activities: ["Museum", "Jaulian monastery", "One additional stupa / city site"],
        },
        {
          day: "Evening",
          title: "Return to Islamabad",
          mode: "return",
          note: "Avoid peak Rawalpindi traffic if you can.",
        },
      ],
      tips: [
        "A full day covers most major Taxila sites; 2–3 hours only fits museum + one ruin.",
        "Wear sturdy shoes — uneven stone paths.",
      ],
    };
  }

  const staging = stagingToIslamabad(origin.id);
  return {
    summary: `From ${origin.name}, Taxila pairs best with an Islamabad overnight (~5 hrs from Lahore by M-2).`,
    durationLabel: "2 days",
    bestSeason: "October–March",
    transportOptions: [
      {
        mode: "road",
        label: origin.id === "lahore" ? "M-2 to ISB corridor" : "Fly to ISB",
        duration: origin.id === "lahore" ? "~5 hrs to Taxila area" : "~2 hrs flight + 1 hr road",
        note: "Same-day Lahore round trip is 9–10 hrs driving — overnight is kinder.",
      },
    ],
    steps: [
      ...staging,
      {
        day: "Day 2",
        title: `Taxila · ${dest}`,
        note: pin.description,
        mode: "explore",
        activities: ["Museum + Jaulian", "Return via Islamabad airport / M-2"],
        overnight: origin.name,
      },
    ],
    tips: ["Combine with Rohtas Fort on the GT Road only if you accept a slower day."],
  };
}

function planKartarpur(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  if (origin.id === "lahore") {
    return {
      summary: `${dest} is ~120–130 km / ~2.5 hrs from Lahore — a full day trip with morning entry.`,
      durationLabel: "1 day",
      bestSeason: "Year-round; mornings are cooler and less crowded",
      transportOptions: [
        {
          mode: "road",
          label: "Lahore–Sialkot Motorway → Narowal",
          duration: "~2.5 hrs each way",
          note: "Private car easiest; start early.",
        },
      ],
      steps: [
        {
          day: "Morning",
          title: "Lahore → Kartarpur",
          note: "Arrive for opening; entry for visitors has closed mid-afternoon — confirm current hours.",
          mode: "road",
          activities: ["Carry original CNIC (foreign nationals: passport + visa)", "Small bags — multiple security checks"],
        },
        {
          day: "Midday",
          title: dest,
          note: pin.description,
          mode: "explore",
          activities: ["Darbar visit", "Langar (communal kitchen)", "Cover head; remove shoes; no tobacco"],
        },
        {
          day: "Afternoon",
          title: "Return to Lahore",
          mode: "return",
          note: "Aim to be off the highway before dark.",
        },
      ],
      tips: [
        "Weekends are busiest.",
        "Pakistan-side visitors are welcome; the India corridor status does not block domestic visits.",
      ],
    };
  }

  const toLahore: ItineraryStep =
    origin.id === "islamabad"
      ? {
          day: "Day 1",
          title: "Islamabad → Lahore",
          note: "M-2 ~4–5 hrs or short flight. Overnight Lahore for an early Kartarpur start.",
          mode: "road",
          overnight: "Lahore",
        }
      : {
          day: "Day 1",
          title: "Karachi → Lahore",
          note: "Fly KHI→LHE (~1h 45m–2h). Overnight in Lahore.",
          mode: "flight",
          overnight: "Lahore",
        };

  return {
    summary: `From ${origin.name}, base in Lahore then day-trip to ${dest}.`,
    durationLabel: "2 days",
    bestSeason: "Year-round",
    transportOptions: [
      {
        mode: origin.id === "karachi" ? "flight" : "road",
        label: origin.id === "karachi" ? "Fly to Lahore" : "M-2 to Lahore",
        duration: origin.id === "karachi" ? "~2 hrs" : "4–5 hrs",
        note: "Then ~2.5 hrs road to Kartarpur.",
      },
    ],
    steps: [
      toLahore,
      {
        day: "Day 2",
        title: `Kartarpur day · ${dest}`,
        note: pin.description,
        mode: "explore",
        activities: ["Morning at the Darbar", "Return to Lahore; evening flight/road home if timed"],
        overnight: origin.name,
      },
    ],
    tips: ["Carry CNIC/passport for entry registration."],
  };
}

function planLahore(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  if (origin.id === "lahore") {
    return {
      summary: `${dest} is in or near Lahore — explore on foot / rickshaw / Careem without intercity travel.`,
      durationLabel: "½–1 day",
      bestSeason: "November–March (pleasant heritage walking weather)",
      transportOptions: [
        {
          mode: "road",
          label: "Local Careem / walking old city",
          duration: "In-city",
          note: "Walled City is best early morning before heat and crowds.",
        },
      ],
      steps: [
        {
          day: "Morning",
          title: dest,
          note: pin.description,
          mode: "explore",
          activities: ["Main monument", "Nearby Walled City lanes or Food Street"],
        },
        {
          day: "Afternoon",
          title: "Lahore extras",
          note: "Shalimar, Museum, or Wagah ceremony if timing fits.",
          mode: "explore",
        },
      ],
      tips: ["Dress modestly at mosques; Friday prayers are busiest."],
    };
  }

  return {
    summary: `Fly or motorway into Lahore from ${origin.name}, then give ${dest} a proper heritage day.`,
    durationLabel: "2–3 days",
    bestSeason: "November–March",
    transportOptions: [
      origin.id === "islamabad"
        ? {
            mode: "road" as const,
            label: "M-2 / coach / train",
            duration: "4–5 hrs road · ~5 hrs train",
            costHint: "Bus from ~PKR 1,800",
            note: "Frequent coaches; Margala / Rawalpindi trains also run.",
          }
        : {
            mode: "flight" as const,
            label: "Fly KHI → LHE",
            duration: "~1h 45m–2h",
            note: "Daily nonstops. Overnight train (~17 hrs) is the budget alternative.",
          },
    ],
    steps: [
      {
        day: "Day 1",
        title: `${origin.name} → Lahore`,
        note:
          origin.id === "islamabad"
            ? "Arrive via M-2; evening Food Street or illuminated Badshahi Mosque."
            : "Flight to LHE; transfer to Walled City / Mall Road hotel.",
        mode: origin.id === "islamabad" ? "road" : "flight",
        overnight: "Lahore",
      },
      {
        day: "Day 2",
        title: dest,
        note: pin.description,
        mode: "explore",
        activities: [
          "Badshahi Mosque & Lahore Fort",
          "Wazir Khan / Shahi Hammam if in the old city",
          "Optional Wagah border evening",
        ],
        overnight: "Lahore",
      },
      {
        day: "Day 3",
        title: `Return to ${origin.name}`,
        mode: "return",
        note: "Morning museum or Shalimar, then depart.",
      },
    ],
    tips: ["Book old-city guides for deeper Walled City lanes.", "Fridays change mosque visiting hours."],
  };
}

function planKarachi(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  if (origin.id === "karachi") {
    return {
      summary: `${dest} is a Karachi city or beach outing — plan traffic time, especially evenings.`,
      durationLabel: "½–1 day",
      bestSeason: "November–March (less humid)",
      transportOptions: [
        {
          mode: "road",
          label: "Careem / private car",
          duration: "30–90 min across the city",
          note: "Clifton / DHA beaches need late-afternoon timing for light.",
        },
      ],
      steps: [
        {
          day: "Morning or late afternoon",
          title: dest,
          note: pin.description,
          mode: "explore",
          activities: ["Main site", "Seafood dinner in Clifton / Boat Basin if coastal"],
        },
      ],
      tips: ["Avoid isolated beach stretches after dark.", "Friday prayers affect Saddar traffic."],
    };
  }

  return {
    summary: `Fly into Karachi from ${origin.name} (~2 hrs), then visit ${dest} with one buffer city day.`,
    durationLabel: "2–3 days",
    bestSeason: "November–March",
    transportOptions: [
      {
        mode: "flight",
        label: `Fly ${origin.id === "lahore" ? "LHE" : "ISB"} → KHI`,
        duration: "~2 hrs",
        note: "Prefer flying over the 16–18 hr bus/train unless on a rail journey for its own sake.",
      },
    ],
    steps: [
      {
        day: "Day 1",
        title: `${origin.name} → Karachi`,
        note: "Domestic flight; transfer to Clifton / DHA / city hotel.",
        mode: "flight",
        overnight: "Karachi",
      },
      {
        day: "Day 2",
        title: dest,
        note: pin.description,
        mode: "explore",
        activities: ["Main visit", "Optional Frere Hall / Quaid’s mausoleum / Mohatta Palace"],
        overnight: "Karachi",
      },
      {
        day: "Day 3",
        title: `Return to ${origin.name}`,
        mode: "return",
        note: "Morning flight recommended.",
      },
    ],
    tips: ["Karachi is vast — cluster sights by neighbourhood.", "Use ride-hailing rather than street taxis when possible."],
  };
}

function planCoast(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  const toKhi =
    origin.id === "karachi"
      ? []
      : [
          {
            day: "Day 1",
            title: `${origin.name} → Karachi`,
            note: "Fly into KHI; overnight before the Makran / Hingol push.",
            mode: "flight" as const,
            overnight: "Karachi",
          },
        ];
  const d = origin.id === "karachi" ? 1 : 2;

  return {
    summary: `${dest} needs a Karachi base and a coastal highway day (or overnight in Gwadar / Hingol area).`,
    durationLabel: origin.id === "karachi" ? "2–3 days" : "3–4 days",
    bestSeason: "October–March (cooler coastal driving)",
    transportOptions: [
      {
        mode: "road",
        label: "Makran Coastal Highway",
        duration: "Long day(s) from Karachi",
        note: "Private 4x4 / tour vehicle recommended for Hingol & landmarks.",
      },
    ],
    steps: [
      ...toKhi,
      {
        day: labelDay(d),
        title: `Coastal day · ${dest}`,
        note: pin.description,
        mode: "explore",
        activities: ["Scenic highway stops", "Park / beach time", "Do not swim in unmarked surf"],
        overnight: "Gwadar, Ormara area, or return Karachi (very long day)",
      },
      {
        day: labelDay(d + 1, "return"),
        title: `Return toward ${origin.name}`,
        mode: "return",
        note: "Back to Karachi airport for the domestic flight home.",
      },
    ],
    tips: [
      "Check current security / road advisories for Balochistan coastal routes.",
      "Fuel and facilities are sparse — start with a full tank and water.",
    ],
  };
}

function planSindh(pin: MapPin, origin: OriginCity, dest: string): ItineraryPlan {
  return {
    summary: `Sindh heritage around ${dest} is usually reached via Karachi or Sukkur with a guided day.`,
    durationLabel: "2–3 days",
    bestSeason: "November–February",
    transportOptions: [
      {
        mode: "flight",
        label: origin.id === "karachi" ? "Road / tour from Karachi" : "Fly to Karachi or Sukkur",
        duration: "Varies by site",
        note: "Mohenjo-daro often needs a flight to Sukkur / Moenjodaro airstrip + guide.",
      },
    ],
    steps: [
      ...(origin.id === "karachi"
        ? []
        : [
            {
              day: "Day 1",
              title: `${origin.name} → Karachi / Sukkur`,
              note: "Position near the site with a domestic flight.",
              mode: "flight" as const,
              overnight: "Karachi or Sukkur",
            },
          ]),
      {
        day: origin.id === "karachi" ? "Day 1" : "Day 2",
        title: dest,
        note: pin.description,
        mode: "explore",
        activities: ["Guided site visit", "Museum if available"],
        overnight: "Nearest city",
      },
      {
        day: origin.id === "karachi" ? "Day 2" : "Day 3",
        title: `Return to ${origin.name}`,
        mode: "return",
        note: "Same-day return only for closer Thatta / Makli runs from Karachi.",
      },
    ],
    tips: ["Hire a licensed guide at major archaeological sites.", "Carry sun protection — shade is limited."],
  };
}

function planGeneral(
  pin: MapPin,
  origin: OriginCity,
  dest: string,
  family: DestFamily
): ItineraryPlan {
  const viaNorth = family === "baloch" || family === "punjab" || family === "general";

  return {
    summary: `Suggested route from ${origin.name} to ${dest}. Confirm seasonal road and flight status before you book.`,
    durationLabel: "3–4 days",
    bestSeason: "Depends on region — plains Nov–Mar, highlands May–Oct",
    transportOptions: [
      {
        mode: "flight",
        label: "Domestic flight where available",
        duration: "1–2 hrs air + local transfer",
        note: "Use ISB / LHE / KHI as hubs.",
      },
      {
        mode: "road",
        label: "Motorway or national highway",
        duration: "Half to full day",
        note: "Prefer daylight driving outside cities.",
      },
    ],
    steps: [
      {
        day: "Day 1",
        title: `Depart ${origin.name}`,
        note: viaNorth
          ? `Travel toward the region of ${dest} via the nearest hub airport or motorway.`
          : `Make your way toward ${dest}.`,
        mode: "flight",
        overnight: "En route hub or destination town",
      },
      {
        day: "Day 2",
        title: dest,
        note: pin.description,
        mode: "explore",
        activities: ["Main site visit", "Local food stop", "Short walk or viewpoint"],
        overnight: "Near destination",
      },
      {
        day: "Day 3",
        title: "Second exploration day",
        note: "Use the spare day for weather, rest, or a nearby secondary site.",
        mode: "explore",
      },
      {
        day: "Day 4",
        title: `Return to ${origin.name}`,
        mode: "return",
        note: "Reverse your inbound route; keep buffer before onward flights.",
      },
    ],
    tips: [
      "CNIC/passport needed for many intercity tickets.",
      "Check PTDC / local tourism advice for current access.",
      "Book flexible tickets on weather-exposed mountain routes.",
    ],
  };
}
