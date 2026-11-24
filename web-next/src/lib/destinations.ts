const H = "/hero";
const I = "/hero/interest";
const S = "/hero/scenic";

export interface InterestCategory {
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Destination slugs that belong to this interest category */
  destinationSlugs: string[];
}

export interface Destination {
  slug: string;
  name: string;
  /** Parent region slug (also used as category in live URLs) */
  regionSlug: string;
  regionName: string;
  image: string;
  tagline: string;
  /** Short hero blurb */
  description: string;
  welcome: string[];
  gettingThere: string[];
  whatToDo: string[];
  whenToVisit: string[];
  whereToStay: string[];
  additionalInfo: string[];
  highlights: string[];
}

/** Live salampakistan.gov.pk interest categories (API order). Cities is footer-only. */
export const interestCategories: InterestCategory[] = [
  {
    slug: "gandhare-heritage",
    name: "Gandhare Heritage",
    description: "Buddhist monasteries, stupas and the ancient Gandhara civilisation.",
    image: `${I}/gandhare-heritage.jpg`,
    destinationSlugs: ["taxila", "peshawar", "swat-valley", "gilgit"],
  },
  {
    slug: "sufi-tourism",
    name: "Sufi Tourism",
    description: "Shrines, qawwali and the spiritual heart of Pakistan.",
    image: `${I}/sufi-tourism.jpg`,
    destinationSlugs: ["lahore", "karachi", "multan"],
  },
  {
    slug: "hindu-and-jain-temples",
    name: "Hindu and Jain Temples",
    description: "Historic temples and pilgrimage trails.",
    image: `${I}/hindu-and-jain-temples.jpg`,
    destinationSlugs: ["karachi", "lahore"],
  },
  {
    slug: "heritage-and-archaeology-sites",
    name: "Heritage and Archaeology Sites",
    description: "Forts, ruins and living heritage across the Indus lands.",
    image: `${I}/heritage-and-archaeology-sites.jpg`,
    destinationSlugs: ["lahore", "mohenjo-daro", "taxila", "peshawar"],
  },
  {
    slug: "sikh-heritage",
    name: "Sikh Heritage",
    description: "Sacred gurdwaras and pilgrimage sites across Punjab and beyond.",
    image: `${I}/sikh-heritage.jpg`,
    destinationSlugs: ["lahore", "islamabad"],
  },
  {
    slug: "top-tourist-destinations",
    name: "Top Tourist Destinations",
    description: "Pakistan's most-loved places — from mountain valleys to historic cities.",
    image: `${I}/top-tourist-destinations.jpg`,
    destinationSlugs: [
      "hunza",
      "fairy-meadows",
      "deosai-national-park",
      "lahore",
      "islamabad",
      "karachi",
      "swat-valley",
      "mohenjo-daro",
    ],
  },
  {
    slug: "beaches-and-islands",
    name: "Beaches and Islands",
    description: "Arabian Sea coastlines, islands and desert shores.",
    image: `${I}/beaches-and-islands.jpg`,
    destinationSlugs: ["karachi", "gwadar"],
  },
  {
    slug: "unesco-world-heritage-sites",
    name: "UNESCO World Heritage Sites",
    description: "Civilisations and monuments recognised by UNESCO.",
    image: `${I}/unesco-world-heritage-sites.jpg`,
    destinationSlugs: ["mohenjo-daro", "lahore", "taxila"],
  },
  {
    slug: "mountains-and-glaciers",
    name: "Mountains and Glaciers",
    description: "Home to five of the world's fourteen highest peaks and legendary glaciers.",
    image: `${I}/mountains-and-glaciers.jpg`,
    destinationSlugs: ["fairy-meadows", "hunza", "skardu", "deosai-national-park", "shigar"],
  },
  {
    slug: "valleys-and-lakes",
    name: "Valleys and Lakes",
    description: "Turquoise alpine lakes, orchard valleys and high meadows.",
    image: `${I}/valleys-and-lakes.jpg`,
    destinationSlugs: ["hunza", "skardu", "swat-valley", "khaplu-valley", "shigar"],
  },
  {
    slug: "cities",
    name: "Cities",
    description: "Pakistan's great cities — culture, food and urban energy.",
    image: `${S}/reg-islamabad-dusk.jpg`,
    destinationSlugs: ["islamabad", "lahore", "karachi", "peshawar", "gilgit", "quetta"],
  },
];

/** Categories shown in “As per your interest” (matches live Where to Go; excludes Cities). */
export const browsableInterestCategories = interestCategories.filter(
  (c) => c.slug !== "cities"
);

export const destinations: Destination[] = [
  {
    slug: "hunza",
    name: "Hunza Valley",
    regionSlug: "gilgit-baltistan",
    regionName: "Gilgit-Baltistan",
    image: `${H}/hunza-1.jpg`,
    tagline: "A fabled valley of forts, orchards and towering peaks",
    description:
      "Hunza is a mountainous valley in the northern part of Gilgit-Baltistan formed by the Hunza River, bordering Afghanistan's Wakhan Corridor to the north and Xinjiang, China to the northeast.",
    welcome: [
      "Hunza Valley is one of the most iconic and visited destinations in Gilgit-Baltistan, celebrated for its towering mountains, rivers, and centuries-old cultural heritage.",
      "The valley is surrounded by famous peaks such as Rakaposhi, Ultar Sar, and Ladyfinger Peak.",
      "Hunza features historic forts, traditional villages, and a vibrant local culture. Its diverse landscapes support rich biodiversity and eco-tourism.",
      "Visitors experience adventure, cultural exploration, and natural beauty in one region — and legendary hospitality.",
    ],
    gettingThere: [
      "Fly from Islamabad to Gilgit (weather-dependent), then drive 2–3 hours along the Karakoram Highway to Karimabad.",
      "By road: the Karakoram Highway from Islamabad via Mansehra, Besham and Gilgit (around 16–20 hours).",
      "Local jeeps and vans connect Karimabad with Passu, Attabad and Khunjerab.",
    ],
    whatToDo: [
      "Visit Baltit and Altit Forts in Karimabad.",
      "Watch sunrise from Eagle's Nest viewpoint.",
      "Boat on Attabad Lake and cross the Hussaini suspension bridge.",
      "Day trip to Khunjerab Pass on the China border.",
      "Walk Passu Glacier and photograph the Passu Cones.",
    ],
    whenToVisit: [
      "April–June: spring blossom and mild weather.",
      "July–September: peak summer — best for high passes and trekking.",
      "October: autumn colours across the orchards.",
      "Winters are cold and snowy; some high roads may close.",
    ],
    whereToStay: [
      "Hotels and guesthouses in Karimabad and Aliabad.",
      "PTDC Motel Hunza and private lodges with valley views.",
      "Campgrounds near Attabad and Passu in summer.",
    ],
    additionalInfo: [
      "Best base: Karimabad.",
      "Altitude: roughly 2,400 m in the main valley; higher on day trips.",
      "Carry cash — ATMs can be limited outside Gilgit.",
      "Respect local customs; dress modestly in villages.",
    ],
    highlights: ["Baltit & Altit Forts", "Attabad Lake", "Eagle's Nest", "Passu Cones", "Khunjerab Pass"],
  },
  {
    slug: "fairy-meadows",
    name: "Fairy Meadows",
    regionSlug: "gilgit-baltistan",
    regionName: "Gilgit-Baltistan",
    image: `${H}/hunza-9.jpg`,
    tagline: "A green balcony beneath Nanga Parbat",
    description:
      "Named by German climbers and locally known as Jauglth, Fairy Meadows is a lush alpine meadow at the foot of Nanga Parbat — the ninth-highest mountain on earth.",
    welcome: [
      "Fairy Meadows sits at about 3,300 m with unforgettable views of Nanga Parbat's Raikot Face.",
      "Pine forests, wildflower meadows and glacier vistas make it one of Pakistan's most photogenic camps.",
      "Reached by a rough jeep track and a final walk — the journey is part of the experience.",
    ],
    gettingThere: [
      "Drive the Karakoram Highway to Raikot Bridge (near Chilas).",
      "Hire a 4x4 jeep for the steep track to Tato village.",
      "Trek 2–3 hours from Tato to Fairy Meadows.",
    ],
    whatToDo: [
      "Camp overnight under clear mountain skies.",
      "Hike to Beyal Camp for closer Nanga Parbat views.",
      "Photograph sunrise and sunset on the Raikot Face.",
      "Short walks through pine forest and meadows.",
    ],
    whenToVisit: [
      "June–September is the main season.",
      "July–August offer the greenest meadows and warmest nights.",
      "Avoid late autumn and winter — snow closes the track.",
    ],
    whereToStay: [
      "Simple wooden cottages and tents at Fairy Meadows camps.",
      "Basic guesthouses in Tato if needed before the trek.",
    ],
    additionalInfo: [
      "No vehicles beyond Tato — pack light.",
      "Weather changes quickly; bring warm layers.",
      "Hire local guides and porters through registered operators.",
    ],
    highlights: ["Nanga Parbat views", "Beyal Camp hike", "Alpine camping", "Stargazing"],
  },
  {
    slug: "deosai-national-park",
    name: "Deosai National Park",
    regionSlug: "gilgit-baltistan",
    regionName: "Gilgit-Baltistan",
    image: `${H}/hunza-4.jpg`,
    tagline: "The Land of Giants — a high alpine plateau",
    description:
      "Deosai is one of the highest plateaus on earth, a vast wilderness of wildflowers, lakes and Himalayan brown bears between Skardu and Astore.",
    welcome: [
      "At roughly 4,000 m, Deosai feels like a different world — open skies, herds of marmots and Sheosar Lake's mirror surface.",
      "It is a protected national park and a haven for wildlife and landscape photography.",
    ],
    gettingThere: [
      "Access from Skardu (via Satpara) or from Astore.",
      "4x4 recommended; roads are rough and weather-dependent.",
      "Day trips from Skardu are common in peak summer.",
    ],
    whatToDo: [
      "Visit Sheosar Lake for reflections of the surrounding peaks.",
      "Wildlife spotting — marmots and, with luck, brown bears.",
      "Camping on the plateau in summer (with permits where required).",
      "Photography of wildflower meadows in July–August.",
    ],
    whenToVisit: [
      "July–September only — snow blocks access outside summer.",
      "Mid-July to mid-August is best for wildflowers.",
    ],
    whereToStay: [
      "Most visitors base in Skardu and day-trip.",
      "Seasonal camps on the plateau when permitted.",
    ],
    additionalInfo: [
      "Altitude sickness is a risk — acclimatise in Skardu first.",
      "Carry food, water and fuel; services are scarce.",
      "Follow park rules and leave no litter.",
    ],
    highlights: ["Sheosar Lake", "Alpine plateau", "Wildlife", "Wildflowers"],
  },
  {
    slug: "skardu",
    name: "Skardu",
    regionSlug: "gilgit-baltistan",
    regionName: "Gilgit-Baltistan",
    image: `${H}/hunza-4.jpg`,
    tagline: "Gateway to the world's greatest mountains",
    description:
      "Skardu is the launch point for expeditions to K2 and the Karakoram, set in a vast valley of cold deserts, alpine lakes and the Indus River.",
    welcome: [
      "Skardu combines stark beauty with warm Balti culture.",
      "From here you reach Shangrila's lakes, the Katpana Cold Desert, Shigar Fort and the trailheads of legendary treks.",
    ],
    gettingThere: [
      "Direct flights from Islamabad to Skardu (weather-dependent).",
      "Road journey along the Indus via the Karakoram Highway and Skardu Road.",
    ],
    whatToDo: [
      "Visit Upper and Lower Kachura Lakes (Shangrila).",
      "Explore Katpana Cold Desert sand dunes.",
      "Day trip to Shigar Fort and organic gardens.",
      "Start of Deosai, Hushe and K2 base-camp routes.",
    ],
    whenToVisit: [
      "May–September for most sightseeing and treks.",
      "Autumn brings clear skies and cooler temperatures.",
    ],
    whereToStay: [
      "Hotels and resorts around Skardu town and Kachura Lakes.",
      "Guesthouses in Shigar and Khaplu for valley stays.",
    ],
    additionalInfo: [
      "Book flights with flexibility — weather delays are common.",
      "Altitude: about 2,500 m in town.",
    ],
    highlights: ["Shangrila / Kachura Lakes", "Katpana Desert", "Shigar Fort", "K2 trailheads"],
  },
  {
    slug: "shigar",
    name: "Shigar Valley",
    regionSlug: "gilgit-baltistan",
    regionName: "Gilgit-Baltistan",
    image: `${H}/hunza-3.jpg`,
    tagline: "Orchards, forts and the road to the Baltoro",
    description:
      "Shigar Valley is a green oasis near Skardu, known for its restored fort-palace, apricot orchards and as a gateway toward the Baltoro Glacier.",
    welcome: [
      "Shigar blends heritage architecture with quiet village life.",
      "The restored Shigar Fort (Serena) is a highlight of Baltistan's cultural revival.",
    ],
    gettingThere: [
      "About 30–45 minutes by road from Skardu.",
      "Taxis and local vans run regularly from Skardu bazaar.",
    ],
    whatToDo: [
      "Tour Shigar Fort and the historic Amburiq Mosque.",
      "Walk through apricot and apple orchards.",
      "Visit cold springs and riverside picnic spots.",
    ],
    whenToVisit: [
      "April–October for comfortable weather and open roads.",
      "Spring blossom season is especially beautiful.",
    ],
    whereToStay: [
      "Shigar Fort Residence and local guesthouses.",
      "Day visits from Skardu are also popular.",
    ],
    additionalInfo: [
      "Ideal half-day or overnight trip from Skardu.",
      "Combine with Khaplu for a Baltistan heritage circuit.",
    ],
    highlights: ["Shigar Fort", "Amburiq Mosque", "Orchards", "Baltoro gateway"],
  },
  {
    slug: "khaplu-valley",
    name: "Khaplu Valley",
    regionSlug: "gilgit-baltistan",
    regionName: "Gilgit-Baltistan",
    image: `${H}/hunza-8.jpg`,
    tagline: "Administrative capital of Ghanche with royal heritage",
    description:
      "Khaplu is a historic town in Ghanche district, known for Khaplu Palace, serene valleys and access toward Hushe and the high Karakoram.",
    welcome: [
      "Khaplu offers a quieter Baltistan experience than Skardu.",
      "The restored palace and river landscapes make it a cultural and scenic stop.",
    ],
    gettingThere: [
      "Drive from Skardu (around 3–4 hours) via the Shyok River road.",
      "Road conditions vary — check locally before travel.",
    ],
    whatToDo: [
      "Visit Khaplu Palace and Museum.",
      "Explore riverside villages and viewpoints.",
      "Gateway for Hushe Valley treks.",
    ],
    whenToVisit: ["May–October for reliable road access and mild weather."],
    whereToStay: ["Khaplu Palace Residence and local guesthouses."],
    additionalInfo: ["Combine with Shigar for a heritage circuit of Baltistan."],
    highlights: ["Khaplu Palace", "Shyok River views", "Hushe access"],
  },
  {
    slug: "gilgit",
    name: "Gilgit",
    regionSlug: "gilgit-baltistan",
    regionName: "Gilgit-Baltistan",
    image: `${H}/hunza-2.jpg`,
    tagline: "The bustling hub of the northern mountains",
    description:
      "Gilgit is the regional capital and transport hub of Gilgit-Baltistan, where the Gilgit River meets routes toward Hunza, Skardu and Chitral.",
    welcome: [
      "Gilgit is the practical gateway to the north — markets, transport and services.",
      "Nearby sites include Kargah Buddha and viewpoints over the confluence of rivers.",
    ],
    gettingThere: [
      "Flights from Islamabad to Gilgit Airport.",
      "Karakoram Highway by road from the south.",
    ],
    whatToDo: [
      "Visit Kargah Buddha rock carving.",
      "Browse Gilgit bazaar for handicrafts and dried fruit.",
      "Use as a base for Hunza, Naltar and Phander trips.",
    ],
    whenToVisit: ["April–October for easiest travel; winters are cold with possible flight delays."],
    whereToStay: ["Hotels and guesthouses across Gilgit city."],
    additionalInfo: ["Essential stop for ATMs, SIM cards and onward jeep hire."],
    highlights: ["Kargah Buddha", "Bazaar", "Transport hub"],
  },
  {
    slug: "swat-valley",
    name: "Swat Valley",
    regionSlug: "khyber-pakhtunkhwa",
    regionName: "Khyber Pakhtunkhwa",
    image: `${H}/hunza-6.jpg`,
    tagline: "The Switzerland of Pakistan",
    description:
      "Green and gentle, Swat is a land of rivers, meadows and lakes fringed by forested hills, with a deep Buddhist and Gandharan heritage.",
    welcome: [
      "From Malam Jabba to Mahodand Lake, Swat blends soft scenery with ancient history.",
      "The Swat River valley is easy to reach from Islamabad and popular year-round.",
    ],
    gettingThere: [
      "Drive from Islamabad via the Swat Motorway (about 4–5 hours to Mingora).",
      "Continue to Kalam for the upper valley lakes and meadows.",
    ],
    whatToDo: [
      "Ski or hike at Malam Jabba.",
      "Visit Mahodand Lake and Ushu Forest near Kalam.",
      "Explore Gandharan archaeological sites and museums.",
    ],
    whenToVisit: [
      "March–June and September–October for mild weather.",
      "Winter for snow sports at Malam Jabba.",
    ],
    whereToStay: ["Hotels in Mingora, Bahrain, Kalam and Malam Jabba resorts."],
    additionalInfo: ["Popular family destination with good road access."],
    highlights: ["Malam Jabba", "Mahodand Lake", "Kalam", "Gandharan sites"],
  },
  {
    slug: "peshawar",
    name: "Peshawar",
    regionSlug: "khyber-pakhtunkhwa",
    regionName: "Khyber Pakhtunkhwa",
    image: `${H}/hunza-2.jpg`,
    tagline: "One of South Asia's oldest living cities",
    description:
      "Peshawar is a historic crossroads of the Silk Road — famous for the Qissa Khwani Bazaar, Mughal-era monuments and Gandharan museums.",
    welcome: [
      "Peshawar's old city pulses with traders, storytellers and centuries of layered history.",
      "It is a gateway to the Khyber Pass and the heritage of Gandhara.",
    ],
    gettingThere: [
      "Flights and motorway links from Islamabad.",
      "Buses and trains connect from major Pakistani cities.",
    ],
    whatToDo: [
      "Walk Qissa Khwani (Storytellers') Bazaar.",
      "Visit Mahabat Khan Mosque and Peshawar Museum.",
      "Explore Sethi House and the old walled city lanes.",
    ],
    whenToVisit: ["October–March for cooler, more comfortable sightseeing."],
    whereToStay: ["Hotels in University Town and near the cantonment."],
    additionalInfo: ["Combine with a day trip toward the Khyber Pass viewpoint (permits may apply)."],
    highlights: ["Qissa Khwani Bazaar", "Peshawar Museum", "Mahabat Khan Mosque"],
  },
  {
    slug: "lahore",
    name: "Lahore",
    regionSlug: "punjab",
    regionName: "Punjab",
    image: `${H}/hunza-5.jpg`,
    tagline: "The cultural and culinary heart of Pakistan",
    description:
      "Grand, generous and gloriously alive, Lahore is Pakistan's cultural capital — a city of Mughal monuments, bustling bazaars and legendary food.",
    welcome: [
      "Wander the Walled City, marvel at the Badshahi Mosque and Lahore Fort, and lose yourself in Food Street.",
      "Lahore rewards every kind of traveller — history lovers, foodies and culture seekers.",
    ],
    gettingThere: [
      "Fly into Allama Iqbal International Airport.",
      "Motorways and Pakistan Railways connect Lahore to Islamabad, Karachi and beyond.",
    ],
    whatToDo: [
      "Visit Badshahi Mosque and Lahore Fort (Shahi Qila).",
      "Stroll the Walled City and Delhi Gate.",
      "See Shalimar Gardens and the Lahore Museum.",
      "Eat your way through Food Street and Anarkali.",
    ],
    whenToVisit: [
      "October–March for pleasant weather.",
      "Spring festivals and winter evenings are especially lively.",
    ],
    whereToStay: [
      "Hotels from heritage properties near the Fort to modern stays in Gulberg and DHA.",
    ],
    additionalInfo: [
      "Use ride-hailing for easy city travel.",
      "Fridays and evenings are busiest at major monuments.",
    ],
    highlights: ["Badshahi Mosque", "Lahore Fort", "Walled City", "Shalimar Gardens", "Food Street"],
  },
  {
    slug: "multan",
    name: "Multan",
    regionSlug: "punjab",
    regionName: "Punjab",
    image: `${H}/hunza-10.jpg`,
    tagline: "City of Saints — blue tiles and Sufi shrines",
    description:
      "Multan is one of the world's oldest living cities, famed for Sufi shrines, blue pottery and the spiritual heart of southern Punjab.",
    welcome: [
      "The city of saints draws pilgrims and travellers to its glittering shrines and bazaars.",
      "Multan's skyline of domes and its craft traditions are unforgettable.",
    ],
    gettingThere: [
      "Flights, motorway and rail links from Lahore, Islamabad and Karachi.",
    ],
    whatToDo: [
      "Visit the Shah Rukn-e-Alam and Bahauddin Zakariya shrines.",
      "Explore Multan Fort area and local bazaars.",
      "Shop for blue pottery and mango products in season.",
    ],
    whenToVisit: ["November–February for cooler weather; summers are very hot."],
    whereToStay: ["Hotels across the city centre and newer suburbs."],
    additionalInfo: ["Dress respectfully when visiting shrines."],
    highlights: ["Shah Rukn-e-Alam", "Blue pottery", "Sufi heritage"],
  },
  {
    slug: "islamabad",
    name: "Islamabad",
    regionSlug: "islamabad",
    regionName: "Islamabad Capital Territory",
    image: `${H}/hunza-10.jpg`,
    tagline: "Pakistan's green, planned capital",
    description:
      "Islamabad is a modern, leafy capital at the foot of the Margalla Hills — museums, monuments and easy day trips to heritage sites.",
    welcome: [
      "Wide avenues, parks and the Faisal Mosque define Islamabad's calm character.",
      "It is the most convenient base for first-time visitors to Pakistan.",
    ],
    gettingThere: [
      "Islamabad International Airport serves domestic and international flights.",
      "Motorways link to Lahore, Peshawar and the north.",
    ],
    whatToDo: [
      "Visit Faisal Mosque and Pakistan Monument.",
      "Hike or picnic in the Margalla Hills (Trail 3 / Trail 5).",
      "Day trip to Taxila's archaeological sites.",
      "Explore Daman-e-Koh and Lok Virsa Museum.",
    ],
    whenToVisit: ["October–April for pleasant weather; monsoon brings lush hills."],
    whereToStay: ["Wide range of hotels in Blue Area, F-sectors and near the airport."],
    additionalInfo: ["Excellent starting point before heading north to Hunza or Swat."],
    highlights: ["Faisal Mosque", "Margalla Hills", "Pakistan Monument", "Taxila day trip"],
  },
  {
    slug: "taxila",
    name: "Taxila",
    regionSlug: "punjab",
    regionName: "Punjab",
    image: `${H}/hunza-6.jpg`,
    tagline: "A UNESCO cradle of Gandhara civilisation",
    description:
      "Taxila is a UNESCO World Heritage Site of ancient universities, stupas and monasteries from the Gandhara period — an easy day trip from Islamabad.",
    welcome: [
      "Walk among ruins that once drew scholars from across Asia.",
      "The Taxila Museum holds one of the finest Gandharan sculpture collections.",
    ],
    gettingThere: [
      "About 35–40 km from Islamabad / Rawalpindi by road.",
      "Taxis and organised day tours are readily available.",
    ],
    whatToDo: [
      "Visit the Taxila Museum.",
      "Explore Dharmarajika Stupa, Jaulian and Sirkap sites.",
      "Combine with Khanpur Lake or nearby viewpoints.",
    ],
    whenToVisit: ["October–March for cooler outdoor exploration."],
    whereToStay: ["Most visitors stay in Islamabad or Rawalpindi."],
    additionalInfo: ["Wear comfortable shoes; sites are spread out."],
    highlights: ["Taxila Museum", "Dharmarajika", "Jaulian Monastery", "UNESCO site"],
  },
  {
    slug: "karachi",
    name: "Karachi",
    regionSlug: "sindh",
    regionName: "Sindh",
    image: `${H}/hunza-7.jpg`,
    tagline: "Pakistan's largest city by the Arabian Sea",
    description:
      "Karachi is a vast port metropolis — beaches, museums, colonial architecture and some of the country's best seafood.",
    welcome: [
      "From Clifton Beach to historic Saddar, Karachi is energetic and diverse.",
      "It is Pakistan's commercial capital and a major international gateway.",
    ],
    gettingThere: [
      "Jinnah International Airport connects globally and domestically.",
      "Rail and road links to the rest of Sindh and beyond.",
    ],
    whatToDo: [
      "Walk Clifton and Sea View beaches.",
      "Visit Quaid's Mausoleum and Mohatta Palace.",
      "Explore Empress Market and Burns Road food street.",
    ],
    whenToVisit: ["November–February for milder coastal weather."],
    whereToStay: ["Hotels from Clifton and DHA to city centre business districts."],
    additionalInfo: ["Use trusted transport; the city is large — plan areas by day."],
    highlights: ["Clifton Beach", "Mazar-e-Quaid", "Mohatta Palace", "Burns Road"],
  },
  {
    slug: "mohenjo-daro",
    name: "Mohenjo-daro",
    regionSlug: "sindh",
    regionName: "Sindh",
    image: `${H}/hunza-7.jpg`,
    tagline: "A 4,500-year-old city of the Indus civilisation",
    description:
      "One of the world's earliest great urban centres, Mohenjo-daro (c. 2500 BCE) is a UNESCO World Heritage Site in Sindh.",
    welcome: [
      "Walk the advanced street grid, drainage and the Great Bath of a civilisation that flourished along the Indus millennia ago.",
      "The on-site museum helps bring the ruins to life.",
    ],
    gettingThere: [
      "Fly to Mohenjo-daro airport (limited schedules) or drive from Sukkur / Larkana.",
      "Organised heritage tours from Karachi are available.",
    ],
    whatToDo: [
      "Tour the Great Bath and citadel area.",
      "Visit the site museum.",
      "Photograph the ancient brick architecture at golden hour.",
    ],
    whenToVisit: ["November–February — summers on the plains are extremely hot."],
    whereToStay: ["Limited local options; many visitors stay in Sukkur or Larkana."],
    additionalInfo: ["Bring sun protection and water; shade is limited on site."],
    highlights: ["Great Bath", "Street grid", "Site museum", "UNESCO"],
  },
  {
    slug: "gwadar",
    name: "Gwadar",
    regionSlug: "balochistan",
    regionName: "Balochistan",
    image: `${H}/hunza-9.jpg`,
    tagline: "Arabian Sea port city of cliffs and coastline",
    description:
      "Gwadar sits on a hammerhead peninsula of Balochistan — dramatic cliffs, beaches and a growing deep-water port on the Arabian Sea.",
    welcome: [
      "Hammerhead cliffs, Koh-e-Batil views and quiet beaches define Gwadar's stark coastal beauty.",
      "It is one of Pakistan's most distinctive seaside destinations.",
    ],
    gettingThere: [
      "Flights to Gwadar Airport from major cities.",
      "Coastal highway journeys from Karachi (long but scenic).",
    ],
    whatToDo: [
      "Visit the Hammerhead and Koh-e-Batil viewpoints.",
      "Relax at nearby beaches.",
      "Watch the harbour and sunset over the Arabian Sea.",
    ],
    whenToVisit: ["October–March for pleasant coastal weather."],
    whereToStay: ["Hotels and guesthouses in Gwadar town."],
    additionalInfo: ["Check current travel advisories and local guidance before visiting."],
    highlights: ["Hammerhead cliffs", "Beaches", "Arabian Sea views"],
  },
  {
    slug: "quetta",
    name: "Quetta",
    regionSlug: "balochistan",
    regionName: "Balochistan",
    image: `${H}/hunza-9.jpg`,
    tagline: "Fruit garden of Pakistan in a highland valley",
    description:
      "Quetta, the capital of Balochistan, sits in a highland valley known for orchards, bazaars and mountain backdrops.",
    welcome: [
      "Cooler summers and fruit markets give Quetta a character unlike the plains.",
      "It is the urban gateway to exploring Balochistan.",
    ],
    gettingThere: [
      "Flights from Islamabad, Lahore and Karachi.",
      "Road and rail links via the Bolan and Quetta routes.",
    ],
    whatToDo: [
      "Visit Hanna Lake and local viewpoints.",
      "Explore bazaars for dry fruit and Balochi crafts.",
      "Day trips into surrounding valleys when conditions allow.",
    ],
    whenToVisit: ["April–October; winters can be cold with snowfall."],
    whereToStay: ["Hotels in Quetta city centre."],
    additionalInfo: ["Check local travel conditions for onward trips in Balochistan."],
    highlights: ["Hanna Lake", "Fruit bazaars", "Highland setting"],
  },
];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function getDestinationsByRegion(regionSlug: string) {
  return destinations.filter((d) => d.regionSlug === regionSlug);
}

export function getCategory(slug: string) {
  return interestCategories.find((c) => c.slug === slug);
}

export function getDestinationsForCategory(slug: string) {
  const cat = getCategory(slug);
  if (!cat) return [];
  return cat.destinationSlugs
    .map((s) => getDestination(s))
    .filter((d): d is Destination => Boolean(d));
}

/** Live URLs use interest category (or region / cities) as the category segment. */
export function destinationHref(d: Destination, categorySlug?: string) {
  const category = categorySlug || d.regionSlug;
  return `/where-to-go/category/${category}/location/${d.slug}`;
}

export function destinationTile(d: Destination, categorySlug?: string) {
  // categorySlug must not be the Array.map index — callers pass it explicitly.
  const category =
    typeof categorySlug === "string" ? categorySlug : undefined;
  return {
    title: d.name,
    subtitle: d.regionName,
    image: d.image,
    href: destinationHref(d, category),
  };
}
