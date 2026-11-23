export type IconName =
  | "barometer"
  | "calendar"
  | "leaflet"
  | "newsletter"
  | "book"
  | "map"
  | "standard";

export interface Publication {
  title: string;
  image: string;
  pdf: string;
}

export interface PublicationCategory {
  id: string;
  title: string;
  tagline: string;
  icon: IconName;
  items: Publication[];
}

const IMG = "/publications";
const PDF = "/pdf";

export const categories: PublicationCategory[] = [
  {
    id: "barometers",
    title: "Barometers",
    tagline: "Tourism statistics & data booklets",
    icon: "barometer",
    items: [
      {
        title: "Pakistan Tourism Barometer 2025-26",
        image: `${IMG}/barometer_2025_26.png`,
        pdf: `${PDF}/Pakistan Tourism Barometer 2025-26.pdf`,
      },
      {
        title: "Pakistan Tourism Barometer 2024-25",
        image: `${IMG}/barometer_2024_25.png`,
        pdf: `${PDF}/Pakistan Tourism Barometer 2024-25.pdf`,
      },
      {
        title: "Tourism Data Booklet 2023-24",
        image: `${IMG}/Pakistan Tourism Barometer (Edition - 2023-24).png`,
        pdf: `${PDF}/Tourism Data Booklet 23-24 Updated.pdf`,
      },
      {
        title: "Pakistan Tourism Barometer - FY 2021-22",
        image: `${IMG}/Pakistan Tourism Barometer (Edition - 2022).png`,
        pdf: `${PDF}/Pakistan Tourism Barometer.pdf`,
      },
    ],
  },
  {
    id: "calendar",
    title: "Calendar of Events",
    tagline: "Annual events & festivals across Pakistan",
    icon: "calendar",
    items: [
      {
        title: "Calendar of Events",
        image: `${IMG}/Calendar of Events.png`,
        pdf: `${PDF}/Calendar of Events.pdf`,
      },
    ],
  },
  {
    id: "leaflets",
    title: "Leaflets",
    tagline: "Quick guides to explore responsibly",
    icon: "leaflet",
    items: [
      {
        title: "Responsible Tourism Leaflet",
        image: `${IMG}/cover-responsible-tourism-salam-pakistan-ptdc.png`,
        pdf: `${PDF}/RESPONSIBLE TOURISM PAKISTAN.pdf`,
      },
      {
        title: "World Heritage Sites in Pakistan Leaflet",
        image: `${IMG}/World Heritage Sites in Pakistan.png`,
        pdf: `${PDF}/Updated World Heritage Sites - Salam Pakistan.pdf`,
      },
      {
        title: "Rock Art Leaflet",
        image: `${IMG}/Rock Art Tourism along Karakoram Highway.png`,
        pdf: `${PDF}/Rock Art Leaflet Salam Pakistan.pdf`,
      },
    ],
  },
  {
    id: "newsletters",
    title: "Newsletters",
    tagline: "PTDC news & yearly highlights",
    icon: "newsletter",
    items: [
      {
        title: "PTDC Newsletter 2022-23",
        image: `${IMG}/PTDC-newsletter-2022-23 cover.png`,
        pdf: `${PDF}/PTDC-Newsletter-020124.pdf`,
      },
      {
        title: "PTDC Newsletter 2020",
        image: `${IMG}/PTDC Newsletter 2021.png`,
        pdf: `${PDF}/PTDC Newsletter 2021.pdf`,
      },
      {
        title: "PTDC Newsletter 2022",
        image: `${IMG}/PTDC Newsletter 2022.png`,
        pdf: `${PDF}/PTDC Newsletter 2022.pdf`,
      },
    ],
  },
  {
    id: "books",
    title: "Books",
    tagline: "Heritage trails & travel storytelling",
    icon: "book",
    items: [
      {
        title: "Journey into Light (English)",
        image: `${IMG}/Salam Pakistan - Journey into Light (English).png`,
        pdf: `${PDF}/Salam Pakistan - Journey into Light (English).pdf`,
      },
      {
        title: "Journey into Light (Urdu)",
        image: `${IMG}/Salam Pakistan - Journey into Light (Urdu).png`,
        pdf: `${PDF}/Salam Pakistan - Journey into Light (Urdu).pdf`,
      },
      {
        title: "Buddhist Heritage Trail (Chinese Language)",
        image: `${IMG}/Salam Pakistan -Buddhist Heritage Trail (Chinese Language).png`,
        pdf: `${PDF}/Salam Pakistan  -Buddhist Heritage Trail (Chinese Language).pdf`,
      },
      {
        title: "Buddhist Heritage Trail (English Language)",
        image: `${IMG}/Salam Pakistan -Buddhist Heritage Trail (English Language).png`,
        pdf: `${PDF}/Salam Pakistan  -Buddhist Heritage Trail (English Language).pdf`,
      },
      {
        title: "Buddhist Heritage Trail (Korean Language)",
        image: `${IMG}/Salam Pakistan -Buddhist Heritage Trail (Korean Language).png`,
        pdf: `${PDF}/Salam Pakistan  -Buddhist Heritage Trail (Korean Language).pdf`,
      },
      {
        title: "Sikh Heritage Trail",
        image: `${IMG}/Salam Pakistan -Sikh Heritage Trail.png`,
        pdf: `${PDF}/Salam Pakistan - Sikh Heritage Trail.pdf`,
      },
      {
        title: "Welcome To Pakistan (Chinese Language)",
        image: `${IMG}/Salam Pakistan -Tourism in Pakistan (Chinese Language).png`,
        pdf: `${PDF}/Salam -Pakistan Tourism in Pakistan (Chinese Language).pdf`,
      },
      {
        title: "Welcome To Pakistan (English Language)",
        image: `${IMG}/Salam Pakistan -Tourism in Pakistan (English Language).png`,
        pdf: `${PDF}/Salam -Pakistan Tourism in Pakistan (English Language).pdf`,
      },
      {
        title: "Welcome To Pakistan (Korean Language)",
        image: `${IMG}/Salam Pakistan -Tourism in Pakistan (Korean Language).png`,
        pdf: `${PDF}/Salam -Pakistan Tourism in Pakistan (Korean Language).pdf`,
      },
      {
        title: "Mountaineering & Trekking in Pakistan",
        image: `${IMG}/Mountaineering & Trekking in Pakistan.png`,
        pdf: `${PDF}/Mountaineering and Trekking in Pakistan - Salam Pakistan.pdf`,
      },
    ],
  },
  {
    id: "maps",
    title: "Maps",
    tagline: "Islamabad, Northern areas, Eco & Taxila",
    icon: "map",
    items: [
      {
        title: "Islamabad Tourism Guide Map",
        image: `${IMG}/Islamabad Tourism Guide Map.png`,
        pdf: `${PDF}/Islamabad Tourist Map - Salam Pakistan.pdf`,
      },
      {
        title: "Northern Area Tourism Map",
        image: `${IMG}/Tourist Guide Map of Northern Pakistan.png`,
        pdf: `${PDF}/Nothern Area Tourism Map - Salam Pakistan.pdf`,
      },
      {
        title: "Ecotourism - National Parks",
        image: `${IMG}/Eco Tourism in Pakistan.png`,
        pdf: `${PDF}/Ecotourism - Salam Pakistan.pdf`,
      },
      {
        title: "Taxila Sites",
        image: `${IMG}/Taxila Sites.png`,
        pdf: `${PDF}/Taxila Sites - Salam Pakistan.pdf`,
      },
      {
        title: "Pakistan Tourist Map",
        image: `${IMG}/Pakistan Tourist Guide Map.png`,
        pdf: `${PDF}/Pakistan Tourist Guide Map Salam Pakistan.pdf`,
      },
    ],
  },
  {
    id: "standards",
    title: "National Minimum Standards & Guidelines",
    tagline: "Service standards for tourism facilities",
    icon: "standard",
    items: [
      {
        title: "Minimum Standards and Guidelines",
        image: `${IMG}/National Minimum Standards and Guidelines.png`,
        pdf: `${PDF}/National Minimum Standards and Guidelines.pdf`,
      },
    ],
  },
];
