import {
  BRAND,
  blogPosts,
  dayTrips,
  destinations,
  heroSlides,
  imageLibrary,
  kilimanjaroRoutes,
  offers,
  safariPackages
} from "./data.js";
import { seedDemoData } from "./demo-data.js";
import { setupAdventurePlannerForm, setupContactForm, setupExpertCallForm } from "./enquiries.js";
import { setupNewsletterForm } from "./newsletter.js";
import { setupReviewForm } from "./reviews.js";
import {
  escapeHtml,
  renderBlogCards,
  renderChecklist,
  renderDayTripCards,
  renderDestinationCards,
  renderEmptyState,
  renderFAQ,
  renderFooter,
  renderHero,
  renderNavbar,
  renderOfferTiles,
  renderReviewCards,
  renderRouteCards,
  renderSafariCards,
  renderServiceCards,
  renderStickyCtas,
  sectionHeader,
  setupFilterButtons,
  setupHeroSlider,
  updateCurrencyPrices
} from "./ui.js";
import { getParam, setPageTitle } from "./router-utils.js";
import { getPackageBySlug } from "./data.js";
import { renderBookingPage, renderBookingSuccessPage } from "./booking.js";
import { renderPaymentPage } from "./payment.js";
import { renderClientPortalPage } from "./client-portal.js";
import { renderAdminPage } from "./admin.js";

function list(items) {
  return `<ul class="grid gap-3">${items.map((item) => `<li class="rounded-2xl bg-white p-4 text-sm leading-7 shadow-sm">- ${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function ctaBand(title, text, primary = "booking.html", secondary = "connect-expert.html") {
  return `
    <section class="bg-royalGreen py-16 text-ivory">
      <div class="container-pad flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-3xl">
          <p class="eyebrow">Direct planning</p>
          <h2 class="mt-3 font-heading text-4xl font-bold md:text-5xl">${escapeHtml(title)}</h2>
          <p class="mt-4 text-ivory/76">${escapeHtml(text)}</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <a href="${primary}" class="btn-royal">Book Now</a>
          <a href="${secondary}" class="btn border-white/40 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen">Talk to Expert</a>
        </div>
      </div>
    </section>
  `;
}

function packageLink(pkg) {
  if (!pkg) return "booking.html";
  if (kilimanjaroRoutes.some((item) => item.slug === pkg.slug)) return `route-detail.html?route=${pkg.slug}`;
  if (safariPackages.some((item) => item.slug === pkg.slug)) return `safari-detail.html?package=${pkg.slug}`;
  if (dayTrips.some((item) => item.slug === pkg.slug)) return `day-trip-detail.html?trip=${pkg.slug}`;
  return "booking.html";
}

function renderHome(root) {
  setPageTitle("Kilimanjaro Climbs, Tanzania Safaris & Day Trips");
  root.innerHTML = `
    <section data-hero-slider class="hero-shell min-h-[760px] md:min-h-[720px]">
      ${heroSlides
        .map(
          (slide, index) => `
        <article data-slide class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ${index === 0 ? "opacity-100" : ""}">
          <img src="${slide.image}" alt="${escapeHtml(slide.title)}" class="hero-media object-[50%_40%]" loading="eager" />
          <div class="hero-overlay absolute inset-0"></div>
          <div class="hero-content min-h-[760px] md:min-h-[720px]">
            <div class="max-w-4xl">
              <p class="eyebrow">Royal Horizon Tours</p>
              <h1 class="hero-heading text-balance">${escapeHtml(slide.title)}</h1>
              <p class="mt-6 max-w-2xl text-base leading-8 text-ivory/90 md:text-xl">${escapeHtml(slide.text)}</p>
              <div class="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="${slide.primary.href}" class="btn-royal">${escapeHtml(slide.primary.label)}</a>
                <a href="${slide.secondary.href}" class="btn-ghost-royal">${escapeHtml(slide.secondary.label)}</a>
              </div>
              <div class="mt-10 flex flex-wrap gap-3">
                ${["Locally Owned", "Direct Booking", "No Middlemen", "Group & Private Tours", "Transparent Pricing"]
                  .map((badge) => `<span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">${badge}</span>`)
                  .join("")}
              </div>
            </div>
          </div>
        </article>`
        )
        .join("")}
      <div class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-3 md:bottom-8">
        ${heroSlides.map((_, index) => `<button data-slide-dot class="h-3 w-10 rounded-full ${index === 0 ? "bg-royalGold" : "bg-white/40"}" aria-label="Slide ${index + 1}"></button>`).join("")}
      </div>
      <button data-prev-slide class="btn btn-circle absolute left-4 top-1/2 z-10 hidden border-white/30 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen md:flex">Prev</button>
      <button data-next-slide class="btn btn-circle absolute right-4 top-1/2 z-10 hidden border-white/30 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen md:flex">Next</button>
    </section>

    <section class="section-pad bg-warmSand/35">
      <div class="container-pad">
        ${sectionHeader("Why Royal Horizon", "The Right Match for Travellers", "Premium travel is not about making everything look expensive. It is about making every handoff clear, every support team accountable, and every guest properly prepared.")}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          ${[
            "Group and private bookings",
            "Direct booking with no middlemen",
            "Simple booking steps",
            "Locally owned and operating only in Tanzania",
            "Transparent pricing",
            "Flexible payment options",
            "Conservation and CSR mindset",
            "Full client support before travel"
          ]
            .map((item) => `<article class="rounded-2xl border border-royalGreen/10 bg-white p-5 shadow-soft"><p class="font-bold text-royalGreen">${escapeHtml(item)}</p></article>`)
            .join("")}
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container-pad">
        ${sectionHeader("Services", "Choose the Journey That Fits Your Horizon", "Every service is handled through direct local planning, clear inclusions, and a team that understands the ground conditions.")}
        ${renderServiceCards()}
      </div>
    </section>

    <section class="section-pad bg-royalGreen text-ivory">
      <div class="container-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p class="eyebrow">Founder's Promise</p>
          <h2 class="mt-3 font-heading text-5xl font-bold">We keep the promise close to the people doing the work.</h2>
          <p class="mt-6 leading-8 text-ivory/78">Royal Horizon is built around direct communication, fair crew treatment, honest pricing, and local responsibility. The person helping you plan is connected to the people guiding, driving, cooking, carrying, and supporting your journey.</p>
          <a href="reasons-to-trust-us.html" class="btn-royal mt-8">Reasons to Trust Us</a>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          ${["Fair wages", "In-house tour management system", "Gear support for Kilimanjaro", "Responsible travel", "Local expertise", "Clear safety communication"]
            .map((item) => `<div class="rounded-2xl border border-white/10 bg-white/10 p-5"><p class="font-bold text-royalGold">${escapeHtml(item)}</p></div>`)
            .join("")}
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container-pad">
        ${sectionHeader("Booking Flow", "How Booking Works", "A clear process keeps the decision simple without flattening the journey into a generic package.")}
        <div class="grid gap-6 md:grid-cols-3">
          ${[
            ["01", "Select a group or private adventure", "Choose a route, safari, day trip, or custom planning path."],
            ["02", "Fill in the simple booking form", "Share dates, travellers, accommodation level, and primary contact details."],
            ["03", "Submit and our team finalizes everything", "Receive a booking reference, invoice preview, and clear next steps."]
          ]
            .map(([num, title, text]) => `<article class="premium-card p-7"><span class="font-heading text-5xl font-bold text-royalGold">${num}</span><h3 class="mt-4 font-heading text-3xl font-bold text-royalGreen">${escapeHtml(title)}</h3><p class="mt-3 leading-7 text-charcoal/70">${escapeHtml(text)}</p></article>`)
            .join("")}
        </div>
      </div>
    </section>

    <section class="section-pad bg-warmSand/40">
      <div class="container-pad">
        ${sectionHeader("Expert Assistance", "Plan With a Human Who Knows Tanzania", "Use the quick call scheduler or send a fuller planner enquiry. Both appear in the operations dashboard.")}
        <div class="grid gap-6 md:grid-cols-2">
          <a href="connect-expert.html#expert-call" class="premium-card block p-8"><h3 class="font-heading text-4xl font-bold text-royalGreen">Schedule a WhatsApp Call</h3><p class="mt-4 leading-7 text-charcoal/70">Pick a date, time, and interest so our team can prepare useful route or safari advice before speaking with you.</p><span class="btn-royal mt-6">Schedule Call</span></a>
          <a href="connect-expert.html#adventure-planner" class="premium-card block p-8"><h3 class="font-heading text-4xl font-bold text-royalGreen">Adventure Planner</h3><p class="mt-4 leading-7 text-charcoal/70">Tell us your travel style, budget, dates, and wish list so we can shape a practical Tanzania plan.</p><span class="btn-royal mt-6">Start Planner</span></a>
        </div>
      </div>
    </section>

    <section class="section-pad">
      <div class="container-pad">
        ${sectionHeader("Offers", "Current Promotions", "Helpful savings and planning bonuses for travellers who book directly.")}
        ${renderOfferTiles(offers)}
      </div>
    </section>

    <section class="section-pad bg-warmSand/35">
      <div class="container-pad">
        ${sectionHeader("Destinations", "Where Royal Horizon Takes You", "From Kilimanjaro to Serengeti, crater highlands, waterfalls, hot springs, and Zanzibar.")}
        ${renderDestinationCards(destinations.slice(0, 6))}
      </div>
    </section>

    <section class="section-pad">
      <div class="container-pad">
        ${sectionHeader("Our Stories", "Practical Travel Notes From Tanzania", "Read route comparisons, safari planning ideas, responsible travel notes, and Royal Horizon field stories.")}
        ${renderBlogCards(blogPosts.slice(0, 3))}
      </div>
    </section>

    <section class="section-pad bg-warmSand/35">
      <div class="container-pad">
        ${sectionHeader("Client Reviews", "Guest Words After Real Journeys", "Approved reviews appear here after the team checks them.")}
        <div id="home-reviews">${renderReviewCards()}</div>
        <form id="review-form" class="mt-10 rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">
          <h3 class="font-heading text-3xl font-bold text-royalGreen">Share Your Review</h3>
          <div class="mt-5 grid gap-4 md:grid-cols-3">
            <input name="name" class="form-field" placeholder="Full name" required />
            <input name="email" type="email" class="form-field" placeholder="Email" required />
            <input name="country" class="form-field" placeholder="Country" required />
            <input name="tripType" class="form-field" placeholder="Trip type" required />
            <select name="rating" class="form-select" required><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select>
            <button class="btn-royal">Submit Review</button>
            <textarea name="comment" class="form-area md:col-span-3" rows="4" placeholder="Tell us what stood out" required></textarea>
          </div>
        </form>
      </div>
    </section>

    <section class="section-pad bg-royalGreen text-ivory">
      <div class="container-pad grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p class="eyebrow">Community</p>
          <h2 class="mt-3 font-heading text-5xl font-bold">Join Our Tanzania Travel Community</h2>
          <p class="mt-4 text-ivory/76">Receive route notes, safari season guidance, and direct-booking planning ideas.</p>
        </div>
        <form id="newsletter-form" class="grid gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 md:grid-cols-4">
          <input name="name" class="input input-bordered bg-white text-charcoal md:col-span-1" placeholder="Name" required />
          <input name="email" type="email" class="input input-bordered bg-white text-charcoal md:col-span-1" placeholder="Email" required />
          <select name="interest" class="select select-bordered bg-white text-charcoal"><option>Kilimanjaro</option><option>Safari</option><option>Day Trips</option><option>Zanzibar</option></select>
          <button class="btn-royal">Join</button>
        </form>
      </div>
    </section>
  `;
  setupHeroSlider();
  setupReviewForm();
  setupNewsletterForm();
}

function renderKilimanjaro(root) {
  setPageTitle("Kilimanjaro Climbs");
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Kilimanjaro Climbs",
      title: "Choose a Kilimanjaro Route With a Real Summit Strategy",
      text: "Longer routes, careful pace, trained crews, and honest preparation give climbers a stronger chance on Africa's highest mountain.",
      image: imageLibrary.kilimanjaro,
      primary: { label: "Compare Routes", href: "#routes" },
      secondary: { label: "Ask an Expert", href: "connect-expert.html" }
    })}
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div class="lg:sticky lg:top-24">${sectionHeader("Climb Rhythm", "7-Day Summit Rhythm", "Every Kilimanjaro climb is shaped by pace, weather, route conditions, and how your body responds to altitude. This rhythm gives travellers a clear idea of how a well-paced 7-day climb can unfold, from forest entry to summit night and final descent.")}</div>
        <div class="rounded-3xl border border-royalGold/30 bg-royalGreen p-5 shadow-premium md:p-7">
          <div class="relative grid gap-4 md:gap-5 md:pl-8 before:hidden md:before:absolute md:before:bottom-4 md:before:left-3 md:before:top-4 md:before:block md:before:w-px md:before:bg-royalGold/35">
            ${[["01","Forest Entry & First Camp","Begin at the park gate, complete registration, meet the mountain crew, and walk through lush montane forest to the first overnight camp.","Forest zone"],["02","Moorland Ascent","Leave the forest zone behind and continue into open moorland with wider mountain views, unique vegetation, and a steady climb.","Steady pace"],["03","Acclimatization via Lava Tower","Climb high toward Lava Tower for acclimatization, then descend lower to support better altitude adjustment.","Acclimatization"],["04","Barranco Wall & Karanga Valley","Tackle the famous Barranco Wall, cross dramatic ridgelines, and continue toward Karanga for recovery and acclimatization.","Technical section"],["05","Barafu Summit Preparation","Move to Barafu Camp, rest, hydrate, organize summit gear, and prepare for the midnight summit push.","Summit prep"],["06","Uhuru Peak Attempt","Begin before midnight, climb toward Stella Point, continue to Uhuru Peak, then descend to a lower camp for recovery.","Summit push"],["07","Final Descent & Farewell","Descend through the forest, sign out at the gate, receive congratulations, and transfer back for rest.","Final descent"]].map(([day,title,text,detail],index)=>`<article data-rhythm-card style="opacity:0; transform: translateY(10px);" class="relative rounded-2xl border border-royalGreen/20 bg-ivory p-5 text-charcoal shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-premium md:p-6"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-xs font-bold uppercase tracking-[0.16em] text-royalGold">Day ${day}</p><span class="rounded-full bg-warmSand/70 px-3 py-1 text-xs font-semibold text-royalGreen">${detail}</span></div><h3 class="mt-3 font-heading text-2xl font-bold text-royalGreen">${title}</h3><p class="mt-3 text-[15px] leading-7 text-charcoal">${text}</p><span class="absolute -left-[1.05rem] top-6 hidden h-2.5 w-2.5 rounded-full border border-royalGold/60 bg-royalGold md:block"></span></article>`).join("")}
          </div>
        </div>
      </div>
    </section>
    <section class="section-pad pt-0">
      <div class="container-pad">
        <a href="summit-readiness.html" class="btn-royal">Check Your Summit Readiness</a>
      </div>
    </section>
    <section class="section-pad pt-0">
      <div class="container-pad">
        <a href="summit-readiness.html" class="btn-royal">Try the Kilimanjaro Readiness Check</a>
      </div>
    </section>
    <section class="section-pad bg-warmSand/35">
      <div class="container-pad grid gap-6 md:grid-cols-3">
        <article class="premium-card p-7"><h3 class="font-heading text-3xl font-bold text-royalGreen">What to Pack</h3><p class="mt-3 leading-7 text-charcoal/70">Layering, boots, headlamp, waterproof shell, warm gloves, snacks, and a realistic gear check before arrival.</p><a href="connect-expert.html" class="btn-outline-royal mt-6">Request Packing Help</a></article>
        <article class="premium-card p-7"><h3 class="font-heading text-3xl font-bold text-royalGreen">Best Routes</h3><p class="mt-3 leading-7 text-charcoal/70">Lemosho and Northern Circuit are our premium recommendations when time and budget allow.</p><a href="#routes" class="btn-outline-royal mt-6">See Routes</a></article>
        <article class="premium-card p-7"><h3 class="font-heading text-3xl font-bold text-royalGreen">Why Longer Works</h3><p class="mt-3 leading-7 text-charcoal/70">Extra days help the body adapt and give guides more control over summit-night readiness.</p><a href="blog-detail.html?post=best-time-to-climb-kilimanjaro" class="btn-outline-royal mt-6">Read Advice</a></article>
      </div>
    </section>
    <section class="section-pad">
      <div class="container-pad">
        ${sectionHeader("Route Comparison", "Mountain Routes at a Glance", "Success rate is not a guarantee. It reflects route profile, pace, preparation, and how a crew manages the climb.")}
        <div class="overflow-x-auto custom-scrollbar rounded-3xl border border-royalGreen/10 bg-white shadow-soft">
          <table class="table">
            <thead><tr class="bg-warmSand text-royalGreen"><th>Route</th><th>Days</th><th>Difficulty</th><th>Success Rate</th><th>Starting Price</th></tr></thead>
            <tbody>${kilimanjaroRoutes.map((route) => `<tr><td class="font-bold">${route.name}</td><td>${route.days}</td><td>${route.difficulty}</td><td>${route.successRate}</td><td><span data-price-usd="${route.priceFrom}" data-price-label="from">from</span></td></tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
    </section>
    <section id="routes" class="section-pad bg-warmSand/35">
      <div class="container-pad">
        ${sectionHeader("Route Packages", "Kilimanjaro Routes", "View details, compare inclusions, then book the route that fits your time and appetite for challenge.")}
        ${renderRouteCards()}
      </div>
    </section>
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-2">
        <div>${sectionHeader("Group vs Private", "Both Can Work. The Right Choice Depends on Pace.", "Group climbs can be social and efficient. Private climbs give families, couples, and goal-focused climbers more control over pace and dates.")}${renderChecklist(["Private climbs can match your exact travel dates.", "Group departures can reduce per-person cost.", "Families usually benefit from private pacing.", "Solo travellers can join open group climbs when dates align."])}</div>
        <div>${sectionHeader("FAQ", "Kilimanjaro Questions", "The common questions guests ask before committing.")}${renderFAQ(kilimanjaroRoutes[0].faqs)}</div>
      </div>
    </section>
    <section class="section-pad bg-warmSand/35">
      <div class="container-pad">${sectionHeader("Kilimanjaro Stories", "Route Notes and Mountain Advice", "Practical articles for climbers preparing with care.")}${renderBlogCards(blogPosts.filter((post) => post.category === "Kilimanjaro"))}</div>
    </section>
    ${ctaBand("Want a route recommendation before booking?", "Tell us your fitness level, travel dates, budget, and summit goal. We will help you choose with honesty.", "booking.html?type=kilimanjaro", "connect-expert.html")}
  `;
  updateCurrencyPrices();
}

function renderRouteDetail(root) {
  const slug = getParam("route");
  const route = kilimanjaroRoutes.find((item) => item.slug === slug);
  if (!route) {
    setPageTitle("Route Not Found");
    root.innerHTML = renderEmptyState("Kilimanjaro route not found", "The route link may be incomplete. Return to the route comparison and choose a climb.", "kilimanjaro.html", "Back to Kilimanjaro");
    return;
  }
  setPageTitle(route.name);
  const others = kilimanjaroRoutes.filter((item) => item.slug !== slug).slice(0, 3);
  root.innerHTML = `
    ${renderHero({ eyebrow: "Kilimanjaro Route", title: route.name, text: route.overview, image: route.image, primary: { label: "Book This Route", href: `booking.html?type=kilimanjaro&package=${route.slug}` }, secondary: { label: "Ask Expert", href: "connect-expert.html" } })}
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside class="dark-card h-fit p-7">
          <p class="eyebrow">Route Facts</p>
          <div class="mt-5 grid gap-4 text-sm">
            <p><strong class="text-royalGold">Days:</strong> ${escapeHtml(route.days)}</p>
            <p><strong class="text-royalGold">Difficulty:</strong> ${escapeHtml(route.difficulty)}</p>
            <p><strong class="text-royalGold">Success rate:</strong> ${escapeHtml(route.successRate)}</p>
            <p><strong class="text-royalGold">Starting price:</strong> <span data-price-usd="${route.priceFrom}" data-price-label="from">from</span></p>
          </div>
          <p class="mt-6 leading-7 text-ivory/76">${escapeHtml(route.recommendation)}</p>
          <a href="booking.html?type=kilimanjaro&package=${route.slug}" class="btn-royal mt-7">Book This Route</a>
        </aside>
        <div>
          ${sectionHeader("Expert Recommendation", "Why This Route Works", route.recommendation)}
          ${renderChecklist(route.highlights)}
        </div>
      </div>
    </section>
    <section class="section-pad bg-warmSand/35">
      <div class="container-pad">
        ${sectionHeader("Route Map", "A Guided Path Across the Mountain", "This demo map section shows the route concept. Royal Horizon confirms exact camp sequence and logistics during planning.")}
        <div class="rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">
          <div class="grid gap-3 md:grid-cols-4">
            ${route.itinerary.map((day) => `<div class="rounded-2xl bg-warmSand/60 p-4"><p class="text-xs font-bold text-sunset">Day ${day.day}</p><p class="font-bold text-royalGreen">${escapeHtml(day.title)}</p></div>`).join("")}
          </div>
        </div>
      </div>
    </section>
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>${sectionHeader("Full Itinerary", "Day-by-Day Route Plan", "A clear outline of how the climb builds toward the summit.")}<div class="grid gap-4">${route.itinerary.map((day) => `<article class="premium-card p-5"><p class="eyebrow">Day ${day.day}</p><h3 class="mt-2 font-heading text-2xl font-bold text-royalGreen">${escapeHtml(day.title)}</h3><p class="mt-2 leading-7 text-charcoal/70">${escapeHtml(day.details)}</p></article>`).join("")}</div></div>
        <div class="grid gap-6">
          <div>${sectionHeader("Included", "Handled by Royal Horizon")}${list(route.included)}</div>
          <div>${sectionHeader("Excluded", "Budget Separately")}${list(route.excluded)}</div>
        </div>
      </div>
    </section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("FAQ", `${route.name} Questions`)}${renderFAQ(route.faqs)}</div></section>
    <section class="section-pad"><div class="container-pad">${sectionHeader("Other Routes", "Compare Another Kilimanjaro Path")}${renderRouteCards(others)}</div></section>
    ${ctaBand("Ready to compare group and private climb dates?", "Send us your timing and we will help you choose the strongest route profile.", `booking.html?type=kilimanjaro&package=${route.slug}`, "connect-expert.html")}
  `;
  updateCurrencyPrices();
}

function renderSafaris(root) {
  setPageTitle("Tanzania Safaris");
  const categories = ["All", ...new Set(safariPackages.map((item) => item.category))];
  root.innerHTML = `
    ${renderHero({ eyebrow: "Tanzania Safaris", title: "Signature Safaris Built Around Wildlife, Timing, and Real Comfort", text: "Private safari planning with clear accommodation levels, patient guiding, transparent pricing, and routes that fit how you want to travel.", image: imageLibrary.safari, primary: { label: "View Packages", href: "#packages" }, secondary: { label: "Talk Safari", href: "connect-expert.html" } })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-2">${sectionHeader("Safari Overview", "A Strong Safari Is Designed, Not Assembled", "Royal Horizon brings together routes, guides, lodges, park timing, and guest pace so your safari feels personal without becoming complicated.")}<div class="dark-card p-7"><h3 class="font-heading text-3xl font-bold">Our Promise</h3>${list(["Direct local planning", "Private 4x4 vehicles", "Ethical wildlife viewing", "Clear accommodation choices", "Responsive support before arrival"])}</div></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Signature Royal Experience", "How Safaris Work With Royal Horizon", "You choose the travel style. We shape the route, lodge level, guiding rhythm, and payment schedule.")}<div class="grid gap-6 md:grid-cols-3">${["Budget", "Mid-range", "Luxury"].map((level) => `<article class="premium-card p-7"><h3 class="font-heading text-3xl font-bold text-royalGreen">${level}</h3><p class="mt-3 leading-7 text-charcoal/70">${level === "Budget" ? "Simple, clean lodges or camping with strong guiding and park access." : level === "Mid-range" ? "Comfortable lodges and tented camps with strong value and atmosphere." : "High-touch lodges, premium camps, and refined pacing for special journeys."}</p></article>`).join("")}</div></div></section>
    <section class="section-pad"><div class="container-pad">${sectionHeader("When to Go", "Migration and Safari Seasons", "Wildlife is present year round, but movement, weather, and park mood change by month.")}<div class="grid gap-3 md:grid-cols-4">${["Jan-Mar: southern plains and calving", "Apr-May: green season and quieter parks", "Jun-Oct: dry season and classic viewing", "Nov-Dec: short rains and refreshed landscapes"].map((item) => `<div class="rounded-2xl bg-white p-5 shadow-soft">${escapeHtml(item)}</div>`).join("")}</div></div></section>
    <section id="packages" class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Safari Packages", "Choose Your Safari Style", "Filter packages by travel reason, then open the detail page or book directly.")}<div id="safari-filters" class="mb-7 flex flex-wrap gap-3">${categories.map((cat) => `<button class="btn ${cat === "All" ? "btn-royal" : "btn-outline-royal"}" data-filter="${cat}">${cat}</button>`).join("")}</div>${renderSafariCards()}</div></section>
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-2"><div>${sectionHeader("Group vs Private", "Most Safaris Work Best Private", "Private safaris let the guide tune timing, stops, lunch breaks, and photography patience around your group.")}${renderChecklist(["Group safaris can reduce cost on fixed dates.", "Private safaris work better for families and photographers.", "Honeymoon and luxury trips should stay private.", "Friends groups often unlock excellent private value."])}</div><div>${sectionHeader("Safari FAQ", "Before You Travel")}${renderFAQ([{ question: "Can we choose lodges?", answer: "Yes. We recommend levels and then refine based on comfort, route, and budget." }, { question: "Is Zanzibar easy to add?", answer: "Yes. We coordinate the route and domestic flight timing as part of the final plan." }, { question: "Can we travel with children?", answer: "Yes. Family safaris use realistic driving days and child-friendly lodges." }])}</div></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Safari Stories", "Read Before You Go")}${renderBlogCards(blogPosts.filter((post) => post.category === "Safari" || post.category === "Zanzibar"))}</div></section>
    ${ctaBand("Need help choosing parks and lodge levels?", "Send us your dates, travellers, and comfort level. We will shape a safari that makes sense.", "booking.html?type=safari", "connect-expert.html")}
  `;
  setupFilterButtons("#safari-filters", "[data-category]");
  updateCurrencyPrices();
}

function renderSafariDetail(root) {
  const slug = getParam("package");
  const pkg = safariPackages.find((item) => item.slug === slug);
  if (!pkg) {
    root.innerHTML = renderEmptyState("Safari package not found", "Return to safari packages and choose the experience you want to review.", "safaris.html", "Back to Safaris");
    return;
  }
  setPageTitle(pkg.title);
  root.innerHTML = `
    ${renderHero({ eyebrow: pkg.category, title: pkg.title, text: pkg.overview, image: pkg.image, primary: { label: "Book This Safari", href: `booking.html?type=safari&package=${pkg.slug}` }, secondary: { label: "Talk Safari", href: "connect-expert.html" } })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><aside class="dark-card h-fit p-7"><p class="eyebrow">Package Facts</p><p class="mt-4"><strong class="text-royalGold">Duration:</strong> ${pkg.duration}</p><p class="mt-3"><strong class="text-royalGold">Destinations:</strong> ${pkg.destinations.join(", ")}</p><p class="mt-3"><strong class="text-royalGold">Starting price:</strong> <span data-price-usd="${pkg.priceFrom}" data-price-label="from">from</span></p><a href="booking.html?type=safari&package=${pkg.slug}" class="btn-royal mt-7">Book This Safari</a></aside><div>${sectionHeader("Highlights", "What Makes This Safari Work")}${renderChecklist(pkg.highlights)}</div></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Map and Route", "A Practical Northern Tanzania Flow", "The final route is confirmed after dates, lodge level, and seasonal wildlife movement are reviewed.")}<div class="grid gap-3 md:grid-cols-4">${pkg.destinations.map((item) => `<div class="rounded-2xl bg-white p-5 font-bold text-royalGreen shadow-soft">${escapeHtml(item)}</div>`).join("")}</div></div></section>
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"><div>${sectionHeader("Full Itinerary", "Safari Days")}${pkg.itinerary.map((day, index) => `<article class="premium-card mb-4 p-5"><p class="eyebrow">Day ${index + 1}</p><p class="mt-2 leading-7 text-charcoal/72">${escapeHtml(day)}</p></article>`).join("")}</div><div class="grid gap-6"><div>${sectionHeader("Included", "Covered in the Quote")}${list(pkg.included)}</div><div>${sectionHeader("Excluded", "Plan Separately")}${list(pkg.excluded)}</div><div>${sectionHeader("Accommodation", "Available Levels")}${list(pkg.accommodationOptions)}</div></div></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Other Safaris", "Compare Signature Packages")}${renderSafariCards(safariPackages.filter((item) => item.slug !== slug).slice(0, 3))}</div></section>
    ${ctaBand("Want this safari refined around your travel dates?", "Royal Horizon can adjust lodge level, route direction, and Zanzibar timing.", `booking.html?type=safari&package=${pkg.slug}`, "connect-expert.html")}
  `;
  updateCurrencyPrices();
}

function renderDayTrips(root) {
  setPageTitle("Day Trips");
  root.innerHTML = `
    ${renderHero({ eyebrow: "Day Trips", title: "Meaningful Tanzania Days Between Bigger Adventures", text: "Waterfalls, hot springs, national parks, coffee culture, and hosted local experiences shaped around your free time.", image: imageLibrary.waterfall, primary: { label: "View Day Trips", href: "#day-trips" }, secondary: { label: "Ask Expert", href: "connect-expert.html" } })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-2">${sectionHeader("Overview", "How Day Trips Work With Royal Horizon", "We confirm pickup point, timing, activity conditions, guide requirements, and what you need to bring before the day starts.")}<div class="dark-card p-7"><h3 class="font-heading text-3xl font-bold">Expert Opinion</h3><p class="mt-4 leading-7 text-ivory/76">Choose Chemka after a climb, Materuni for culture and nature, Arusha National Park for a safari taste, and coffee tours when your time is short but you still want place and people.</p></div></div></section>
    <section id="day-trips" class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Day Trip Packages", "Book a Day With Substance")}${renderDayTripCards()}</div></section>
    <section class="section-pad"><div class="container-pad">${sectionHeader("FAQ", "Day Trip Questions")}${renderFAQ([{ question: "Can day trips start in Arusha or Moshi?", answer: "Most can. We confirm pickup logistics before final quote." }, { question: "Are day trips private?", answer: "Royal Horizon can arrange private day trips and small shared options when available." }, { question: "Can I book one after Kilimanjaro?", answer: "Yes. Chemka, Materuni, and coffee tours are popular recovery days." }])}</div></section>
    ${ctaBand("Have one free day in Tanzania?", "Tell us where you are staying and what pace you want. We will recommend the right day trip.", "booking.html?type=day-trip", "connect-expert.html")}
  `;
  updateCurrencyPrices();
}

function renderDayTripDetail(root) {
  const slug = getParam("trip");
  const trip = dayTrips.find((item) => item.slug === slug);
  if (!trip) {
    root.innerHTML = renderEmptyState("Day trip not found", "Return to the day trip list and choose an experience.", "day-trips.html", "Back to Day Trips");
    return;
  }
  setPageTitle(trip.title);
  root.innerHTML = `
    ${renderHero({ eyebrow: "Day Trip", title: trip.title, text: trip.overview, image: trip.image, primary: { label: "Book Day Trip", href: `booking.html?type=day-trip&package=${trip.slug}` }, secondary: { label: "Ask Expert", href: "connect-expert.html" } })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><aside class="dark-card h-fit p-7"><p class="eyebrow">Trip Facts</p><p class="mt-4"><strong class="text-royalGold">Duration:</strong> ${trip.duration}</p><p class="mt-3"><strong class="text-royalGold">Location:</strong> ${trip.location}</p><p class="mt-3"><strong class="text-royalGold">Price:</strong> <span data-price-usd="${trip.priceFrom}" data-price-label="from">from</span></p><a href="booking.html?type=day-trip&package=${trip.slug}" class="btn-royal mt-7">Book This Day</a></aside><div>${sectionHeader("Pricing and Booking", "Simple Day Trip Planning", "Royal Horizon confirms pickup, timing, guide support, and final inclusions after your request.")}${renderChecklist(["Private pickup from Moshi or Arusha where available.", "Local guide support and activity coordination.", "Clear inclusions before you pay.", "Easy pairing with Kilimanjaro or safari itineraries."])}</div></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad grid gap-8 lg:grid-cols-2"><div>${sectionHeader("Itinerary", "What the Day Looks Like")}${list(trip.itinerary)}</div><div>${sectionHeader("Included and Excluded", "Know Before You Go")}<div class="grid gap-5"><div>${list(trip.included)}</div><div>${list(trip.excluded)}</div></div></div></div></section>
    <section class="section-pad"><div class="container-pad">${sectionHeader("Other Day Trips", "Compare Nearby Experiences")}${renderDayTripCards(dayTrips.filter((item) => item.slug !== slug).slice(0, 3))}</div></section>
    ${ctaBand("Want this day added to a larger itinerary?", "Send your dates and hotel location so we can place it in the right part of your trip.", `booking.html?type=day-trip&package=${trip.slug}`, "connect-expert.html")}
  `;
  updateCurrencyPrices();
}

function renderDestinations(root) {
  setPageTitle("Destinations");
  root.innerHTML = `${renderHero({ eyebrow: "Destinations", title: "Tanzania Places Worth Planning Properly", text: "Explore the national parks, mountain landscapes, coastal escapes, and local experiences that shape Royal Horizon journeys.", image: imageLibrary.crater, primary: { label: "View Destinations", href: "#destinations" }, secondary: { label: "Plan With Expert", href: "connect-expert.html" }, compact: true })}<section id="destinations" class="section-pad"><div class="container-pad">${sectionHeader("Destinations", "Where the Journey Can Take You")}${renderDestinationCards()}</div></section>${ctaBand("Need help connecting destinations?", "We will shape the route so transfers, wildlife timing, and rest days make sense.", "booking.html", "connect-expert.html")}`;
}

function renderDestinationDetail(root) {
  const slug = getParam("destination");
  const destination = destinations.find((item) => item.slug === slug);
  if (!destination) {
    root.innerHTML = renderEmptyState("Destination not found", "Return to the destination list and choose a Tanzania highlight.", "destinations.html", "Back to Destinations");
    return;
  }
  setPageTitle(destination.title);
  const related = destination.related.map((slugValue) => getPackageBySlug(slugValue)).filter(Boolean);
  root.innerHTML = `
    ${renderHero({ eyebrow: "Destination", title: destination.title, text: destination.overview, image: destination.image, primary: { label: "Plan This Destination", href: "connect-expert.html" }, secondary: { label: "Book Now", href: "booking.html" } })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-[1fr_0.8fr]"><div>${sectionHeader("Best Time", "When to Visit", destination.bestTime)}${sectionHeader("Why Visit", "What Makes It Worthwhile")}${renderChecklist(destination.whyVisit)}</div><aside class="dark-card h-fit p-7"><h3 class="font-heading text-3xl font-bold">Planning Note</h3><p class="mt-4 leading-7 text-ivory/76">The best itinerary depends on route direction, season, budget, and how much time you want between major highlights.</p><a href="connect-expert.html" class="btn-royal mt-7">Ask an Expert</a></aside></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Related Packages", "Journeys That Include This Place")}<div class="grid gap-6 md:grid-cols-3">${related.map((pkg) => `<a href="${packageLink(pkg)}" class="premium-card block p-6"><h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(pkg.name || pkg.title)}</h3><p class="mt-3 text-sm leading-7 text-charcoal/70">${escapeHtml(pkg.overview || "")}</p></a>`).join("") || renderEmptyState("No related packages yet", "Ask our team to build a custom route around this destination.", "connect-expert.html", "Plan Custom Trip")}</div></div></section>
    ${ctaBand("Build a route around this destination?", "Share your dates, group size, and travel style. Royal Horizon will connect the pieces.", "booking.html", "connect-expert.html")}
  `;
}

function renderBlog(root) {
  setPageTitle("Stories");
  const categories = ["All", ...new Set(blogPosts.map((post) => post.category))];
  root.innerHTML = `
    ${renderHero({ eyebrow: "Stories", title: "Tanzania Travel Notes With Useful Detail", text: "Practical articles on Kilimanjaro routes, safari timing, Zanzibar extensions, visas, direct booking, and responsible travel.", image: imageLibrary.travellers, primary: { label: "Browse Stories", href: "#stories" }, secondary: { label: "Ask Expert", href: "connect-expert.html" }, compact: true })}
    <section id="stories" class="section-pad">
      <div class="container-pad">
        <div class="mb-7 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div id="blog-filters" class="flex flex-wrap gap-3">${categories.map((cat) => `<button class="btn ${cat === "All" ? "btn-royal" : "btn-outline-royal"}" data-blog-filter="${cat}">${cat}</button>`).join("")}</div>
          <input id="blog-search" class="form-field lg:w-80" placeholder="Search by title or category" />
        </div>
        <div id="blog-grid">${renderBlogCards()}</div>
      </div>
    </section>
  `;
  setupBlogFilters();
}

function setupBlogFilters() {
  const search = document.getElementById("blog-search");
  const filters = document.getElementById("blog-filters");
  if (!search || !filters) return;
  let active = "All";
  const apply = () => {
    const term = (search.value || "").toLowerCase();
    document.querySelectorAll("[data-title]").forEach((card) => {
      const categoryMatch = active === "All" || card.dataset.category === active;
      const textMatch = card.dataset.title.includes(term) || card.dataset.category.toLowerCase().includes(term);
      card.classList.toggle("hidden", !(categoryMatch && textMatch));
    });
  };
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-blog-filter]");
    if (!button) return;
    active = button.dataset.blogFilter;
    filters.querySelectorAll("[data-blog-filter]").forEach((item) => item.classList.remove("btn-royal"));
    button.classList.add("btn-royal");
    apply();
  });
  search.addEventListener("input", apply);
}

function renderBlogDetail(root) {
  const slug = getParam("post");
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) {
    root.innerHTML = renderEmptyState("Story not found", "Return to the blog and choose another article.", "blog.html", "Back to Stories");
    return;
  }
  setPageTitle(post.title);
  const related = blogPosts.filter((item) => item.category === post.category && item.slug !== slug).slice(0, 3);
  const cta = post.category === "Kilimanjaro" ? ["Plan a Kilimanjaro climb", "booking.html?type=kilimanjaro"] : post.category === "Safari" ? ["Explore safari packages", "safaris.html"] : post.category === "Zanzibar" ? ["View Safari + Zanzibar", "safari-detail.html?package=safari-zanzibar-combo"] : post.category === "Visa Process" ? ["Ask about travel prep", "contact.html"] : ["Plan with Royal Horizon", "connect-expert.html"];
  root.innerHTML = `
    ${renderHero({ eyebrow: post.category, title: post.title, text: post.excerpt, image: post.image, primary: { label: cta[0], href: cta[1] }, secondary: { label: "All Stories", href: "blog.html" }, compact: true })}
    <section class="section-pad"><div class="container-pad max-w-4xl"><article class="prose prose-lg max-w-none rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">${post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</article></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Related Posts", "Keep Planning With Context")}${renderBlogCards(related.length ? related : blogPosts.slice(0, 3))}</div></section>
    ${ctaBand(cta[0], "A good article should lead to a clear next step. Tell us what you are considering and we will help you make it practical.", cta[1], "connect-expert.html")}
  `;
}


function renderSummitReadiness(root) {
  setPageTitle("Kilimanjaro Summit Readiness Check");
  root.innerHTML = `
    ${renderHero({ eyebrow: "Kilimanjaro Planning Tool", title: "Kilimanjaro Summit Readiness Check", text: "Answer a few simple questions about your fitness, altitude experience, route choice, and climb pace. Royal Horizon will give you a practical preparation profile to help you choose a safer and better-paced Kilimanjaro itinerary.", image: imageLibrary.kilimanjaroTrail, primary: { label: "Start Readiness Check", href: "#readiness-form" }, secondary: { label: "Talk to Expert", href: "connect-expert.html" }, compact: true })}
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form id="readiness-form" class="rounded-3xl border border-royalGreen/10 bg-ivory p-6 shadow-soft md:p-8" novalidate>
          <h2 class="font-heading text-4xl font-bold text-royalGreen">Plan Your Climb Readiness</h2>
          <p class="mt-4 rounded-2xl border border-royalGold/35 bg-warmSand/45 p-4 text-sm leading-7 text-charcoal">This readiness check is for travel planning only. It does not guarantee summit success and does not replace medical advice. Kilimanjaro performance depends on altitude response, weather, route pace, sleep, hydration, health condition, and guide decisions.</p>
          <div id="readiness-errors" class="mt-4 hidden rounded-xl border border-red-200 bg-red-100 p-3 text-sm text-red-800" role="alert"></div>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Unit system</span><select name="unit" class="form-select" required><option value="metric">Metric</option><option value="us">US units</option></select></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Age</span><input name="age" type="number" min="12" max="85" class="form-field" required /></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Gender</span><select name="gender" class="form-select" required><option>Male</option><option>Female</option><option>Prefer not to say</option></select></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Choose route</span><select name="route" class="form-select" required><option value="lemosho">Lemosho Route — 7 Days</option><option value="machame">Machame Route — 7 Days</option><option value="marangu">Marangu Route — 6 Days</option><option value="rongai">Rongai Route — 7 Days</option><option value="northern">Northern Circuit — 9 Days</option><option value="umbwe">Umbwe Route — 6 Days</option></select></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Height (cm)</span><input name="heightCm" type="number" class="form-field" required /></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Weight (kg)</span><input name="weightKg" type="number" class="form-field" required /></label>
            <label class="grid gap-2 hidden" data-us-field><span class="text-sm font-semibold text-royalGreen">Height (feet)</span><input name="heightFt" type="number" class="form-field" /></label>
            <label class="grid gap-2 hidden" data-us-field><span class="text-sm font-semibold text-royalGreen">Height (inches)</span><input name="heightIn" type="number" class="form-field" /></label>
            <label class="grid gap-2 hidden" data-us-field><span class="text-sm font-semibold text-royalGreen">Weight (lbs)</span><input name="weightLbs" type="number" class="form-field" /></label>
          </div>
          <fieldset class="mt-6">
            <legend class="text-sm font-semibold text-royalGreen">Fitness / stamina</legend>
            <div class="mt-2 grid gap-2 sm:grid-cols-2">${[["poor","Poor: I rarely exercise"],["fair","Fair: I can walk 2–5 km"],["good","Good: I can hike 5–10 km"],["excellent","Excellent: I train regularly / hike often"]].map(([v,l],i)=>`<label class="rounded-xl border border-royalGreen/15 bg-white px-3 py-2 text-sm"><input ${i===2?"checked":""} class="mr-2" type="radio" name="fitness" value="${v}" />${l}</label>`).join("")}</div>
          </fieldset>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Training frequency</span><select name="training" class="form-select"><option value="0">0 days per week</option><option value="1-2">1–2 days per week</option><option value="3-4">3–4 days per week</option><option value="5+">5+ days per week</option></select></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Altitude experience above 3,000m in last 12 months</span><select name="altitude" class="form-select"><option value="no">No</option><option value="yes">Yes</option></select></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Completed multi-day hike before</span><select name="trek" class="form-select"><option value="no">No</option><option value="yes">Yes</option></select></label>
            <label class="grid gap-2"><span class="text-sm font-semibold text-royalGreen">Health caution</span><select name="health" class="form-select"><option value="no">No</option><option value="yes">Yes</option></select></label>
          </div>
          <div class="mt-6 flex flex-wrap gap-3">
            <button class="btn-royal" type="submit">Calculate Readiness</button>
            <button class="btn-outline-royal" type="button" id="clear-readiness">Clear</button>
          </div>
        </form>
        <aside class="grid gap-5">
          <article class="premium-card overflow-hidden"><img src="${imageLibrary.kilimanjaro}" alt="Kilimanjaro trekking trail" class="h-64 w-full object-cover" /><div class="p-5"><h3 class="font-heading text-2xl font-bold text-royalGreen">Before You Book</h3><p class="mt-2 text-[15px] leading-7 text-charcoal/80">Steady pace, hydration, and conservative route planning are the three habits we reinforce on every climb.</p></div></article>
          <article class="dark-card p-6"><h3 class="font-heading text-2xl font-bold">Recommended climb rhythm</h3><p class="mt-3 text-ivory/90">Most travellers do better on 7–9 day itineraries that protect acclimatization and recovery.</p><a href="kilimanjaro.html" class="btn-royal mt-5">View Route Options</a></article>
        </aside>
      </div>
    </section>
    <section id="readiness-result" class="section-pad pt-0" aria-live="polite"></section>
    <section class="section-pad bg-warmSand/35">
      <div class="container-pad">
        ${sectionHeader("Route Guidance", "Recommended Routes for Better Acclimatization", "Longer and better-paced routes often support safer adjustment to altitude.")}
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          ${[["Northern Circuit","Best for maximum acclimatization","route-detail.html?route=northern-circuit"],["Lemosho","Scenic and balanced","route-detail.html?route=lemosho"],["Machame","Popular and adventurous","route-detail.html?route=machame"],["Rongai","Quieter northern approach","route-detail.html?route=rongai"]].map(([name,desc,href])=>`<article class="premium-card p-6"><h3 class="font-heading text-2xl font-bold text-royalGreen">${name}</h3><p class="mt-2 text-sm leading-7 text-charcoal/75">${desc}</p><a href="${href}" class="btn-outline-royal mt-5">View Route</a></article>`).join("")}
        </div>
      </div>
    </section>
    ${ctaBand("Want a guide to review your readiness profile?", "Send your travel month and route preference. We will suggest pacing, preparation priorities, and the most suitable itinerary length.", "connect-expert.html", "booking.html")}
  `;
  setupReadinessCheck();
}

function setupReadinessCheck() {
 const form=document.getElementById("readiness-form"); if(!form) return; const resultWrap=document.getElementById("readiness-result"); const errors=document.getElementById("readiness-errors");
 const usFields=[...form.querySelectorAll("[data-us-field]")];
 const unit=form.elements.unit;
 const toggleUnits=()=>{const isUs=unit.value==="us"; usFields.forEach(el=>el.classList.toggle("hidden",!isUs)); form.elements.heightCm.closest("label").classList.toggle("hidden",isUs); form.elements.weightKg.closest("label").classList.toggle("hidden",isUs);};
 unit.addEventListener("change",toggleUnits); toggleUnits();
 const routeMods={northern:12,lemosho:10,machame:8,rongai:7,marangu:2,umbwe:-8};
 const trainingMods={"0":-10,"1-2":0,"3-4":8,"5+":12}; const fitMods={poor:-15,fair:-5,good:8,excellent:15};
 function renderResult(r){resultWrap.innerHTML=`<div class="container-pad"><div class="rounded-3xl border border-royalGold/40 bg-royalGreen p-7 text-ivory shadow-premium md:p-10"><p class="text-sm uppercase tracking-[0.16em] text-royalGold">Your Summit Readiness</p><div class="mt-5 grid gap-6 lg:grid-cols-[180px_1fr]"><div class="grid h-40 w-40 place-items-center rounded-full border-4 border-royalGold text-center"><span class="text-5xl font-black text-royalGold">${r.score}%</span></div><div><p class="text-xl font-bold">${r.status}</p><p class="mt-2 text-ivory/90">${r.message}</p><div class="mt-4 grid gap-2 text-sm text-ivory/95"><p><strong class="text-royalGold">Selected Route:</strong> ${r.routeLabel}</p><p><strong class="text-royalGold">BMI:</strong> ${r.bmi.toFixed(1)} — ${r.bmiNote}</p><p><strong class="text-royalGold">Main Strength:</strong> ${r.strength}</p><p><strong class="text-royalGold">Watch Point:</strong> ${r.watch}</p><p><strong class="text-royalGold">Recommended Pace:</strong> ${r.pace}</p></div></div></div><div class="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-7">${r.advice.join(" ")}</div><p class="mt-4 rounded-2xl border border-white/20 bg-white/10 p-3 text-sm">This readiness check is for travel planning only. It does not guarantee summit success and does not replace medical advice. Kilimanjaro performance depends on altitude response, weather, route pace, sleep, hydration, health condition, and guide decisions.</p><div class="mt-6 flex flex-wrap gap-3"><a href="connect-expert.html" class="btn-royal">Talk to a Kilimanjaro Expert</a><a href="kilimanjaro.html" class="btn border-white/35 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen">View Recommended Routes</a><a href="booking.html" class="btn border-white/35 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen">Start Booking</a><button id="save-readiness" class="btn border-white/35 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen">Save Result</button></div></div></div>`;
 document.getElementById('save-readiness')?.addEventListener('click',()=>{localStorage.setItem('royalHorizonReadinessResult',JSON.stringify(r));}); }
 const validate=(d)=>{const e=[]; if(d.age<12||d.age>85)e.push('Age must be between 12 and 85.'); if(d.unit==='metric'){if(d.heightCm<100||d.heightCm>230)e.push('Height must be between 100 and 230 cm.'); if(d.weightKg<30||d.weightKg>250)e.push('Weight must be between 30 and 250 kg.');} else {if(d.heightFt<3||d.heightFt>8)e.push('Height must be between 3 and 8 feet.'); if(d.weightLbs<66||d.weightLbs>550)e.push('Weight must be between 66 and 550 lbs.');} return e;};
 form.addEventListener('submit',(ev)=>{ev.preventDefault(); const d=Object.fromEntries(new FormData(form).entries()); d.age=Number(d.age); d.heightCm=Number(d.heightCm||0); d.weightKg=Number(d.weightKg||0); d.heightFt=Number(d.heightFt||0); d.heightIn=Number(d.heightIn||0); d.weightLbs=Number(d.weightLbs||0); const errs=validate(d); if(errs.length){errors.classList.remove('hidden'); errors.innerHTML=errs.map(x=>`<p>${x}</p>`).join(''); return;} errors.classList.add('hidden'); let heightM=d.unit==='metric'?d.heightCm/100:((d.heightFt*12+d.heightIn)*0.0254); let weight=d.unit==='metric'?d.weightKg:d.weightLbs*0.453592; const bmi=weight/(heightM*heightM); let score=50; score += bmi>=18.5&&bmi<=27?10:bmi>27&&bmi<=30?5:bmi<18.5?-8:bmi<=35?-8:-15; score += d.age>=18&&d.age<=55?5:d.age>65?-5:d.age<18?-8:0; score += fitMods[d.fitness]; score += trainingMods[d.training]; score += d.altitude==='yes'?8:0; score += d.trek==='yes'?6:0; score += routeMods[d.route]; score += d.health==='yes'?-20:0; score=Math.max(25,Math.min(92,score));
 const status=score<50?["Needs More Preparation","Your current profile suggests you should prepare more before attempting Kilimanjaro. Focus on endurance training, medical clearance, and a slower route plan."]:score<65?["Developing Readiness","You may be able to prepare for Kilimanjaro with the right training and route choice. A longer itinerary and expert guidance are strongly recommended."]:score<80?["Strong Preparation Profile","Your profile shows a good foundation for a well-paced Kilimanjaro climb. Continue training, choose a route with proper acclimatization, and follow your guide’s health checks."]:["Excellent Preparation Profile","Your profile suggests strong preparation potential for Kilimanjaro. Remember that altitude response is still unpredictable, so pacing, hydration, rest, and guide decisions remain essential."];
 const pace= d.route==='umbwe'?'Prefer 7+ days or a slower alternative route':'7–9 days with careful acclimatization';
 const routeLabel=form.elements.route.options[form.elements.route.selectedIndex].text; const advice=[]; if(bmi<18.5) advice.push('Your BMI is below the general recommended range. Consider medical advice before high-altitude trekking and focus on strength, nutrition, and endurance preparation.'); if(bmi>30) advice.push('Your BMI is above the general recommended range. Kilimanjaro may still be possible for some travellers, but preparation, pacing, and medical clearance become more important.'); if(d.health==='yes') advice.push('Because you selected a health concern, medical clearance is strongly recommended before booking a high-altitude climb.'); if(d.fitness==='poor') advice.push('Begin with regular walking, stair training, and gradual hikes before committing to a summit itinerary.'); if(d.route==='umbwe') advice.push('Umbwe is steep and demanding. It is usually better for experienced trekkers. Consider Lemosho, Machame, or Northern Circuit for better acclimatization.'); if(d.route==='marangu') advice.push('Marangu is classic and hut-based, but the shorter profile can feel rushed. Consider adding an acclimatization day if possible.'); if(d.route==='northern') advice.push('Northern Circuit gives excellent acclimatization time and a quieter scenic journey around the mountain.'); if(d.route==='lemosho') advice.push('Lemosho is scenic and well-balanced, with strong acclimatization potential for many travellers.'); if(d.age<18) advice.push('Guardian/medical guidance recommended before planning a high-altitude trek.');
 const r={score,status:status[0],message:status[1],route:d.route,routeLabel,bmi,bmiNote:bmi>=18.5&&bmi<=27?'within general healthy range':bmi>30?'above general recommended range':'below general recommended range',strength:(d.fitness==='excellent'||d.training==='5+')?'Good endurance and route pacing':'Clear motivation to prepare with structure',watch:d.altitude==='no'?'No recent altitude experience':'Altitude remains unpredictable, maintain conservative pacing',pace,advice:advice.length?advice:['Choose a well-paced route, keep a moderate trekking speed, hydrate consistently, join acclimatization walks, and listen closely to your mountain guide.'],dateCreated:new Date().toISOString(),inputSummary:d,category:status[0],adviceSummary:advice.join(' ')}; renderResult(r); resultWrap.scrollIntoView({behavior:'smooth',block:'start'});});
 const saved=localStorage.getItem('royalHorizonReadinessResult'); if(saved){try{const r=JSON.parse(saved); resultWrap.innerHTML=`<div class="container-pad"><div class="rounded-2xl border border-royalGreen/15 bg-ivory p-5 shadow-soft"><p class="font-semibold text-royalGreen">Your last readiness check</p><p class="mt-1 text-sm text-charcoal/75">${r.score}% • ${r.category||r.status} • ${r.routeLabel||r.route} • ${new Date(r.dateCreated).toLocaleDateString()}</p><div class="mt-3 flex gap-3"><button id="reopen-last" class="btn-royal btn-sm">Recalculate</button><button id="clear-last" class="btn-outline-royal btn-sm">Clear result</button></div></div></div>`; document.getElementById('reopen-last')?.addEventListener('click',()=>renderResult(r)); document.getElementById('clear-last')?.addEventListener('click',()=>{localStorage.removeItem('royalHorizonReadinessResult'); resultWrap.innerHTML='';});}catch{}}
 document.getElementById('clear-readiness')?.addEventListener('click',()=>{form.reset(); toggleUnits(); errors.classList.add('hidden');});
}
function renderConnectExpert(root) {
  setPageTitle("Connect to Expert");
  root.innerHTML = `
    ${renderHero({ eyebrow: "Expert Assistance", title: "Speak With a Local Tanzania Planner", text: "Schedule a WhatsApp call or send a fuller adventure planner enquiry. Both go straight into the Royal Horizon operations dashboard.", image: imageLibrary.travellers, primary: { label: "Schedule Call", href: "#expert-call" }, secondary: { label: "Adventure Planner", href: "#adventure-planner" }, compact: true })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-2">
      <form id="expert-call-form" class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
        <p class="eyebrow" id="expert-call">WhatsApp Call</p><h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen">Schedule a WhatsApp Call</h2>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <input name="fullName" class="form-field" placeholder="Full name" required />
          <input name="email" type="email" class="form-field" placeholder="Email" required />
          <input name="whatsapp" class="form-field" placeholder="WhatsApp number" required />
          <input name="country" class="form-field" placeholder="Country" required />
          <select name="interest" class="form-select"><option>Kilimanjaro</option><option>Safari</option><option>Day Trip</option><option>Custom Trip</option></select>
          <input name="preferredDate" type="date" class="form-field" required />
          <input name="preferredTime" type="time" class="form-field" required />
          <textarea name="notes" class="form-area md:col-span-2" rows="4" placeholder="Notes"></textarea>
          <button class="btn-royal md:col-span-2">Request WhatsApp Call</button>
        </div>
      </form>
      <form id="adventure-planner-form" class="rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">
        <p class="eyebrow" id="adventure-planner">Adventure Planner</p><h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen">Simple Adventure Planner</h2>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <input name="fullName" class="form-field" placeholder="Full name" required />
          <input name="email" type="email" class="form-field" placeholder="Email" required />
          <input name="whatsapp" class="form-field" placeholder="WhatsApp number" required />
          <select name="travelType" class="form-select"><option>Kilimanjaro</option><option>Safari</option><option>Day Trip</option><option>Safari + Zanzibar</option><option>Custom Trip</option></select>
          <input name="destinationInterest" class="form-field" placeholder="Destination interest" required />
          <input name="travellers" type="number" min="1" class="form-field" placeholder="Number of travellers" required />
          <input name="travelMonth" class="form-field" placeholder="Preferred travel month" required />
          <select name="budgetRange" class="form-select"><option>Under $2,000 pp</option><option>$2,000 - $4,000 pp</option><option>$4,000 - $6,000 pp</option><option>$6,000+ pp</option><option>Flexible</option></select>
          <select name="accommodation" class="form-select"><option>Budget</option><option>Mid-range</option><option>Luxury</option></select>
          <select name="groupType" class="form-select"><option>Private</option><option>Group</option></select>
          <textarea name="specialRequests" class="form-area md:col-span-2" rows="4" placeholder="Special requests"></textarea>
          <button class="btn-royal md:col-span-2">Submit Planner</button>
        </div>
      </form>
    </div></section>
  `;
  setupExpertCallForm();
  setupAdventurePlannerForm();
}

function renderContact(root) {
  setPageTitle("Contact");
  root.innerHTML = `
    ${renderHero({ eyebrow: "Contact", title: "Reach the Royal Horizon Team in Tanzania", text: "Ask a question, request planning help, or send trip details before you book.", image: imageLibrary.camp, primary: { label: "WhatsApp Us", href: "https://wa.me/255762555019" }, secondary: { label: "Schedule Expert", href: "connect-expert.html" }, compact: true })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-[0.85fr_1.15fr]"><aside class="dark-card h-fit p-7"><h2 class="font-heading text-4xl font-bold">Office and Support</h2><div class="mt-6 grid gap-3 text-ivory/78"><p><strong class="text-royalGold">WhatsApp:</strong> ${BRAND.whatsapp}</p><p><strong class="text-royalGold">Email:</strong> ${BRAND.email}</p><p><strong class="text-royalGold">Location:</strong> ${BRAND.location}</p></div><div class="mt-7 rounded-2xl border border-white/10 bg-white/10 p-5">Map placeholder: Moshi, Kilimanjaro Region, Tanzania</div></aside><form id="contact-form" class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft"><h2 class="font-heading text-4xl font-bold text-royalGreen">Send a Message</h2><div class="mt-6 grid gap-4 md:grid-cols-2"><input name="fullName" class="form-field" placeholder="Full name" required /><input name="email" type="email" class="form-field" placeholder="Email" required /><input name="whatsapp" class="form-field" placeholder="WhatsApp number" /><input name="subject" class="form-field" placeholder="Subject" required /><input name="travelMonth" class="form-field" placeholder="Travel month" /><input name="travellers" type="number" min="1" class="form-field" placeholder="Travellers" /><textarea name="message" class="form-area md:col-span-2" rows="5" placeholder="How can we help?" required></textarea><button class="btn-royal md:col-span-2">Send Message</button></div></form></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Support Note", "Clear Questions Receive Clear Answers", "Include your travel dates, traveller count, preferred style, and any fixed flights if you already have them. That helps us reply with practical next steps.")}</div></section>
  `;
  setupContactForm();
}

function renderAbout(root) {
  setPageTitle("About");
  root.innerHTML = `
    ${renderHero({ eyebrow: "About Royal Horizon", title: "Locally Owned, Globally Professional, Warmly Tanzanian", text: "Royal Horizon Tours was built to give travellers a direct line to the people who understand Tanzania on the ground.", image: imageLibrary.culture, primary: { label: "Plan With Us", href: "connect-expert.html" }, secondary: { label: "Why Trust Us", href: "reasons-to-trust-us.html" }, compact: true })}
    <section class="section-pad"><div class="container-pad grid gap-8 lg:grid-cols-2"><div>${sectionHeader("Brand Story", "We Keep the Journey Close to Home", "Royal Horizon is based in Tanzania and focused only on Tanzania adventures. That focus helps us stay close to our guides, drivers, partners, parks, seasons, and guest needs.")}${renderChecklist(["Locally owned and locally operated", "Mission: make premium Tanzania travel clear and personal", "Values: honesty, safety, warmth, fair work, and responsible travel"])}</div><div class="dark-card p-7"><h3 class="font-heading text-4xl font-bold">Our Guide Culture</h3><p class="mt-4 leading-8 text-ivory/76">A good guide does more than know roads or trails. A good guide reads people, weather, wildlife movement, energy, and timing. Royal Horizon builds around that human skill.</p></div></div></section>
    <section class="section-pad bg-warmSand/35"><div class="container-pad">${sectionHeader("Team and Responsibility", "The People Behind the Journey")}${renderServiceCards([{ title: "Mountain Crews", text: "Guides, cooks, and porters who make Kilimanjaro possible through skill, stamina, and care.", image: imageLibrary.kilimanjaroTrail, href: "kilimanjaro.html", cta: "View Climbs" }, { title: "Safari Guides", text: "Driver guides who know wildlife, route timing, guest comfort, and the patience a strong safari requires.", image: imageLibrary.safari, href: "safaris.html", cta: "View Safaris" }, { title: "Local Hosts", text: "Community guides and hosts who help day trips feel connected to place rather than staged.", image: imageLibrary.culture, href: "day-trips.html", cta: "View Day Trips" }])}</div></section>
    ${ctaBand("Ready to plan with a locally owned company?", "Start with a call or booking request and we will keep the process direct.", "booking.html", "connect-expert.html")}
  `;
}

function renderTrust(root) {
  setPageTitle("Reasons to Trust Us");
  root.innerHTML = `
    ${renderHero({ eyebrow: "Reasons to Trust Us", title: "Premium Travel Needs Proof, Not Decoration", text: "From fair crew care to transparent pricing and direct communication, trust is built into the way Royal Horizon handles a journey.", image: imageLibrary.kilimanjaroTrail, primary: { label: "Start Booking", href: "booking.html" }, secondary: { label: "Talk to Expert", href: "connect-expert.html" }, compact: true })}
    <section id="signature-experience" class="section-pad"><div class="container-pad">${sectionHeader("Founder Promise", "Clear Planning, Fair Work, Strong Support", "We want every traveller to know what they are paying for, who is supporting them, and how their trip is handled before they arrive.")}<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${["In-house tour management system", "Fair wages", "Responsible tourism", "Gear support", "Transparent pricing", "Direct booking", "Full client support", "Local expertise", "Safety and communication"].map((item) => `<article class="premium-card p-6"><h3 class="font-heading text-2xl font-bold text-royalGreen">${escapeHtml(item)}</h3><p class="mt-3 text-sm leading-7 text-charcoal/70">A practical operating standard Royal Horizon uses to keep the guest experience reliable and accountable.</p></article>`).join("")}</div></div></section>
    ${ctaBand("Want to see how this applies to your trip?", "Send us your idea and we will explain the route, inclusions, support team, and payment path clearly.", "booking.html", "connect-expert.html")}
  `;
}

function renderPolicy(root, type) {
  const policies = {
    booking: ["Booking requests are reviewed before final confirmation.", "A booking reference confirms that your request has entered the Royal Horizon planning system.", "Dates, accommodation, and final inclusions are confirmed by the operations team before official payment instructions.", "Guests should share accurate traveller details, dietary needs, medical notes, and arrival information as early as possible."],
    payment: ["Royal Horizon normally uses a deposit to secure arrangements and a balance payment before travel.", "Payment instructions are confirmed directly by the team after booking review.", "This website preview contains simulated payment actions and does not collect live card or bank details.", "Receipts and invoice updates are linked to the booking reference."],
    refund: ["Refund handling depends on supplier deadlines, park rules, accommodation terms, and how close the cancellation is to departure.", "Non-recoverable supplier costs may be deducted from any refund.", "Where possible, Royal Horizon will help move dates instead of cancelling the journey.", "Refund requests should be sent in writing with the booking reference."],
    privacy: ["Royal Horizon collects contact and travel details only to plan, manage, and support guest journeys.", "Guest information is used for enquiries, bookings, preparation forms, invoices, and operational communication.", "We do not sell traveller information.", "Guests can request correction or removal of stored planning details by contacting the team."]
  };
  const titles = { booking: "Booking Policy", payment: "Payment Policy", refund: "Refund Policy", privacy: "Privacy Policy" };
  setPageTitle(titles[type]);
  root.innerHTML = `
    ${renderHero({ eyebrow: "Policy", title: titles[type], text: "Simple, practical terms for clear planning and guest confidence.", image: imageLibrary.lodge, primary: { label: "Book Now", href: "booking.html" }, secondary: { label: "Contact Us", href: "contact.html" }, compact: true })}
    <section class="section-pad"><div class="container-pad max-w-4xl"><div class="rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">${list(policies[type])}<p class="mt-6 rounded-2xl bg-warmSand/60 p-5 text-sm leading-7 text-charcoal/72">For trip-specific questions, contact ${BRAND.email} or WhatsApp ${BRAND.whatsapp} with your booking reference.</p></div></div></section>
  `;
}


function initRhythmCards() {
  const cards = document.querySelectorAll("[data-rhythm-card]");
  if (!cards.length) return;
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${Math.min(index * 70, 360)}ms`;
    observer.observe(card);
  });
}

function init() {
  seedDemoData();
  renderNavbar();
  renderFooter();
  renderStickyCtas();
  const root = document.getElementById("page-root");
  const page = document.body.dataset.page || "home";
  const routes = {
    home: renderHome,
    kilimanjaro: renderKilimanjaro,
    "route-detail": renderRouteDetail,
    safaris: renderSafaris,
    "safari-detail": renderSafariDetail,
    "day-trips": renderDayTrips,
    "day-trip-detail": renderDayTripDetail,
    destinations: renderDestinations,
    "destination-detail": renderDestinationDetail,
    blog: renderBlog,
    "blog-detail": renderBlogDetail,
    about: renderAbout,
    "reasons-to-trust-us": renderTrust,
    contact: renderContact,
    "connect-expert": renderConnectExpert,
    "summit-readiness": renderSummitReadiness,
    booking: renderBookingPage,
    "booking-success": renderBookingSuccessPage,
    payment: renderPaymentPage,
    "client-portal": renderClientPortalPage,
    admin: renderAdminPage,
    "booking-policy": (target) => renderPolicy(target, "booking"),
    "payment-policy": (target) => renderPolicy(target, "payment"),
    "refund-policy": (target) => renderPolicy(target, "refund"),
    "privacy-policy": (target) => renderPolicy(target, "privacy")
  };
  (routes[page] || renderHome)(root);
  initRhythmCards();
  updateCurrencyPrices();
}

document.addEventListener("DOMContentLoaded", init);
