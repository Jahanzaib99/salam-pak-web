/**
 * Clickable hotspots for the illustrated PTDC maps.
 *
 * These maps are isometric artwork, not geographic projections, so their pin
 * positions cannot be derived from lat/lng — the markers are drawn where the
 * illustrator put them. Each entry below is the position of a marker already
 * printed into the artwork, as a percentage of the FULL image (including the
 * legend panel), with `y` at the teardrop's tip where it meets the ground.
 *
 * Coordinates were measured by detecting the marker glyphs in the source JPEGs
 * (tools/detect-map-pins.js) rather than placed by eye. If the artwork is ever
 * re-exported, re-run that script; do not nudge these by hand.
 *
 * `n` is the number printed inside the marker, matching the legend on the
 * artwork. `slug` links to a /location API record when one exists — that record
 * supplies the photo, description and destination link. `blurb` is the local
 * fallback used when there is no API record (roughly two thirds of the
 * Islamabad list), so no pin is ever a dead click.
 */

export interface MapHotspot {
  /** Number printed inside the marker on the artwork. */
  n: number;
  /** Percentage of full image width. */
  x: number;
  /** Percentage of full image height, at the marker's tip. */
  y: number;
  name: string;
  /** /location slug, when the CMS has a matching record. */
  slug?: string;
  /** Local fallback copy, used when `slug` is absent or the API is down. */
  blurb: string;
  /**
   * Printed glyph size in source pixels, when it differs from the tab's
   * default (the Sikh map draws its border markers smaller than its gurdwara
   * ones). Used to size the ring so it sits on the glyph, not around it.
   */
  gw?: number;
  gh?: number;
}

export const ISLAMABAD_HOTSPOTS: MapHotspot[] = [
  { n: 1, x: 60.727, y: 70.958, name: 'Rawat Fort', blurb: 'A 16th-century Gakhar fort on the Grand Trunk Road, holding the tomb of Sultan Sarang Khan.' },
  { n: 2, x: 64.351, y: 59.917, name: 'Pharwala Fort', blurb: '15th-century Gakhar stronghold on the Soan River, reached through the Margalla foothills east of the city.' },
  { n: 3, x: 64.934, y: 53.083, name: 'Neela Sandh Waterfall', blurb: 'A cluster of pools and falls in the Kahuta hills, popular for day hikes and picnics.' },
  { n: 4, x: 70.768, y: 47.375, name: 'Chattar Park', blurb: 'Shaded picnic park with a stream and waterslides, on the old Murree road.' },
  { n: 5, x: 45.558, y: 65.958, name: 'Eye View Park — Bahria Town', blurb: 'Landscaped viewing park in Bahria Town, south of the twin cities.' },
  { n: 6, x: 60.001, y: 42.167, name: 'Shahdara Point', slug: 'shahdara-valley', blurb: 'A wooded valley and stream at the eastern edge of the Margalla Hills, lined with open-air cafes.' },
  { n: 7, x: 59.372, y: 39.333, name: 'Shumber Waterfall', blurb: 'A seasonal fall deep in the Margalla range, reached on foot from Shahdara.' },
  { n: 8, x: 54.076, y: 37.750, name: 'Bruti Waterfall', slug: 'bruti-waterfall', blurb: 'A hidden waterfall in the northern Margallas, reached by a steep trail from Bruti village.' },
  { n: 9, x: 55.536, y: 43.000, name: 'Shrine of Hazrat Bari Imam Sarkar', slug: 'bari-imam-darbar', blurb: 'The 17th-century shrine of Islamabad’s patron saint at Noorpur Shahan, below the Margallas.' },
  { n: 10, x: 49.995, y: 40.125, name: 'Loh-e-Dandi', blurb: 'A ridge viewpoint above the Margalla trails, looking north into the hills.' },
  { n: 11, x: 33.815, y: 35.708, name: 'Pir Sohawa City View Point', slug: 'pir-sohawa', blurb: 'A hilltop terrace 17 km above the city, with restaurants overlooking the whole capital.' },
  { n: 12, x: 30.206, y: 34.833, name: 'Margalla Hills National Park', slug: 'margalla-hills', blurb: 'The forested range along the city’s northern edge, threaded with numbered walking trails.' },
  { n: 13, x: 27.298, y: 35.667, name: 'Losar Baoli — Losar Stepwell', blurb: 'A Mughal-era stepwell on the Taxila road, once a caravan watering stop.' },
  { n: 14, x: 24.041, y: 37.625, name: 'Sadhu ka Bagh — Shah Allah Ditta Caves', blurb: 'Caves and a spring-fed garden used by Buddhist monks and later Hindu sadhus, on a pre-Mughal trade route.' },
  { n: 15, x: 18.637, y: 39.250, name: 'Zipline Margalla Hills (Sadhu’s)', blurb: 'A zipline course strung across the western Margalla slopes above Shah Allah Ditta.' },
  { n: 16, x: 13.483, y: 46.500, name: 'Golra Sharif Railway Museum', slug: 'golra-sharif-railway-museum', blurb: 'A working Victorian junction turned museum, with royal saloon carriages and colonial-era signalling gear.' },
  { n: 17, x: 18.642, y: 56.333, name: 'National Science and Technology Park (NSTP)', blurb: 'Pakistan’s flagship technology park on the NUST campus in the city’s west.' },
  { n: 18, x: 38.173, y: 50.708, name: 'Kachnar Park CDA', blurb: 'A large neighbourhood park in I-8 with sports grounds and walking loops.' },
  { n: 19, x: 50.969, y: 56.083, name: 'Pakistan Museum of Natural History', blurb: 'Founded 1976; galleries of fossils, minerals and the wildlife of Pakistan.' },
  { n: 20, x: 53.072, y: 50.625, name: 'Ankara Park', blurb: 'A compact family park near the Shakarparian ridge, gifted in the name of Pakistan–Turkey friendship.' },
  { n: 21, x: 48.328, y: 48.833, name: 'Shakarparian National Park', blurb: 'A wooded ridge between Islamabad and Rawalpindi with terraced gardens and city viewpoints.' },
  { n: 22, x: 49.964, y: 50.042, name: 'Star and Crescent Monument at Shakarparian', blurb: 'A large star-and-crescent sculpture on the Shakarparian heights.' },
  { n: 23, x: 47.414, y: 50.542, name: 'Pakistan Monument', slug: 'pakistan-monument', blurb: 'Four granite petals on the Shakarparian ridge representing the provinces, with a museum alongside.' },
  { n: 24, x: 46.567, y: 46.333, name: 'Rose and Jasmine Garden', blurb: 'A formal garden that hosts the capital’s annual flower show each spring.' },
  { n: 25, x: 49.775, y: 46.667, name: 'Jinnah Stadium', blurb: 'The national sports complex in Sector G-5, home to athletics, hockey and football.' },
  { n: 26, x: 51.269, y: 44.083, name: 'Jinnah Convention Centre', slug: 'jinnah-convention-centre', blurb: 'The capital’s main conference venue, on the Shakarparian side of the Red Zone.' },
  { n: 27, x: 53.468, y: 45.208, name: 'Lake View Park (Rawal Lake)', slug: 'rawal-lake', blurb: 'A long lakeside park on Rawal Lake with boating, gardens and an adventure zone.' },
  { n: 28, x: 56.904, y: 45.125, name: 'Bird Aviary — Lake View Park', blurb: 'A walk-through aviary inside Lake View Park, with parrots, pheasants and waterfowl.' },
  { n: 29, x: 53.966, y: 47.000, name: 'F-1 TRAXX Park', blurb: 'Go-karting and motorsport track beside Lake View Park.' },
  { n: 30, x: 59.557, y: 47.625, name: 'Rawal Dam', blurb: 'The 1962 earth-fill dam that forms Rawal Lake and supplies Rawalpindi’s water.' },
  { n: 31, x: 43.884, y: 44.125, name: 'President House', blurb: 'Aiwan-e-Sadr, the presidential residence in the Red Zone — viewed from outside only.' },
  { n: 32, x: 42.873, y: 42.625, name: 'Supreme Court of Pakistan', blurb: 'Kenzo Tange’s modernist court building on Constitution Avenue.' },
  { n: 33, x: 41.431, y: 42.833, name: 'National Assembly of Pakistan', blurb: 'The parliament building on Constitution Avenue, also by Kenzo Tange.' },
  { n: 34, x: 40.115, y: 41.625, name: 'National Archives of Pakistan', blurb: 'The state repository of records and manuscripts, in the government enclave.' },
  { n: 35, x: 41.811, y: 45.917, name: 'Sir Syed Memorial Museum', blurb: 'A museum and library in G-5 devoted to Sir Syed Ahmad Khan and the Aligarh movement.' },
  { n: 36, x: 35.551, y: 43.250, name: 'Dinosaur Park', blurb: 'Life-size dinosaur models set along a walking trail in F-9 Park.' },
  { n: 37, x: 36.944, y: 41.875, name: 'Marghazar Zoo', blurb: 'The former Islamabad Zoo site at the foot of the Margallas, now a wildlife rescue and conservation centre.' },
  { n: 38, x: 38.216, y: 41.958, name: 'Saidpur Village & Old Hindu Temple', slug: 'saidpur-village', blurb: 'A restored Mughal-era village on the hillside, with a Hindu temple, Sikh gurdwara and craft shops.' },
  { n: 39, x: 34.599, y: 39.042, name: 'Daman-e-Koh Park & City View Point', slug: 'daman-e-koh', blurb: 'The classic terrace viewpoint halfway up the Margallas, looking straight down over Faisal Mosque.' },
  { n: 40, x: 32.291, y: 43.583, name: 'Faisal Mosque', slug: 'faisal-mosque', blurb: 'Vedat Dalokay’s tent-shaped mosque at the foot of the Margallas — the largest in Pakistan.' },
  { n: 41, x: 33.657, y: 46.208, name: 'Centaurus Mall', slug: 'the-centaurus-mall', blurb: 'The capital’s landmark three-tower retail and hotel complex in Blue Area.' },
  { n: 42, x: 30.490, y: 46.125, name: 'Fatima Jinnah / Capital / F-9 Park', slug: 'fatima-jinnah-park', blurb: 'Islamabad’s largest urban park, filling the whole of Sector F-9.' },
  { n: 43, x: 30.471, y: 42.750, name: 'Islamabad Golf Club', blurb: 'An 18-hole course laid out along the Margalla foothills in Sector H-8.' },
  { n: 44, x: 34.754, y: 47.583, name: 'St. Thomas’ Church', blurb: 'A long-standing Anglican church serving the capital’s Christian community.' },
  { n: 45, x: 6.644, y: 60.667, name: 'Islamabad International Airport', blurb: 'The country’s newest international gateway, opened 2018 west of the city.' },
];

export const GURDWARA_HOTSPOTS: MapHotspot[] = [
  { n: 1, x: 43.580, y: 76.908, name: 'Gurdwara Baba Guru Nanak (Nankana Sahib)', slug: 'nankana-sahib', blurb: 'The birthplace of Guru Nanak and the holiest Sikh site in Pakistan, drawing pilgrims from across the world.' },
  { n: 2, x: 50.044, y: 73.289, name: 'Gurdwara Janam Asthan Guru Ram Das (Lahore)', slug: 'gurdwara-janam-asthan-guru-ram-das-jee', blurb: 'Marks the birthplace of Guru Ram Das, the fourth Sikh Guru, in Lahore’s walled city.' },
  { n: 3, x: 46.961, y: 70.771, name: 'Gurdwara Dera Sahib (Lahore)', slug: 'gurdwara-dera-sahib', blurb: 'Built where Guru Arjan Dev was martyred in 1606, facing the Lahore Fort across the Hazuri Bagh.' },
  { n: 4, x: 55.751, y: 58.851, name: 'Gurdwara Darbar Sahib (Kartarpur)', slug: 'gurdwara-darbar-sahib-kartarpur', blurb: 'Where Guru Nanak spent his final years; reachable from India via the visa-free Kartarpur Corridor.' },
  { n: 5, x: 47.620, y: 60.189, name: 'Gurdwara Rori Sahib (Gujranwala)', slug: 'gurdwara-rori-sahib-jee', blurb: 'Commemorates Guru Nanak’s stay at Eminabad, where he sat on a bed of pebbles — *rori*.' },
  { n: 6, x: 45.467, y: 61.408, name: 'Gurdwara Chakki Sahib (Gujranwala)', slug: 'gurdwara-chakki-sahib-jee', blurb: 'Marks the spot at Eminabad where Guru Nanak was made to grind grain during Babur’s invasion.' },
  { n: 7, x: 40.626, y: 64.988, name: 'Gurdwara Sacha Sauda (Farooqabad)', slug: 'gurdwara-sacha-sauda', blurb: 'Where the young Guru Nanak spent his father’s money feeding holy men — the “true bargain”.' },
  { n: 8, x: 40.248, y: 57.907, name: 'Gurdwara Chowa Sahib', slug: 'gurdwara-chowa-sahib', blurb: 'Beside Rohtas Fort in the Jhelum district, built at a spring said to have been drawn out by Guru Nanak.' },
  { n: 9, x: 31.470, y: 57.435, name: 'Gurdwara Tilla Jogian', blurb: 'On the 975 m Tilla Jogian peak in the Salt Range, an ancient yogic retreat visited by Guru Nanak.' },
  { n: 10, x: 23.837, y: 46.381, name: 'Gurdwara Panja Sahib (Hassan Abdal)', slug: 'gurdwara-punja-sahib', blurb: 'Home to a boulder bearing what is revered as Guru Nanak’s handprint, and a major Baisakhi pilgrimage site.' },

  // Border crossings — same artwork, brown markers, drawn smaller (67x95)
  // than the gold gurdwara markers (83x119).
  { n: 101, x: 58.908, y: 62.746, gw: 67, gh: 95, name: 'Kartarpur Corridor', blurb: 'The visa-free pilgrim crossing linking Dera Baba Nanak in India to Kartarpur, opened in 2019.' },
  { n: 102, x: 52.883, y: 76.987, gw: 67, gh: 95, name: 'Wagah–Attari Border', blurb: 'The main road crossing between Pakistan and India, famed for its evening flag-lowering ceremony.' },
  { n: 103, x: 46.459, y: 80.448, gw: 67, gh: 95, name: 'Ganda Singh Wala Border', blurb: 'A Kasur-district crossing on the historic route towards Ferozepur.' },
];

/* ---- Pakistan Tourist Attractions Map (71) and Buddhist Heritage Trail (33) ----
   Coordinates measured by tools/detect-map-pins.js; numbers read from its
   contact sheets and matched to each map's printed legend. */

export const PAKISTAN_HOTSPOTS: MapHotspot[] = [
  { n: 1, x: 67.735, y: 13.872, name: 'Khunjerab Pass', blurb: 'At 4,693 m the highest paved border crossing on earth, where the Karakoram Highway enters China.' },
  { n: 2, x: 65.665, y: 14.346, name: 'Attabad Lake', blurb: 'A startling turquoise lake formed by a 2010 landslide that dammed the Hunza River.' },
  { n: 3, x: 59.956, y: 13.397, name: 'Baltit Fort', slug: 'baltit-fort', blurb: 'An 8th-century fort above Karimabad, restored and open as a museum of Hunza history.' },
  { n: 4, x: 73.813, y: 16.196, name: 'K2', blurb: 'At 8,611 m the second-highest mountain on earth, and the hardest of the 8,000ers to climb.' },
  { n: 5, x: 74.196, y: 21.395, name: 'K2 Base Camp', blurb: 'The trek up the Baltoro Glacier to Concordia and K2 Base Camp — one of the great Himalayan walks.' },
  { n: 6, x: 69.374, y: 18.17, name: 'Shangrila Skardu', slug: 'skardu', blurb: 'The "Heaven on Earth" resort beside Lower Kachura Lake, a short drive from Skardu.' },
  { n: 7, x: 67.352, y: 20.82, name: 'Deosai Plains', slug: 'deosai-national-park', blurb: 'The world’s second-highest plateau at 4,114 m, carpeted with wildflowers and home to the Himalayan brown bear.' },
  { n: 8, x: 70.251, y: 22.144, name: 'Sharda Peeth Temple', slug: 'sharada-peeth', blurb: 'A ruined 8th-century temple and university in the Neelum Valley, once a great centre of Sanskrit learning.' },
  { n: 9, x: 67.084, y: 24.044, name: 'Neelum Valley', slug: 'neelum-valley', blurb: 'A long green river valley in Azad Kashmir, lined with forested villages and waterfalls.' },
  { n: 10, x: 60.553, y: 18.52, name: 'Saif ul Malook & Ansoo Lake', slug: 'saiful-muluk', blurb: 'Two alpine lakes above Naran — one famed for its legend, the other shaped like a teardrop.' },
  { n: 11, x: 54.291, y: 14.996, name: 'Shandur Polo Festival', slug: 'shandur-lake', blurb: 'Free-style polo played each July on Shandur Pass at 3,700 m, the highest polo ground in the world.' },
  { n: 12, x: 65.01, y: 16.671, name: 'Nanga Parbat', slug: 'nanga-parbat', blurb: 'The 8,126 m "Killer Mountain", ninth-highest on earth, with the vast Rupal Face on its south side.' },
  { n: 13, x: 53.517, y: 19.32, name: 'Kalash Valley', slug: 'kalash-valley', blurb: 'Three Chitral valleys home to the Kalash people, who keep their own religion, dress and festivals.' },
  { n: 14, x: 55.344, y: 20.895, name: 'Malam Jabba Ski Resort', blurb: 'Pakistan’s main ski resort, on a Swat hillside at 2,800 m.' },
  { n: 15, x: 58.593, y: 22.444, name: 'Tea Plantation Shinkiari', blurb: 'The National Tea Research Institute’s plantation near Mansehra — Pakistan’s only tea estate.' },
  { n: 16, x: 52.258, y: 22.419, name: 'Buddha of Swat', blurb: 'The 7th-century Jahanabad Buddha carved into a cliff above the Swat Valley.' },
  { n: 17, x: 57.008, y: 23.444, name: 'Khanpur Dam & Sajikot Waterfalls', slug: 'khanpur', blurb: 'A reservoir near Taxila popular for watersports, with the Sajikot falls close by.' },
  { n: 18, x: 52.015, y: 24.419, name: 'Khyber Pass', slug: 'khyber-pass', blurb: 'The historic gateway between Pakistan and Afghanistan, cut through the Spin Ghar mountains.' },
  { n: 19, x: 55.545, y: 24.744, name: 'Taxila Stupa', blurb: 'The Dharmarajika stupa complex at Taxila, a UNESCO World Heritage Site.' },
  { n: 20, x: 62.702, y: 26.568, name: 'Pakistan Monument', slug: 'pakistan-monument', blurb: 'Four granite petals on Islamabad’s Shakarparian ridge representing the provinces.' },
  { n: 21, x: 68.369, y: 27.218, name: 'Muzaffarabad', slug: 'muzaffarabad', blurb: 'The capital of Azad Kashmir, set where the Neelum and Jhelum rivers meet.' },
  { n: 22, x: 65.061, y: 28.693, name: 'Naluchi Bridge', blurb: 'A landmark cable-stayed bridge over the Neelum River at Muzaffarabad.' },
  { n: 23, x: 63.208, y: 28.918, name: 'Centaurus Mall', slug: 'the-centaurus-mall', blurb: 'Islamabad’s landmark three-tower retail and hotel complex in Blue Area.' },
  { n: 24, x: 57.954, y: 28.043, name: 'Faisal Mosque', slug: 'faisal-mosque', blurb: 'The tent-shaped mosque at the foot of the Margallas — the largest in Pakistan.' },
  { n: 25, x: 53.455, y: 29.668, name: 'Katas Raj Temples', slug: 'katas-raj-temples', blurb: 'A complex of Hindu temples around a sacred pool on the Potohar Plateau.' },
  { n: 26, x: 57.01, y: 31.542, name: 'Khewra Salt Mine', slug: 'khewra-salt-mine', blurb: 'The world’s second-largest salt mine, worked since the time of Alexander.' },
  { n: 27, x: 60.09, y: 30.492, name: 'Rohtas Fort', slug: 'rohtas-fort', blurb: 'Sher Shah Suri’s vast 16th-century garrison fort, a UNESCO World Heritage Site.' },
  { n: 28, x: 58.475, y: 35.341, name: 'Hiran Minar', slug: 'hiran-minar', blurb: 'A Mughal hunting complex built by Jahangir around a tank and a tower raised to his pet antelope.' },
  { n: 29, x: 67.266, y: 33.092, name: 'Kartarpur Sahib', slug: 'gurdwara-darbar-sahib-kartarpur', blurb: 'Where Guru Nanak spent his final years, reachable from India via the visa-free corridor.' },
  { n: 30, x: 65.233, y: 34.441, name: 'Shahi Qila & Badshahi Mosque', blurb: 'Lahore Fort and the 1673 Badshahi Mosque, facing each other across the Hazuri Bagh.' },
  { n: 31, x: 66.211, y: 40.24, name: 'Minar-e-Pakistan', blurb: 'The tower marking where the 1940 Lahore Resolution called for a separate Muslim state.' },
  { n: 32, x: 59.363, y: 38.515, name: 'Clock Tower Faisalabad', slug: 'clock-tower', blurb: 'The colonial clock tower at the centre of Faisalabad’s eight bazaars, laid out as a Union Jack.' },
  { n: 33, x: 54.873, y: 33.492, name: 'Amb Sharif Temples', blurb: 'A ruined 9th-century Hindu Shahi temple complex in the Salt Range.' },
  { n: 34, x: 57.437, y: 39.19, name: 'Power Plant', blurb: 'One of the large thermal power stations of central Punjab.' },
  { n: 35, x: 63.409, y: 44.314, name: 'Harappa', slug: 'harappa', blurb: 'A principal city of the Indus Valley Civilisation, occupied from around 3300 BCE.' },
  { n: 36, x: 59.78, y: 45.664, name: 'Cathedral of the Holy Redeemer', blurb: 'Lahore’s Roman Catholic cathedral, consecrated in 1907.' },
  { n: 37, x: 52.662, y: 45.414, name: 'Tomb of Shah Rukn-e-Alam', slug: 'tomb-of-shah-rukn-e-alam', blurb: 'A masterpiece of Tughluq architecture in Multan, built between 1320 and 1324.' },
  { n: 38, x: 59.151, y: 51.712, name: 'Noor Mahal', blurb: 'An 1875 Italianate palace built by the Nawab of Bahawalpur.' },
  { n: 39, x: 53.357, y: 52.912, name: 'Uch Sharif', slug: 'uch-sharif', blurb: 'A very old town of tiled Sufi shrines and tombs near Bahawalpur.' },
  { n: 40, x: 54.484, y: 55.086, name: 'Derawar Fort', slug: 'derawar-fort', blurb: 'Forty vast bastions rising out of the Cholistan Desert, visible for miles.' },
  { n: 41, x: 48.173, y: 57.986, name: 'Cholistan Desert', slug: 'cholistan', blurb: 'The rolling desert south of Bahawalpur, home to the Cholistan Jeep Rally.' },
  { n: 42, x: 41.867, y: 64.159, name: 'Mohenjo-daro', slug: 'mohenjo-daro', blurb: 'One of the best-preserved Indus Valley cities, built around 2500 BCE.' },
  { n: 43, x: 42.051, y: 42.764, name: 'Quaid-e-Azam Residency', slug: 'quaid-e-azam-residency', blurb: 'The wooden hill residency at Ziarat where Muhammad Ali Jinnah spent his last months.' },
  { n: 44, x: 35.669, y: 44.564, name: 'Hanna Lake', slug: 'hanna-lake', blurb: 'A turquoise lake in the hills just outside Quetta, ringed by pine.' },
  { n: 45, x: 37.913, y: 47.913, name: 'Pir Ghaib Waterfalls', slug: 'pir-ghaib', blurb: 'Springs and falls in the Bolan Pass, a green break in the Balochistan rock.' },
  { n: 46, x: 33.175, y: 48.338, name: 'Quetta', slug: 'quetta', blurb: 'The capital of Balochistan, ringed by mountains and known for its orchards.' },
  { n: 47, x: 27.628, y: 52.487, name: 'Reko Diq', blurb: 'One of the world’s largest undeveloped copper and gold deposits, in Chagai District.' },
  { n: 48, x: 11.51, y: 53.987, name: 'Mud Volcanoes', blurb: 'Cones of cold mud along the Makran coast, including the Chandragup pilgrimage site.' },
  { n: 49, x: 23.789, y: 58.335, name: 'Golden Desert', blurb: 'The dune country of southern Balochistan.' },
  { n: 50, x: 26.147, y: 61.935, name: 'Moola Chotok', slug: 'moola-chotok', blurb: 'A hidden canyon oasis of pools and waterfalls in the Khuzdar hills.' },
  { n: 51, x: 27.171, y: 69.083, name: 'Ranikot Fort', slug: 'ranikot', blurb: 'The "Great Wall of Sindh" — a fort whose ramparts run for some 30 km.' },
  { n: 52, x: 33.255, y: 70.232, name: 'Clock Tower Hyderabad', blurb: 'The 1914 Tower Market clock tower at the heart of old Hyderabad.' },
  { n: 53, x: 38.671, y: 74.256, name: 'Bootar Lake', blurb: 'A quiet lake in the Sindh interior, popular for winter birdlife.' },
  { n: 54, x: 44.412, y: 82.204, name: 'Makli Necropolis', slug: 'makli-hill', blurb: 'One of the largest funerary sites in the world, at Thatta — a UNESCO World Heritage Site.' },
  { n: 55, x: 48.988, y: 79.805, name: 'Gori Temple', slug: 'gori-temple', blurb: 'A 14th-century Jain temple in Tharparkar, famous for its painted interior.' },
  { n: 56, x: 50.492, y: 84.579, name: 'Nagarparkar Temples', slug: 'nagar-parkar', blurb: 'Jain temples of the Karoonjhar hills on the edge of the Thar Desert.' },
  { n: 57, x: 46.488, y: 85.179, name: 'Coal Mines', blurb: 'The Thar coalfield, one of the largest lignite reserves in the world.' },
  { n: 58, x: 34.614, y: 81.305, name: 'Frere Hall', blurb: 'An 1865 Venetian-Gothic hall in Karachi, with a Sadequain ceiling mural.' },
  { n: 59, x: 27.716, y: 85.004, name: 'Keamari Fish Harbour', blurb: 'Karachi’s working fish harbour, busiest on the Arabian Sea coast.' },
  { n: 60, x: 26.77, y: 81.405, name: 'Clifton Beach', slug: 'clifton-beach', blurb: 'Karachi’s long city beach on the Arabian Sea.' },
  { n: 61, x: 22.269, y: 82.954, name: 'Hawke’s Bay Beach', blurb: 'A quieter Karachi beach where green turtles come ashore to nest.' },
  { n: 62, x: 17.511, y: 80.43, name: 'Paradise Point & French Beach', blurb: 'A natural rock arch and a clear-water beach west of Karachi.' },
  { n: 63, x: 19.904, y: 78.43, name: 'Princess of Hope', slug: 'princess-of-hope', blurb: 'A wind-carved rock figure on the Makran Coastal Highway in Hingol National Park.' },
  { n: 64, x: 17.986, y: 75.981, name: 'Sphinx of Balochistan', blurb: 'A natural rock formation on the Makran coast with an uncanny resemblance to a sphinx.' },
  { n: 65, x: 12.97, y: 74.456, name: 'Hingol National Park', blurb: 'Pakistan’s largest national park — desert, mountains and coast on the Makran shore.' },
  { n: 66, x: 23.351, y: 74.456, name: 'Gondrani Cave City', slug: 'gondrani-cave-city', blurb: 'Hundreds of rooms cut into a cliff near Bela, likely a Buddhist settlement.' },
  { n: 67, x: 3.95, y: 81.28, name: 'Gwadar', slug: 'gwadar', blurb: 'A deep-water port on the Makran coast, below the hammerhead of Koh-e-Batil.' },
  { n: 68, x: 7.663, y: 81.805, name: 'Astola Island', slug: 'astola-island', blurb: 'Pakistan’s largest offshore island and its first Marine Protected Area.' },
  { n: 69, x: 25.552, y: 89.378, name: 'Churna Island', slug: 'churna-island', blurb: 'A small rocky island off Mubarak Village, the country’s main scuba diving spot.' },
  { n: 70, x: 46.256, y: 46.838, name: 'Bolan Pass', slug: 'bolan-pass', blurb: 'The historic route from the Indus plains up into Balochistan, followed by road and railway.' },
  { n: 71, x: 49.185, y: 28.568, name: 'Parachinar', blurb: 'The green highland town of Kurram, close to the Afghan border.' },
];

export const GANDHARA_HOTSPOTS: MapHotspot[] = [
  { n: 1, x: 12.612, y: 46.099, name: 'Sphola Stupa', blurb: 'A Kushan-era stupa above the Khyber Pass road near Landi Kotal.' },
  { n: 2, x: 13.326, y: 48.574, name: 'Peshawar Museum', blurb: 'Holds the world’s finest collection of Gandharan Buddhist sculpture.' },
  { n: 3, x: 19.466, y: 51.99, name: 'Gor Khatri', blurb: 'A walled caravanserai on Peshawar’s highest point, layered with 2,000 years of occupation.' },
  { n: 4, x: 25.058, y: 44.753, name: 'Shahbaz Garhi Rock Edicts', blurb: 'Ashoka’s 3rd-century BCE edicts carved in Kharosthi on boulders near Mardan.' },
  { n: 5, x: 23.949, y: 42.944, name: 'Takht-i-Bahi', slug: 'takht-i-bahi', blurb: 'A hilltop Buddhist monastery near Mardan and a UNESCO World Heritage Site.' },
  { n: 6, x: 28.124, y: 41.916, name: 'Jamal Garhi', blurb: 'A 1st-century hilltop monastery in Mardan district, rich in Gandharan relief.' },
  { n: 7, x: 29.86, y: 38.283, name: 'Ghalagay Rock Carving', blurb: 'Rock-cut Buddha figures beside the road into the Swat Valley.' },
  { n: 8, x: 30.431, y: 35.866, name: 'Swat Museum', blurb: 'Gandharan sculpture from the Swat Valley, displayed at Saidu Sharif.' },
  { n: 9, x: 33.203, y: 33.391, name: 'Jahanabad Buddha', blurb: 'A 7th-century seated Buddha carved into a cliff above Swat, restored after damage in 2007.' },
  { n: 10, x: 32.726, y: 36.995, name: 'Butkara Stupa', slug: 'butkara-stupa', blurb: 'One of the oldest Buddhist sites in Swat, founded under the Mauryas.' },
  { n: 11, x: 31.54, y: 38.964, name: 'Shingardar Stupa', slug: 'shingardar-stupa', blurb: 'A large dome-shaped stupa beside the road at Ghalegay in Swat.' },
  { n: 12, x: 33.201, y: 41.019, name: 'Amluk Dara Stupa', slug: 'amluk-dara-stupa', blurb: 'A tall, well-preserved stupa below Mount Ilam in Swat.' },
  { n: 13, x: 30.233, y: 41.366, name: 'Gumbat Stupa', slug: 'gumbat-stupa', blurb: 'A rare surviving domed Gandharan shrine in the Kandak valley.' },
  { n: 14, x: 34.055, y: 43.711, name: 'Ranigat', blurb: 'An extensive hilltop Buddhist site in Buner, also called the Queen’s Rock.' },
  { n: 15, x: 37.984, y: 53.495, name: 'Sirsukh', blurb: 'The last of Taxila’s three ancient cities, founded by the Kushans.' },
  { n: 16, x: 41.124, y: 49.92, name: 'Bhamala Stupa', blurb: 'A cross-shaped stupa near Khanpur Dam, with a 48 m reclining Buddha.' },
  { n: 17, x: 42.954, y: 52.106, name: 'Jinan Wali Dheri', blurb: 'A Taxila monastery whose excavation uncovered rare Buddhist wall paintings.' },
  { n: 18, x: 39.509, y: 55.565, name: 'Badalpur Stupa', blurb: 'A stupa and monastery complex on the northern edge of the Taxila valley.' },
  { n: 19, x: 42.438, y: 55.42, name: 'Mohra Muradu', slug: 'mohra-muradu', blurb: 'A monastery in a Taxila valley, keeping a finely modelled votive stupa.' },
  { n: 20, x: 44.301, y: 54.161, name: 'Pipplan Stupa', blurb: 'Monastic remains beside Jaulian on the Taxila plateau.' },
  { n: 21, x: 46.804, y: 55.42, name: 'Jaulian', slug: 'jaulian-buddhist-monastery', blurb: 'The best-preserved monastery at Taxila, with stucco Buddhas around its main stupa.' },
  { n: 22, x: 43.352, y: 57.809, name: 'Sirkap', blurb: 'A Greek-planned grid city at Taxila, built by the Indo-Greeks in the 2nd century BCE.' },
  { n: 23, x: 44.458, y: 58.807, name: 'Taxila Museum', slug: 'taxila-museum', blurb: 'A superb collection of Gandharan art drawn from the Taxila excavations.' },
  { n: 24, x: 46.666, y: 58.851, name: 'Dharmarajika Stupa', slug: 'dharmarajika-stupa-and-monastery', blurb: 'The great stupa of Taxila, said to have been raised by Ashoka over relics of the Buddha.' },
  { n: 25, x: 45.832, y: 60.863, name: 'Bhir Mound', blurb: 'The earliest of Taxila’s cities, dating from the 6th century BCE.' },
  { n: 26, x: 50.625, y: 67.477, name: 'Mankiala Stupa', slug: 'mankiala-stupa', blurb: 'A prominent 2nd-century stupa beside the GT Road south of Rawalpindi.' },
  { n: 27, x: 52.859, y: 58.605, name: 'Ban Faqiran Stupa', blurb: 'A stupa and monastery on a Margalla ridge above Shah Allah Ditta.' },
  { n: 28, x: 55.118, y: 52.656, name: 'Ashoka Rock Edicts', blurb: 'Ashokan inscriptions cut into boulders, among the oldest writing in South Asia.' },
  { n: 29, x: 58.838, y: 49.472, name: 'Mansehra Rock Edicts', blurb: 'Ashoka’s edicts in Kharosthi on three boulders beside the Karakoram Highway.' },
  { n: 30, x: 58.669, y: 42.249, name: 'Shatial Rock Carving', blurb: 'Thousands of carvings and inscriptions left by Silk Road travellers on the Indus bank.' },
  { n: 31, x: 68.756, y: 38.327, name: 'Chilas Rock Carvings', blurb: 'Petroglyphs along the Indus at Chilas, some over 5,000 years old.' },
  { n: 32, x: 66.518, y: 31.119, name: 'Kargah Buddha', slug: 'kargah-buddha', blurb: 'A 7th-century standing Buddha carved high on a cliff near Gilgit.' },
  { n: 33, x: 87.961, y: 33.811, name: 'Manthal Buddha Rock', slug: 'manthal-buddha-rock', blurb: 'An 8th-century Buddha carved on a granite boulder near Skardu.' },
];
