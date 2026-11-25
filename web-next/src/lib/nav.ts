export interface NavChild {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const regions: { name: string; slug: string }[] = [
  { name: "Islamabad Capital Territory", slug: "islamabad" },
  { name: "Punjab", slug: "punjab" },
  { name: "Sindh", slug: "sindh" },
  { name: "Khyber Pakhtunkhwa", slug: "khyber-pakhtunkhwa" },
  { name: "Gilgit-Baltistan", slug: "gilgit-baltistan" },
  { name: "Balochistan", slug: "balochistan" },
  { name: "Azad Jammu & Kashmir", slug: "azad-kashmir" },
];

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Where to Go",
    href: "/where-to-go",
    children: regions.map((r) => ({
      label: r.name,
      href: `/where-to-go/location/${r.slug}/featured`,
    })),
  },
  { label: "What to Do", href: "/what-to-do" },
  {
    label: "Explore Pakistan",
    href: "/explore-pakistan",
    children: [
      { label: "Basic Facts of Pakistan", href: "/planning/tips" },
      { label: "Getting to Pakistan", href: "/planning/getting-here" },
      { label: "Travel within Pakistan", href: "/planning/getting-around" },
      { label: "Tourist Information Centers", href: "/planning/tic" },
      { label: "Interactive Map", href: "/map/3d-map" },
      { label: "3D Earth Map (Preview)", href: "/map/earth-3d" },
      { label: "Ask Rehbar (AI planner)", href: "/#rehbar" },
    ],
  },
  {
    label: "Bookings",
    href: "/bookings",
    children: [
      { label: "Accommodations", href: "/booking-accommodation" },
      { label: "Buses", href: "/booking-bus" },
      { label: "Flights", href: "/booking-flight" },
      { label: "Railways", href: "/booking-railway" },
      { label: "Cabs", href: "/cabs" },
    ],
  },
  { label: "Publications", href: "/publications" },
  {
    label: "Apply E-Visa",
    href: "/planning/visa",
    children: [
      { label: "Check Visa Eligibility", href: "/planning/visa" },
      {
        label: "Tourist Visa on Arrival",
        href: "https://visa.nadra.gov.pk/visa-on-arrival-tourist/",
        external: true,
      },
      {
        label: "General Tourist Visa",
        href: "https://visa.nadra.gov.pk/tourist-visa/",
        external: true,
      },
      {
        label: "Mountaineering & Trekking Visa",
        href: "https://visa.nadra.gov.pk/mountaineering-trekking/",
        external: true,
      },
    ],
  },
];

/** Matches live salampakistan.gov.pk footer city paths. */
export const footerCities: NavChild[] = [
  { label: "Islamabad", href: "/where-to-go/category/cities/location/islamabad" },
  { label: "Lahore", href: "/where-to-go/category/cities/location/lahore" },
  { label: "Karachi", href: "/where-to-go/category/cities/location/karachi" },
  { label: "Peshawar", href: "/where-to-go/category/cities/location/peshawar" },
  { label: "Gilgit", href: "/where-to-go/category/cities/location/gilgit" },
  { label: "Quetta", href: "/where-to-go/category/cities/location/quetta" },
];

/** Official provincial / regional tourism department sites (from salampakistan.gov.pk). */
export const footerProvincialDepts: NavChild[] = [
  { label: "PTDC, Islamabad", href: "https://tourism.gov.pk/", external: true },
  { label: "TDCP, Punjab", href: "https://tdcp.gop.pk/", external: true },
  { label: "STDC, Sindh", href: "https://stdc.gos.pk/", external: true },
  {
    label: "KPCTA, Khyber Pakhtunkhwa",
    href: "https://kptourism.com/",
    external: true,
  },
  {
    label: "Directorate of Tourism, Balochistan",
    href: "http://tourismbalochistan.gob.pk/",
    external: true,
  },
  {
    label: "Tourism & Culture Dept, Gilgit-Baltistan",
    href: "https://visitgilgitbaltistan.gov.pk/",
    external: true,
  },
  {
    label: "Tourism & Archaeology Dept, Azad Jammu & Kashmir",
    href: "https://ajktourism.gov.pk/",
    external: true,
  },
];

export const footerNav: { title: string; links: NavChild[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Where to Go", href: "/where-to-go" },
      { label: "What to Do", href: "/what-to-do" },
      { label: "Events", href: "/event" },
      { label: "Interactive Map", href: "/map/3d-map" },
      { label: "Publications", href: "/publications" },
    ],
  },
  {
    title: "Cities",
    links: footerCities,
  },
  {
    title: "Travel info",
    links: [
      { label: "Basic Facts", href: "/planning/tips" },
      { label: "Getting to Pakistan", href: "/planning/getting-here" },
      { label: "Travel within Pakistan", href: "/planning/getting-around" },
      { label: "Apply E-Visa", href: "/planning/visa" },
      { label: "Tourist Info Centers", href: "/planning/tic" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Accommodations", href: "/booking-accommodation" },
      { label: "Buses", href: "/booking-bus" },
      { label: "Flights", href: "/booking-flight" },
      { label: "Railways", href: "/booking-railway" },
      { label: "Cabs", href: "/cabs" },
    ],
  },
  {
    title: "Provincial/Regional Tourism Departments",
    links: footerProvincialDepts,
  },
  {
    title: "About",
    links: [
      { label: "About PTDC", href: "/about" },
      { label: "Publications", href: "/publications" },
      { label: "Traveller Support", href: "/about" },
    ],
  },
];
