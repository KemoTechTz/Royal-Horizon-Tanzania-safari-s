


export const STORAGE_KEYS = {
  bookings: "rh_bookings",
  enquiries: "rh_enquiries",
  expertCalls: "rh_expert_calls",
  reviews: "rh_reviews",
  newsletter: "rh_newsletter",
  payments: "rh_payments",
  clientForms: "rh_client_forms",
  adminNotes: "rh_admin_notes",
  demoSeeded: "rh_demo_seeded",
  currency: "rh_currency",
  language: "rh_language"
};

export const BRAND = {
  name: "Royal Horizon Tours",
  tagline: "Premium Tanzania adventures, handled locally from first enquiry to welcome home.",
  whatsapp: "+255 762 555 019",
  email: "hello@royalhorizontours.com",
  location: "Moshi, Kilimanjaro Region, Tanzania",
  address: "Rau Road, Moshi, Tanzania",
  paymentNote: "Payment actions in this preview are simulated. Royal Horizon confirms live payment instructions directly with guests before any real transaction."
};

export const EXCHANGE_RATES = {
  USD: { label: "USD", symbol: "$", rate: 1 },
  TZS: { label: "TZS", symbol: "TSh ", rate: 2550 },
  EUR: { label: "EUR", symbol: "€", rate: 0.92 },
  GBP: { label: "GBP", symbol: "£", rate: 0.79 }
};

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sw", label: "Swahili" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" }
];

export const imageLibrary = {
  kilimanjaro: "/asset/image/kilimanjaro.png",
  kilimanjaroTrail: "/asset/image/kilimanjaroTrail.png",
  safari: "/asset/image/safari.png",
  lion: "/asset/image/lion.png",
  elephant: "/asset/image/elephant.png",
  travellers: "/asset/image/travellers.png",
  camp: "/asset/image/camp.png",
  zanzibar: "/asset/image/zanzibar.png",
  waterfall: "/asset/image/waterfall.png",
  hotSprings: "/asset/image/hotSprings.png",
  coffee: "/asset/image/coffee.png",
  crater: "/asset/image/crater.png",
  culture: "/asset/image/culture.png",
  lodge: "/asset/image/lodge.png",
  planning: "/asset/image/planning.png"
};

export const heroSlides = [
  {
    title: "Climb Kilimanjaro with a Team That Knows Every Step.",
    text: "From your first enquiry to your summit morning, our local team keeps the journey clear, supported, and personal.",
    image: imageLibrary.kilimanjaro,
    primary: { label: "Explore Kilimanjaro", href: "kilimanjaro.html" },
    secondary: { label: "Plan with Expert", href: "connect-expert.html" }
  },
  {
    title: "Experience Tanzania Safaris with Local Experts.",
    text: "Travel through Tanzania with people who live here, work here, and know how to turn a route into a journey worth remembering.",
    image: imageLibrary.safari,
    primary: { label: "Discover Safaris", href: "safaris.html" },
    secondary: { label: "Book Safari", href: "booking.html?type=safari" }
  },
  {
    title: "Direct Bookings. Transparent Prices. Real Adventure.",
    text: "Transparent pricing does not mean cheap. It means you understand what you are paying for, who is supporting you, and how your trip is handled.",
    image: imageLibrary.camp,
    primary: { label: "Start Booking", href: "booking.html" },
    secondary: { label: "Why Trust Us", href: "reasons-to-trust-us.html" }
  },
  {
    title: "Join a Community of Like-Minded Adventurers.",
    text: "Private journeys, small groups, family safaris, day trips, and carefully managed mountain climbs shaped around real traveller needs.",
    image: imageLibrary.travellers,
    primary: { label: "View Day Trips", href: "day-trips.html" },
    secondary: { label: "Read Stories", href: "blog.html" }
  }
];

const kiliIncluded = [
  "Professional mountain guides, assistant guides, cook, and porter crew",
  "National park fees, camping or hut fees, rescue fees, and crew entry fees",
  "Airport transfers in Kilimanjaro region and pre-climb briefing",
  "Three mountain meals per day plus treated drinking water",
  "Quality mountain tents, dining tent, sleeping mat, and safety oxygen",
  "Pulse oximeter checks and daily health monitoring"
];

const kiliExcluded = [
  "International flights and Tanzania visa",
  "Personal trekking gear and sleeping bag rental",
  "Travel insurance with high-altitude trekking cover",
  "Crew tips, personal snacks, drinks, and extra hotel nights",
  "Private toilet tent unless requested in the quote"
];

const kiliFaqs = [
  {
    question: "How fit do I need to be for Kilimanjaro?",
    answer: "You do not need technical climbing experience, but you should arrive able to walk for several hours on consecutive days. The main challenge is altitude, so route choice and pace matter."
  },
  {
    question: "Can I join a group climb?",
    answer: "Yes. Royal Horizon runs small group departures and private climbs. Private climbs are better for families, special dates, and travellers who want a quieter pace."
  },
  {
    question: "What support is available on the mountain?",
    answer: "Your crew manages meals, camp, health checks, route timing, summit pacing, and daily communication. Safety equipment travels with the guide team."
  }
];

const safariIncluded = [
  "Private 4x4 safari vehicle with pop-up roof",
  "Professional English-speaking driver guide",
  "Park fees and crater service fees where listed",
  "Accommodation and meals as shown in the itinerary",
  "Bottled water during game drives",
  "Airport or hotel pickup and drop-off in Arusha or Moshi"
];

const safariExcluded = [
  "International flights, visa, and travel insurance",
  "Premium drinks, laundry, and personal expenses",
  "Guide tips and optional activities",
  "Balloon safari unless selected",
  "Zanzibar flights unless included in the package"
];

const dayTripIncluded = [
  "Private transport from Moshi or Arusha",
  "Local guide or activity host",
  "Entry fees for the listed activity",
  "Packed lunch or local lunch where noted",
  "Bottled water"
];

const dayTripExcluded = [
  "Flights and accommodation",
  "Tips and personal expenses",
  "Alcoholic drinks",
  "Items not mentioned in the itinerary"
];

const makeKiliItinerary = (route, days, camps) =>
  camps.map((camp, index) => ({
    day: index + 1,
    title: index === camps.length - 1 ? `Summit push and descent via ${route}` : camp,
    details:
      index === 0
        ? `Meet the mountain crew, complete park formalities, and begin the ${route} route at a calm pace designed for acclimatization.`
        : index === camps.length - 1
          ? "Start before dawn for the summit attempt, celebrate at Uhuru Peak if conditions allow, then descend with careful guide support."
          : `Trek through changing mountain zones toward ${camp}. Guides keep the pace steady and check how each climber is adapting.`
  })).slice(0, days);

export const kilimanjaroRoutes = [
  {
    slug: "lemosho",
    name: "Lemosho Route",
    days: "7-8 days",
    difficulty: "Moderate to challenging",
    priceFrom: 2450,
    successRate: "92%",
    image: imageLibrary.kilimanjaroTrail,
    overview: "Lemosho is a scenic western approach with strong acclimatization, quiet early trail days, and beautiful crossings of the Shira Plateau. It is one of our first recommendations for travellers who want a balanced premium climb.",
    recommendation: "Best for first-time climbers who want scenery, a realistic summit strategy, and fewer crowds at the start.",
    highlights: ["Quiet western trailhead", "Shira Plateau crossing", "Excellent acclimatization profile", "Strong summit success potential"],
    itinerary: makeKiliItinerary("Lemosho", 8, ["Londorossi Gate to Mti Mkubwa Camp", "Mti Mkubwa to Shira 1", "Shira 1 to Shira 2", "Shira 2 to Barranco via Lava Tower", "Barranco to Karanga", "Karanga to Barafu", "Barafu to Uhuru Peak to Mweka", "Mweka Camp to Mweka Gate"]),
    included: kiliIncluded,
    excluded: kiliExcluded,
    faqs: kiliFaqs
  },
  {
    slug: "machame",
    name: "Machame Route",
    days: "6-7 days",
    difficulty: "Challenging",
    priceFrom: 2190,
    successRate: "88%",
    image: imageLibrary.kilimanjaroTrail,
    overview: "Machame is a classic camping route with dramatic scenery and a climb-high, sleep-low acclimatization pattern. It is popular for good reason, especially for energetic trekkers who enjoy varied terrain.",
    recommendation: "Choose seven days if your schedule allows. The extra acclimatization day is often the difference between a hard climb and a well-managed one.",
    highlights: ["Barranco Wall", "High alpine desert", "Strong scenery every day", "Excellent value camping route"],
    itinerary: makeKiliItinerary("Machame", 7, ["Machame Gate to Machame Camp", "Machame Camp to Shira Camp", "Shira Camp to Barranco via Lava Tower", "Barranco to Karanga", "Karanga to Barafu", "Barafu to Uhuru Peak to Mweka", "Mweka Camp to Mweka Gate"]),
    included: kiliIncluded,
    excluded: kiliExcluded,
    faqs: kiliFaqs
  },
  {
    slug: "marangu",
    name: "Marangu Route",
    days: "5-6 days",
    difficulty: "Moderate",
    priceFrom: 1980,
    successRate: "76%",
    image: imageLibrary.kilimanjaro,
    overview: "Marangu is the hut route on Kilimanjaro, following a direct trail through forest, moorland, and alpine desert. It suits travellers who prefer hut accommodation, but the shorter profile needs thoughtful pacing.",
    recommendation: "Book six days rather than five unless you have strong altitude experience. More time gives the body a better chance to adapt.",
    highlights: ["Mountain hut accommodation", "Direct trail", "Good for wet season logistics", "Classic Kilimanjaro history"],
    itinerary: makeKiliItinerary("Marangu", 6, ["Marangu Gate to Mandara Hut", "Mandara Hut to Horombo Hut", "Acclimatization day at Horombo", "Horombo Hut to Kibo Hut", "Kibo Hut to Uhuru Peak to Horombo", "Horombo Hut to Marangu Gate"]),
    included: kiliIncluded,
    excluded: kiliExcluded,
    faqs: kiliFaqs
  },
  {
    slug: "rongai",
    name: "Rongai Route",
    days: "6-7 days",
    difficulty: "Moderate",
    priceFrom: 2260,
    successRate: "84%",
    image: imageLibrary.kilimanjaroTrail,
    overview: "Rongai approaches Kilimanjaro from the north near the Kenyan border. It is drier, quieter, and excellent for travellers who want a different perspective on the mountain.",
    recommendation: "A strong option in wetter months and for guests who prefer a quieter climb without sacrificing support.",
    highlights: ["Quiet northern approach", "Drier trail conditions", "Gentle early gradient", "Descends via Marangu"],
    itinerary: makeKiliItinerary("Rongai", 7, ["Rongai Gate to Simba Camp", "Simba Camp to Second Cave", "Second Cave to Kikelewa", "Kikelewa to Mawenzi Tarn", "Mawenzi Tarn to Kibo Hut", "Kibo Hut to Uhuru Peak to Horombo", "Horombo Hut to Marangu Gate"]),
    included: kiliIncluded,
    excluded: kiliExcluded,
    faqs: kiliFaqs
  },
  {
    slug: "umbwe",
    name: "Umbwe Route",
    days: "6-7 days",
    difficulty: "Very challenging",
    priceFrom: 2290,
    successRate: "72%",
    image: imageLibrary.kilimanjaroTrail,
    overview: "Umbwe is steep, direct, and demanding. It rewards experienced trekkers with a wilder forest approach, but it is not the route we recommend for most first-time altitude trekkers.",
    recommendation: "Best for fit hikers with previous altitude exposure who understand that the route is beautiful but unforgiving.",
    highlights: ["Steep forest ridge", "Very quiet trail", "Direct approach to Barranco", "Strong challenge for experienced trekkers"],
    itinerary: makeKiliItinerary("Umbwe", 7, ["Umbwe Gate to Umbwe Cave", "Umbwe Cave to Barranco", "Barranco acclimatization walk", "Barranco to Karanga", "Karanga to Barafu", "Barafu to Uhuru Peak to Mweka", "Mweka Camp to Mweka Gate"]),
    included: kiliIncluded,
    excluded: kiliExcluded,
    faqs: kiliFaqs
  },
  {
    slug: "northern-circuit",
    name: "Northern Circuit",
    days: "9 days",
    difficulty: "Moderate to challenging",
    priceFrom: 3120,
    successRate: "95%",
    image: imageLibrary.waterfall,
    overview: "The Northern Circuit is the longest standard Kilimanjaro route, wrapping around the quiet northern slopes before the summit attempt. It offers the best acclimatization profile and a spacious wilderness feel.",
    recommendation: "Our premium recommendation for travellers with time, comfort expectations, and a serious summit goal.",
    highlights: ["Longest acclimatization profile", "Remote northern slopes", "High summit success", "Premium wilderness feel"],
    itinerary: makeKiliItinerary("Northern Circuit", 9, ["Londorossi Gate to Mti Mkubwa", "Mti Mkubwa to Shira 1", "Shira 1 to Shira 2", "Shira 2 to Moir Hut", "Moir Hut to Buffalo Camp", "Buffalo Camp to Third Cave", "Third Cave to School Hut", "School Hut to Uhuru Peak to Mweka", "Mweka Camp to Mweka Gate"]),
    included: kiliIncluded,
    excluded: kiliExcluded,
    faqs: kiliFaqs
  }
];

export const safariPackages = [
  {
    slug: "honeymoon-safari",
    title: "Honeymoon Safari",
    category: "Honeymoon",
    duration: "7 days",
    priceFrom: 3680,
    destinations: ["Tarangire", "Ngorongoro", "Serengeti", "Zanzibar add-on available"],
    image: imageLibrary.lodge,
    overview: "A private romantic safari with elegant lodges, unhurried game drives, sunset moments, and space to celebrate without losing the feeling of real wilderness.",
    highlights: ["Private vehicle", "Handpicked romantic lodges", "Ngorongoro Crater day", "Optional Zanzibar beach extension"],
    itinerary: [
      "Arrive in Arusha and settle into a quiet boutique lodge.",
      "Game drive in Tarangire, known for elephants and baobabs.",
      "Descend into Ngorongoro Crater for a full wildlife day.",
      "Fly or drive into Serengeti for wide open plains and big cat country.",
      "Two flexible Serengeti days shaped around wildlife movement.",
      "Return to Arusha or continue to Zanzibar."
    ],
    included: safariIncluded,
    excluded: safariExcluded,
    accommodationOptions: ["Mid-range tented camp", "Luxury lodge", "Private honeymoon suite upgrades"],
    faqs: [
      { question: "Can we add Zanzibar?", answer: "Yes. Zanzibar works beautifully after safari and can be quoted as a direct extension." },
      { question: "Is the safari private?", answer: "Honeymoon safaris are normally private so timing, stops, and lodge style can match the couple." }
    ]
  },
  {
    slug: "family-safari",
    title: "Family Safari",
    category: "Family",
    duration: "6 days",
    priceFrom: 2890,
    destinations: ["Arusha", "Tarangire", "Lake Manyara", "Ngorongoro"],
    image: imageLibrary.elephant,
    overview: "A thoughtful safari for families who want strong wildlife viewing, realistic driving days, child-friendly lodges, and guides who know how to keep younger travellers engaged.",
    highlights: ["Flexible starts", "Shorter drives", "Family rooms", "Private guide"],
    itinerary: [
      "Meet your guide in Arusha and review the family pace.",
      "Tarangire game drive with picnic lunch and elephant viewing.",
      "Lake Manyara forest and lakeshore wildlife.",
      "Cultural stop or lodge rest afternoon.",
      "Ngorongoro Crater safari day.",
      "Return to Arusha with optional market visit."
    ],
    included: safariIncluded,
    excluded: safariExcluded,
    accommodationOptions: ["Budget lodge", "Mid-range family lodge", "Luxury family suite"],
    faqs: [
      { question: "Is this good with children?", answer: "Yes. We shape the driving rhythm, food stops, and lodge choices around the ages in your family." },
      { question: "Can grandparents join?", answer: "Yes. We can reduce long drives and select lodges with easier access." }
    ]
  },
  {
    slug: "friends-safari",
    title: "Friends Safari",
    category: "Friends",
    duration: "5 days",
    priceFrom: 2350,
    destinations: ["Tarangire", "Serengeti", "Ngorongoro"],
    image: imageLibrary.safari,
    overview: "A social, high-energy safari for friends who want memorable wildlife days, shared campfire evenings, and clear pricing without losing comfort.",
    highlights: ["Great group value", "Classic northern circuit", "Camp or lodge options", "Flexible photo stops"],
    itinerary: [
      "Depart Arusha for Tarangire National Park.",
      "Drive through the highlands toward Serengeti.",
      "Full day in Serengeti with big cat tracking.",
      "Morning Serengeti drive and transfer to Ngorongoro highlands.",
      "Crater safari and return to Arusha."
    ],
    included: safariIncluded,
    excluded: safariExcluded,
    accommodationOptions: ["Budget camping", "Mid-range tented camps", "Luxury shared lodge"],
    faqs: [
      { question: "Can the group split payments?", answer: "Yes. We can issue individual payment schedules while keeping one shared booking reference." },
      { question: "Can we add nightlife or town time?", answer: "Arusha and Moshi evenings can be built around your arrival and departure times." }
    ]
  },
  {
    slug: "photographer-safari",
    title: "Photographer Safari",
    category: "Photographer",
    duration: "8 days",
    priceFrom: 4420,
    destinations: ["Serengeti", "Ndutu", "Ngorongoro", "Tarangire"],
    image: imageLibrary.lion,
    overview: "A slower safari designed for serious photographers, with flexible light, fewer packed days, patient guides, and vehicle positioning that respects both wildlife and the shot.",
    highlights: ["Golden-hour planning", "Private vehicle", "Bean bags and charging support", "Seasonal wildlife focus"],
    itinerary: [
      "Briefing in Arusha and vehicle setup.",
      "Tarangire elephants and landscape photography.",
      "Transfer to Serengeti with late afternoon light.",
      "Full Serengeti day focused on predator movement.",
      "Second Serengeti day with patient sightings.",
      "Seasonal Ndutu or central plains focus.",
      "Ngorongoro Crater wildlife photography.",
      "Return to Arusha."
    ],
    included: safariIncluded,
    excluded: safariExcluded,
    accommodationOptions: ["Mid-range tented camp", "Luxury mobile camp", "Private vehicle row configuration"],
    faqs: [
      { question: "Do you rush sightings?", answer: "No. Photographer safaris are built around patience, light, and ethical viewing distance." },
      { question: "Can I bring long lenses?", answer: "Yes. Tell us your equipment and we will plan vehicle storage and charging." }
    ]
  },
  {
    slug: "culture-safari",
    title: "Culture Safari",
    category: "Culture",
    duration: "6 days",
    priceFrom: 2550,
    destinations: ["Mto wa Mbu", "Lake Eyasi", "Ngorongoro", "Tarangire"],
    image: imageLibrary.culture,
    overview: "A balanced journey combining wildlife with respectful cultural experiences, local food, village time, and conversations that make the landscape more meaningful.",
    highlights: ["Local host experiences", "Wildlife plus community visits", "Food and market moments", "Respectful cultural pacing"],
    itinerary: [
      "Arrive in Arusha and meet your guide.",
      "Tarangire wildlife day.",
      "Mto wa Mbu village walk and local lunch.",
      "Lake Eyasi cultural experience with local hosts.",
      "Ngorongoro Crater safari.",
      "Return to Arusha or Moshi."
    ],
    included: safariIncluded,
    excluded: safariExcluded,
    accommodationOptions: ["Community lodge", "Mid-range lodge", "Luxury lodge with cultural day trips"],
    faqs: [
      { question: "Are cultural visits respectful?", answer: "We use local hosts and avoid rushed performances. The goal is exchange, not spectacle." },
      { question: "Can we combine culture with Serengeti?", answer: "Yes. Add two or three days for Serengeti if time allows." }
    ]
  },
  {
    slug: "safari-zanzibar-combo",
    title: "Safari + Zanzibar Combo",
    category: "Safari + Zanzibar Combo",
    duration: "10 days",
    priceFrom: 4980,
    destinations: ["Tarangire", "Serengeti", "Ngorongoro", "Zanzibar"],
    image: imageLibrary.zanzibar,
    overview: "A complete northern Tanzania safari followed by Zanzibar beach time, built for travellers who want both wildlife intensity and a soft landing by the ocean.",
    highlights: ["Classic safari parks", "Beach recovery days", "Domestic flight coordination", "Stone Town or spice tour options"],
    itinerary: [
      "Arrive in Arusha.",
      "Tarangire safari day.",
      "Transfer to Serengeti.",
      "Full day in Serengeti.",
      "Serengeti to Ngorongoro highlands.",
      "Crater safari and flight connection planning.",
      "Fly to Zanzibar.",
      "Beach day.",
      "Stone Town or spice tour.",
      "Departure from Zanzibar."
    ],
    included: safariIncluded,
    excluded: safariExcluded,
    accommodationOptions: ["Mid-range lodge and beach hotel", "Luxury lodge and boutique beach resort", "Private villa upgrade"],
    faqs: [
      { question: "Are Zanzibar flights included?", answer: "They can be included in the final quote. The demo price shows a starting safari-and-beach structure." },
      { question: "Can Zanzibar come before safari?", answer: "It can, but most guests prefer to rest at the beach after safari." }
    ]
  }
];

export const dayTrips = [
  {
    slug: "materuni-waterfalls",
    title: "Materuni Waterfalls",
    duration: "Full day",
    priceFrom: 95,
    location: "Materuni Village, Kilimanjaro",
    image: imageLibrary.waterfall,
    overview: "A lush Kilimanjaro foothills day with a waterfall walk, Chagga village hospitality, coffee preparation, and a relaxed local lunch.",
    itinerary: ["Pickup in Moshi", "Guided village walk", "Waterfall visit and swim time if conditions allow", "Coffee experience and local lunch", "Return to hotel"],
    included: dayTripIncluded,
    excluded: dayTripExcluded,
    faqs: [{ question: "Can I swim?", answer: "Often yes, but the guide will check water conditions first." }]
  },
  {
    slug: "chemka-hot-springs",
    title: "Chemka Hot Springs",
    duration: "Half or full day",
    priceFrom: 85,
    location: "Kikuletwa, near Moshi",
    image: imageLibrary.hotSprings,
    overview: "Clear blue spring water, shaded fig trees, and an easy-going day that works well after a climb or before safari.",
    itinerary: ["Pickup from Moshi or Arusha", "Drive to Kikuletwa", "Swim and relax at the springs", "Picnic or local lunch", "Return before evening"],
    included: dayTripIncluded,
    excluded: dayTripExcluded,
    faqs: [{ question: "Is it good after Kilimanjaro?", answer: "Yes. Many climbers use Chemka as a recovery day." }]
  },
  {
    slug: "arusha-national-park",
    title: "Arusha National Park",
    duration: "Full day",
    priceFrom: 210,
    location: "Arusha",
    image: imageLibrary.coffee,
    overview: "A compact national park day with forest, lakes, giraffe, buffalo, colobus monkeys, and optional walking safari with a ranger.",
    itinerary: ["Pickup in Arusha or Moshi", "Park entry and game drive", "Momella Lakes viewpoints", "Optional walking safari", "Return to town"],
    included: dayTripIncluded,
    excluded: dayTripExcluded,
    faqs: [{ question: "Will we see big cats?", answer: "Arusha is not the best big cat park, but it is excellent for scenery, giraffe, buffalo, and monkeys." }]
  },
  {
    slug: "moshi-coffee-tour",
    title: "Moshi Coffee Tour",
    duration: "Half day",
    priceFrom: 55,
    location: "Moshi foothills",
    image: imageLibrary.coffee,
    overview: "Meet local coffee growers, roast beans by hand, and understand the daily rhythm of the Kilimanjaro foothills.",
    itinerary: ["Short transfer from Moshi", "Farm walk", "Traditional roasting and grinding", "Coffee tasting", "Return to hotel"],
    included: dayTripIncluded,
    excluded: dayTripExcluded,
    faqs: [{ question: "Is this suitable with limited time?", answer: "Yes. It works well as an arrival afternoon activity." }]
  },
  {
    slug: "lake-chala",
    title: "Lake Chala",
    duration: "Full day",
    priceFrom: 120,
    location: "Tanzania-Kenya border",
    image: imageLibrary.waterfall,
    overview: "A crater lake day with dramatic blue water, walking viewpoints, quiet picnic time, and a different side of Kilimanjaro region.",
    itinerary: ["Pickup in Moshi", "Drive to Lake Chala", "Viewpoint walk", "Picnic lunch", "Optional kayaking where available", "Return to Moshi"],
    included: dayTripIncluded,
    excluded: dayTripExcluded,
    faqs: [{ question: "Can I kayak?", answer: "Kayaking depends on local conditions and availability, so we confirm it before departure." }]
  },
  {
    slug: "marangu-waterfalls",
    title: "Marangu Waterfalls",
    duration: "Full day",
    priceFrom: 90,
    location: "Marangu, Kilimanjaro",
    image: imageLibrary.crater,
    overview: "A Kilimanjaro foothills day combining waterfall walks, local history, caves, and village hospitality.",
    itinerary: ["Pickup from Moshi", "Marangu village visit", "Waterfall walk", "Chagga caves and history", "Local lunch", "Return"],
    included: dayTripIncluded,
    excluded: dayTripExcluded,
    faqs: [{ question: "Is the walk difficult?", answer: "The walking is moderate with uneven ground near the waterfall." }]
  },
  {
    slug: "maasai-cultural-experience",
    title: "Maasai Cultural Experience",
    duration: "Full day",
    priceFrom: 140,
    location: "Arusha region",
    image: imageLibrary.culture,
    overview: "A hosted cultural day built around respectful exchange, community context, and time to listen rather than rush.",
    itinerary: ["Pickup from Arusha or Moshi", "Meet local hosts", "Community walk and conversation", "Traditional lunch where arranged", "Return before evening"],
    included: dayTripIncluded,
    excluded: dayTripExcluded,
    faqs: [{ question: "Is photography allowed?", answer: "Your host will explain when photography is welcome and when it is better to put the camera away." }]
  }
];

export const destinations = [
  {
    slug: "serengeti-national-park",
    title: "Serengeti National Park",
    image: imageLibrary.safari,
    overview: "Serengeti is Tanzania's most iconic safari landscape, known for endless plains, big cats, seasonal migration movement, and the feeling of space that defines East African safari.",
    bestTime: "June to October for dry-season viewing, January to March for southern plains and calving season.",
    whyVisit: ["Big cat sightings", "Migration routes", "Classic tented camps", "Wide open landscapes"],
    related: ["honeymoon-safari", "photographer-safari", "safari-zanzibar-combo"]
  },
  {
    slug: "ngorongoro-crater",
    title: "Ngorongoro Crater",
    image: imageLibrary.crater,
    overview: "A vast volcanic caldera with dense wildlife viewing in a single day. It pairs naturally with Serengeti, Tarangire, and cultural routes through the highlands.",
    bestTime: "Excellent year round, with clearer skies often from June to October.",
    whyVisit: ["High wildlife density", "Scenic crater rim", "Strong chance of varied species", "Efficient safari day"],
    related: ["family-safari", "culture-safari", "honeymoon-safari"]
  },
  {
    slug: "tarangire-national-park",
    title: "Tarangire National Park",
    image: imageLibrary.elephant,
    overview: "Tarangire is famous for elephants, baobab trees, river life, and a quieter safari mood than the busiest northern circuit parks.",
    bestTime: "June to October when wildlife gathers near the Tarangire River.",
    whyVisit: ["Elephant herds", "Baobab landscapes", "Birdlife", "Strong first safari day"],
    related: ["family-safari", "friends-safari", "culture-safari"]
  },
  {
    slug: "lake-manyara",
    title: "Lake Manyara",
    image: imageLibrary.safari,
    overview: "A compact park at the base of the escarpment, with groundwater forest, lake views, birds, monkeys, and easy access from Arusha.",
    bestTime: "June to October for easier game viewing, November to May for birdlife and green scenery.",
    whyVisit: ["Forest and lake contrast", "Birding", "Short transfer", "Good family pacing"],
    related: ["family-safari", "culture-safari"]
  },
  {
    slug: "arusha-national-park",
    title: "Arusha National Park",
    image: imageLibrary.coffee,
    overview: "A beautiful day safari park close to Arusha, combining forest, lakes, Mount Meru views, and optional walking safari.",
    bestTime: "Year round, with clear mountain views often in the dry season.",
    whyVisit: ["Close to Arusha", "Walking safari option", "Giraffe and colobus monkeys", "Mount Meru scenery"],
    related: ["arusha-national-park"]
  },
  {
    slug: "kilimanjaro-national-park",
    title: "Kilimanjaro National Park",
    image: imageLibrary.kilimanjaro,
    overview: "Home to Africa's highest mountain and a remarkable set of climate zones, from rainforest to alpine desert and glacial summit slopes.",
    bestTime: "January to early March and June to October are the most popular climbing windows.",
    whyVisit: ["Uhuru Peak", "Multi-day trekking", "Strong crew culture", "Life-changing summit morning"],
    related: ["lemosho", "machame", "northern-circuit"]
  },
  {
    slug: "materuni-waterfalls",
    title: "Materuni Waterfalls",
    image: imageLibrary.waterfall,
    overview: "A green village setting on the slopes of Kilimanjaro, combining waterfall trails, coffee culture, and Chagga hospitality.",
    bestTime: "Year round, with stronger water flow after rains.",
    whyVisit: ["Waterfall walk", "Coffee experience", "Village lunch", "Easy Moshi day"],
    related: ["materuni-waterfalls", "moshi-coffee-tour"]
  },
  {
    slug: "chemka-hot-springs",
    title: "Chemka Hot Springs",
    image: imageLibrary.hotSprings,
    overview: "A relaxing natural spring day with blue water, shade, and a gentle rhythm that fits well before or after bigger adventures.",
    bestTime: "Year round, especially pleasant after a climb.",
    whyVisit: ["Swim time", "Recovery day", "Short transfer from Moshi", "Relaxed picnic mood"],
    related: ["chemka-hot-springs"]
  },
  {
    slug: "zanzibar",
    title: "Zanzibar",
    image: imageLibrary.zanzibar,
    overview: "A beach and culture extension with white-sand coastlines, Stone Town history, spice routes, and a soft close to safari or Kilimanjaro.",
    bestTime: "June to October and December to February for classic beach weather.",
    whyVisit: ["Beach recovery", "Stone Town", "Spice tours", "Honeymoon extensions"],
    related: ["safari-zanzibar-combo", "honeymoon-safari"]
  }
];

export const blogPosts = [
  {
    slug: "best-time-to-climb-kilimanjaro",
    title: "Best Time to Climb Kilimanjaro Without Guessing Your Season",
    category: "Kilimanjaro",
    image: imageLibrary.kilimanjaro,
    excerpt: "A clear guide to weather, trail mood, visibility, and why the best month depends on your route, flexibility, and comfort with crowds.",
    content: [
      "Kilimanjaro can be climbed throughout the year, but not every month feels the same on the mountain. Clear skies are common from January to early March and from June to October. These windows usually bring stronger trail conditions and better summit visibility.",
      "That does not mean every traveller should choose the busiest dates. If you prefer quieter camps and have flexible gear, shoulder weeks can feel more personal. The better question is not only when the weather is best, but when the route, crew plan, and your body have the best chance to work together.",
      "Royal Horizon usually recommends longer routes for guests who can spare the time. A seven or eight day climb gives the body space to adapt and gives the guide team more room to manage pace, meals, hydration, and summit timing."
    ]
  },
  {
    slug: "lemosho-vs-machame-route",
    title: "Lemosho vs Machame: Which Kilimanjaro Route Fits You?",
    category: "Kilimanjaro",
    image: imageLibrary.kilimanjaroTrail,
    excerpt: "Both are strong routes, but they serve different travellers. Here is how scenery, crowds, timing, and acclimatization compare.",
    content: [
      "Machame is the classic scenic route. It is popular, direct, and filled with dramatic mountain moments like the Barranco Wall. It is a strong choice for fit trekkers who want a proven route with good value.",
      "Lemosho starts more quietly on the western side and gives the mountain more time to reveal itself. The early days feel spacious, the Shira Plateau crossing is memorable, and the acclimatization profile is excellent.",
      "If your goal is a premium first Kilimanjaro experience, Lemosho often wins. If your schedule is tighter and you still want strong scenery, Machame in seven days remains a serious option."
    ]
  },
  {
    slug: "what-happens-on-a-serengeti-safari-day",
    title: "What Actually Happens on a Serengeti Safari Day?",
    category: "Safari",
    image: imageLibrary.safari,
    excerpt: "A real safari day is not just driving until animals appear. Timing, patience, guiding, and light all shape the experience.",
    content: [
      "A strong Serengeti day often starts early. The air is cooler, predators may still be active, and the first light gives the plains a quiet intensity. Your guide reads tracks, radio updates, weather, and the movement of vehicles without letting the day feel rushed.",
      "Good safari guiding is partly knowledge and partly restraint. Sometimes the best decision is to wait at a sighting instead of chasing the next rumor. Sometimes the best lunch is a quiet viewpoint instead of a crowded picnic area.",
      "The point is not to tick animals from a list. The point is to understand the landscape long enough that the sightings feel earned."
    ]
  },
  {
    slug: "ngorongoro-crater-worth-it",
    title: "Is Ngorongoro Crater Worth Including?",
    category: "Safari",
    image: imageLibrary.crater,
    excerpt: "The crater is busy for a reason. Used well, it can be one of the most efficient and memorable wildlife days in Tanzania.",
    content: [
      "Ngorongoro Crater is not a hidden place, and pretending otherwise helps no one. It is famous, protected, scenic, and often busy. It is also extraordinary when planned with realistic expectations.",
      "The crater floor concentrates wildlife in a way few places can match. In a single day, travellers may see lions, buffalo, elephants, hyenas, hippos, and an enormous range of birdlife. The rim adds a completely different atmosphere, especially in the early morning.",
      "We like Ngorongoro as part of a wider northern circuit, not as the only safari experience. Pair it with Tarangire or Serengeti and the journey feels more complete."
    ]
  },
  {
    slug: "zanzibar-after-safari",
    title: "Why Zanzibar Works So Well After Safari",
    category: "Zanzibar",
    image: imageLibrary.zanzibar,
    excerpt: "After early mornings and dusty roads, Zanzibar gives the trip a soft landing without losing culture, food, and place.",
    content: [
      "Safari days are beautiful, but they are also full. Early starts, bumpy tracks, intense sightings, and long conversations with the landscape can leave travellers happily tired. Zanzibar changes the tempo.",
      "The island gives you beach time, warm water, Stone Town history, spice farms, and long dinners without asking you to keep moving every hour. It is a strong finish for honeymooners, families, and Kilimanjaro climbers who want recovery time.",
      "The most important detail is flight timing. A good operator plans the transition so the beach does not feel like an afterthought."
    ]
  },
  {
    slug: "tanzania-visa-process-simple-guide",
    title: "Tanzania Visa Process: A Simple Planning Guide",
    category: "Visa Process",
    image: imageLibrary.travellers,
    excerpt: "What guests should prepare before arrival, what to check by nationality, and why documents should be handled early.",
    content: [
      "Most international travellers need to check Tanzania visa requirements before departure. Rules can depend on nationality, passport validity, travel purpose, and current government guidance.",
      "We recommend preparing early: passport validity, flight details, accommodation information, and a copy of your tour confirmation. Keep digital and printed copies where possible.",
      "Royal Horizon can guide guests on the planning checklist, but the final visa decision always rests with the relevant authorities. We keep the process clear so travel admin does not cloud the excitement of the journey."
    ]
  },
  {
    slug: "why-direct-booking-matters",
    title: "Why Direct Booking Matters in Tanzania Travel",
    category: "Royal Horizon Stories",
    image: imageLibrary.travellers,
    excerpt: "Direct booking is not just about price. It affects communication, accountability, crew care, and how quickly decisions are made.",
    content: [
      "When you book directly with a local operator, your questions reach the people responsible for the journey. That matters when you are choosing routes, confirming gear, changing dates, or asking what a price actually includes.",
      "Direct booking also improves accountability. The same team that sells the trip is the team that manages the crew, vehicles, hotels, and local communication. There is less distance between promise and delivery.",
      "For Royal Horizon, direct booking is part of how we keep the experience personal. Guests deserve clear answers before they commit and steady support once they do."
    ]
  },
  {
    slug: "responsible-travel-in-tanzania",
    title: "Responsible Travel Should Be Practical, Not Decorative",
    category: "Responsible Travel",
    image: imageLibrary.culture,
    excerpt: "Good intentions are not enough. Responsible travel shows up in crew wages, local purchasing, respectful visits, and honest guest preparation.",
    content: [
      "Responsible travel is easiest to talk about and harder to practice consistently. On the mountain, it includes fair crew treatment, realistic loads, proper meals, and the equipment needed to work safely.",
      "On safari, it means respecting park rules, keeping distance from wildlife, choosing local partners carefully, and avoiding cultural visits that turn people into props.",
      "For travellers, responsibility can be simple: ask where your money goes, listen to your guide, avoid rushed assumptions, and choose operators who can explain how the trip is managed."
    ]
  }
];

export const offers = [
  {
    title: "Low Season Booking Discount",
    text: "Save on selected safari and Kilimanjaro departures during quieter travel windows.",
    tag: "Seasonal"
  },
  {
    title: "Group Discount for 3+ Travellers",
    text: "Bring friends or family and unlock better per-person pricing on private adventures.",
    tag: "Groups"
  },
  {
    title: "Safari + Day Trip Bonus",
    text: "Add a Moshi or Arusha day trip to selected safari bookings at a reduced planning rate.",
    tag: "Bonus"
  },
  {
    title: "Early Kilimanjaro Booking Offer",
    text: "Book your climb early and receive priority route planning plus a gear consultation.",
    tag: "Kilimanjaro"
  }
];

export const seedReviews = [
  {
    id: "REV-001",
    name: "Maya Thompson",
    email: "maya@example.com",
    country: "United States",
    tripType: "Lemosho Kilimanjaro",
    rating: 5,
    comment: "The mountain team was calm, organized, and deeply kind. I never felt like a number, even on summit night.",
    approved: true,
    featured: true,
    createdAt: "2026-01-18"
  },
  {
    id: "REV-002",
    name: "Jonas Keller",
    email: "jonas@example.com",
    country: "Germany",
    tripType: "Serengeti Safari",
    rating: 5,
    comment: "Our guide knew when to wait and when to move. The Serengeti days felt personal, not packaged.",
    approved: true,
    featured: true,
    createdAt: "2026-02-11"
  },
  {
    id: "REV-003",
    name: "Aisha Patel",
    email: "aisha@example.com",
    country: "United Kingdom",
    tripType: "Safari + Zanzibar",
    rating: 5,
    comment: "Everything was clear before we paid. The beach extension was handled beautifully after the safari.",
    approved: true,
    featured: false,
    createdAt: "2026-03-04"
  },
  {
    id: "REV-004",
    name: "Carlos Mendes",
    email: "carlos@example.com",
    country: "Brazil",
    tripType: "Materuni Waterfalls",
    rating: 4,
    comment: "A warm local day with coffee, green views, and a guide who made the village context come alive.",
    approved: false,
    featured: false,
    createdAt: "2026-04-22"
  }
];

export const serviceCards = [
  {
    title: "Climb Kilimanjaro",
    text: "Choose a route that fits your body, timing, budget, and summit goal, then climb with a professional local crew.",
    image: imageLibrary.kilimanjaro,
    href: "kilimanjaro.html",
    cta: "Discover Routes"
  },
  {
    title: "Signature Tanzania Safaris",
    text: "Private and small-group safaris across Serengeti, Ngorongoro, Tarangire, Manyara, and Zanzibar extensions.",
    image: imageLibrary.safari,
    href: "safaris.html",
    cta: "Discover Safaris"
  },
  {
    title: "Day Trips",
    text: "Waterfalls, coffee culture, hot springs, national parks, and local experiences built around real free days.",
    image: imageLibrary.waterfall,
    href: "day-trips.html",
    cta: "Discover Day Trips"
  }
];

export const bookingStatuses = [
  "Pending Review",
  "Contacted",
  "Confirmed",
  "Invoice Sent",
  "Deposit Paid",
  "Fully Paid",
  "Cancelled",
  "Completed"
];

export const paymentStatuses = [
  "Unpaid",
  "Deposit Pending",
  "Deposit Paid",
  "Fully Paid",
  "Payment Under Review",
  "Refunded"
];

export const expertCallStatuses = ["New", "Scheduled", "Completed", "Missed", "Converted"];

export function getPackageBySlug(slug) {
  return (
    kilimanjaroRoutes.find((item) => item.slug === slug) ||
    safariPackages.find((item) => item.slug === slug) ||
    dayTrips.find((item) => item.slug === slug)
  );
}

export function getPackageLabel(slug) {
  const item = getPackageBySlug(slug);
  return item?.name || item?.title || slug || "Custom Adventure";
}

export function getAllPackages() {
  return [
    ...kilimanjaroRoutes.map((item) => ({ ...item, type: "kilimanjaro", label: item.name })),
    ...safariPackages.map((item) => ({ ...item, type: "safari", label: item.title })),
    ...dayTrips.map((item) => ({ ...item, type: "day-trip", label: item.title }))
  ];
}
