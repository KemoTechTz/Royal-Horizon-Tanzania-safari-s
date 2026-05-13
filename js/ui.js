import {
  BRAND,
  EXCHANGE_RATES,
  LANGUAGES,
  STORAGE_KEYS,
  blogPosts,
  dayTrips,
  destinations,
  kilimanjaroRoutes,
  safariPackages,
  serviceCards
} from "./data.js";
import { getData } from "./storage.js";
import { currentPageName } from "./router-utils.js";

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getCurrency() {
  return localStorage.getItem(STORAGE_KEYS.currency) || "USD";
}

export function setCurrency(currency) {
  localStorage.setItem(STORAGE_KEYS.currency, currency);
  updateCurrencyPrices();
}

export function getLanguage() {
  return localStorage.getItem(STORAGE_KEYS.language) || "en";
}

export function setLanguage(language) {
  localStorage.setItem(STORAGE_KEYS.language, language);
  document.querySelectorAll("[data-language-switch]").forEach((select) => {
    select.value = language;
  });
  showToast(`Language set to ${LANGUAGES.find((item) => item.code === language)?.label || "English"}. Full translation is coming soon.`, "info");
}

export function formatPrice(amountUsd = 0, currency = getCurrency()) {
  const rate = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
  const value = Number(amountUsd || 0) * rate.rate;
  const rounded = currency === "TZS" ? Math.round(value / 1000) * 1000 : Math.round(value);
  return `${rate.symbol}${rounded.toLocaleString()} ${currency === "USD" ? "" : currency}`.trim();
}

export function priceMarkup(amountUsd, label = "from") {
  return `<span class="font-extrabold text-royalGreen" data-price-usd="${Number(amountUsd || 0)}" data-price-label="${escapeHtml(label)}">${escapeHtml(label)} ${formatPrice(amountUsd)}</span>`;
}

export function updateCurrencyPrices() {
  const currency = getCurrency();
  document.querySelectorAll("[data-price-usd]").forEach((node) => {
    const label = node.dataset.priceLabel || "from";
    node.textContent = `${label} ${formatPrice(Number(node.dataset.priceUsd), currency)}`;
  });
  document.querySelectorAll("[data-currency-switch]").forEach((select) => {
    select.value = currency;
  });
  window.dispatchEvent(new CustomEvent("rh:currency-change", { detail: { currency } }));
}

function activeClass(href) {
  const page = currentPageName();
  const normalized = href.replace(".html", "").split("?")[0];
  return normalized === page || (page === "index" && href === "index.html") ? "text-royalGold" : "text-ivory/86";
}

export function renderNavbar() {
  const target = document.getElementById("site-header");
  if (!target) return;
  const currency = getCurrency();
  const language = getLanguage();
  target.innerHTML = `
    <div class="sticky top-0 z-50 border-b border-white/10 bg-royalGreen/95 text-ivory shadow-lg backdrop-blur">
      <div class="container-pad">
        <div class="navbar min-h-[76px] px-0">
          <div class="navbar-start gap-3">
            <button class="btn btn-ghost px-2 text-ivory lg:hidden" id="mobile-menu-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu">
              <span class="text-lg font-bold leading-none">Menu</span>
            </button>
            <a href="index.html" class="flex items-center gap-3">
              <span class="grid h-12 w-12 place-items-center rounded-full border border-royalGold/50 bg-ivory text-lg font-black text-royalGreen">RH</span>
              <span class="leading-tight">
                <span class="block font-heading text-xl font-bold tracking-normal">Royal Horizon</span>
                <span class="block text-xs font-semibold uppercase tracking-[0.22em] text-royalGold">Tours Tanzania</span>
              </span>
            </a>
          </div>
          <nav class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal items-center gap-1 px-1 text-sm font-bold">
              <li><a class="${activeClass("index.html")}" href="index.html">Home</a></li>
              <li class="dropdown dropdown-hover">
                <button class="${activeClass("kilimanjaro.html")}">Services</button>
                <ul class="dropdown-content menu z-[60] mt-3 w-72 rounded-box bg-ivory p-3 text-charcoal shadow-premium">
                  <li><a href="kilimanjaro.html">Kilimanjaro Climbs</a></li>
                  <li><a href="safaris.html">Signature Tanzania Safaris</a></li>
                  <li><a href="reasons-to-trust-us.html#signature-experience">Signature Royal Experience</a></li>
                  <li><a href="day-trips.html">Day Trips</a></li>
                </ul>
              </li>
              <li><a class="${activeClass("destinations.html")}" href="destinations.html">Destinations</a></li>
              <li><a class="${activeClass("blog.html")}" href="blog.html">Blogs</a></li>
              <li><a class="${activeClass("about.html")}" href="about.html">About Us</a></li>
              <li><a class="${activeClass("contact.html")}" href="contact.html">Contact</a></li>
              <li><a class="${activeClass("connect-expert.html")}" href="connect-expert.html">Connect to Our Expert</a></li>
              <li><a class="${activeClass("client-portal.html")}" href="client-portal.html">Client Portal</a></li>
              <li><a class="${activeClass("admin.html")}" href="admin.html">Admin</a></li>
            </ul>
          </nav>
          <div class="navbar-end hidden gap-2 lg:flex">
            <select class="select select-sm border-white/20 bg-royalGreen text-ivory" data-currency-switch aria-label="Currency">
              ${Object.keys(EXCHANGE_RATES).map((code) => `<option value="${code}" ${code === currency ? "selected" : ""}>${code}</option>`).join("")}
            </select>
            <select class="select select-sm border-white/20 bg-royalGreen text-ivory" data-language-switch aria-label="Language">
              ${LANGUAGES.map((item) => `<option value="${item.code}" ${item.code === language ? "selected" : ""}>${item.label}</option>`).join("")}
            </select>
            <a href="booking.html" class="btn-royal btn-sm">Plan My Adventure</a>
          </div>
        </div>
        <div id="mobile-menu" class="hidden border-t border-white/10 py-4 lg:hidden">
          <div class="grid gap-2 text-sm font-bold">
            <a href="index.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Home</a>
            <a href="kilimanjaro.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Kilimanjaro Climbs</a>
            <a href="safaris.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Signature Tanzania Safaris</a>
            <a href="reasons-to-trust-us.html#signature-experience" class="rounded-xl px-3 py-3 hover:bg-white/10">Signature Royal Experience</a>
            <a href="day-trips.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Day Trips</a>
            <a href="destinations.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Destinations</a>
            <a href="blog.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Blogs</a>
            <a href="about.html" class="rounded-xl px-3 py-3 hover:bg-white/10">About Us</a>
            <a href="contact.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Contact</a>
            <a href="connect-expert.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Connect to Our Expert</a>
            <a href="client-portal.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Client Portal</a>
            <a href="admin.html" class="rounded-xl px-3 py-3 hover:bg-white/10">Admin</a>
            <a href="booking.html" class="btn-royal mt-2">Book Now</a>
            <div class="grid grid-cols-2 gap-3 px-3 pt-2">
              <select class="select select-sm border-white/20 bg-royalGreen text-ivory" data-currency-switch aria-label="Currency">
                ${Object.keys(EXCHANGE_RATES).map((code) => `<option value="${code}" ${code === currency ? "selected" : ""}>${code}</option>`).join("")}
              </select>
              <select class="select select-sm border-white/20 bg-royalGreen text-ivory" data-language-switch aria-label="Language">
                ${LANGUAGES.map((item) => `<option value="${item.code}" ${item.code === language ? "selected" : ""}>${item.label}</option>`).join("")}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("mobile-menu-toggle")?.addEventListener("click", (event) => {
    const menu = document.getElementById("mobile-menu");
    const isHidden = menu?.classList.toggle("hidden");
    event.currentTarget.setAttribute("aria-expanded", String(!isHidden));
    document.body.classList.toggle("overflow-hidden", !isHidden);
  });
  document.querySelectorAll("#mobile-menu a").forEach((link) =>
    link.addEventListener("click", () => {
      document.getElementById("mobile-menu")?.classList.add("hidden");
      document.getElementById("mobile-menu-toggle")?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
    })
  );
  bindPreferenceSwitches();
}

export function bindPreferenceSwitches() {
  document.querySelectorAll("[data-currency-switch]").forEach((select) => {
    select.addEventListener("change", (event) => setCurrency(event.target.value));
  });
  document.querySelectorAll("[data-language-switch]").forEach((select) => {
    select.addEventListener("change", (event) => setLanguage(event.target.value));
  });
}

export function renderFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;
  target.innerHTML = `
    <footer class="bg-charcoal text-ivory">
      <div class="container-pad grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div class="flex items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-full bg-royalGold text-lg font-black text-charcoal">RH</span>
            <div>
              <p class="font-heading text-2xl font-bold">Royal Horizon Tours</p>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-royalGold">Locally owned in Tanzania</p>
            </div>
          </div>
          <p class="mt-5 max-w-md text-sm leading-7 text-ivory/76">${BRAND.tagline}</p>
          <div class="mt-5 grid gap-2 text-sm text-ivory/78">
            <a href="https://wa.me/255762555019" class="hover:text-royalGold">WhatsApp: ${BRAND.whatsapp}</a>
            <a href="mailto:${BRAND.email}" class="hover:text-royalGold">Email: ${BRAND.email}</a>
            <span>${BRAND.location}</span>
          </div>
        </div>
        <div>
          <h3 class="font-heading text-xl font-bold">Explore</h3>
          <div class="mt-4 grid gap-2 text-sm text-ivory/76">
            <a href="kilimanjaro.html" class="hover:text-royalGold">Kilimanjaro Routes</a>
            <a href="safaris.html" class="hover:text-royalGold">Tanzania Safaris</a>
            <a href="day-trips.html" class="hover:text-royalGold">Day Trips</a>
            <a href="destinations.html" class="hover:text-royalGold">Destinations</a>
            <a href="blog.html" class="hover:text-royalGold">Stories</a>
          </div>
        </div>
        <div>
          <h3 class="font-heading text-xl font-bold">Guest Tools</h3>
          <div class="mt-4 grid gap-2 text-sm text-ivory/76">
            <a href="connect-expert.html" class="hover:text-royalGold">Schedule Expert Call</a>
            <a href="booking.html" class="hover:text-royalGold">Booking Form</a>
            <a href="payment.html" class="hover:text-royalGold">Payment Portal</a>
            <a href="client-portal.html" class="hover:text-royalGold">Client Portal</a>
            <a href="admin.html" class="hover:text-royalGold">Admin Portal</a>
          </div>
        </div>
        <div>
          <h3 class="font-heading text-xl font-bold">Policies</h3>
          <div class="mt-4 grid gap-2 text-sm text-ivory/76">
            <a href="booking-policy.html" class="hover:text-royalGold">Booking Policy</a>
            <a href="payment-policy.html" class="hover:text-royalGold">Payment Policy</a>
            <a href="refund-policy.html" class="hover:text-royalGold">Refund Policy</a>
            <a href="privacy-policy.html" class="hover:text-royalGold">Privacy Policy</a>
          </div>
          <a href="payment.html" class="btn-royal btn-sm mt-6">Open Payment</a>
        </div>
      </div>
      <div class="border-t border-white/10 py-5">
        <div class="container-pad flex flex-col gap-2 text-xs text-ivory/58 sm:flex-row sm:items-center sm:justify-between">
          <span>Royal Horizon Tours. Direct planning platform for Tanzania adventures.</span>
          <span>Transparent planning. Local management. Premium Tanzania journeys.</span>
        </div>
      </div>
    </footer>
  `;
}

export function renderStickyCtas() {
  const target = document.getElementById("sticky-cta");
  if (!target) return;
  target.innerHTML = `
    <div class="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 lg:flex">
      <a href="connect-expert.html" class="btn-royal shadow-premium">Plan My Adventure</a>
      <a href="booking.html" class="btn bg-royalGreen text-ivory shadow-premium hover:bg-charcoal">Book Now</a>
      <a href="connect-expert.html#expert-call" class="btn border-royalGold bg-ivory text-royalGreen shadow-premium hover:bg-warmSand">Talk to an Expert</a>
    </div>
    <div class="sticky-bottom-safe fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-royalGreen/10 bg-ivory p-2 shadow-premium lg:hidden">
      <a href="connect-expert.html" class="btn btn-sm bg-royalGreen text-ivory">Plan</a>
      <a href="booking.html" class="btn-royal btn-sm">Book</a>
      <a href="connect-expert.html#expert-call" class="btn btn-sm border-royalGreen bg-white text-royalGreen">Expert</a>
    </div>
  `;
}

export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast toast-top toast-end z-[90]";
    document.body.appendChild(container);
  }
  const styles = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning"
  };
  const alert = document.createElement("div");
  alert.className = `alert ${styles[type] || styles.success} max-w-sm shadow-premium`;
  alert.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(alert);
  setTimeout(() => alert.remove(), 4200);
}

export function openModal(title, bodyHtml, actionsHtml = "") {
  let modal = document.getElementById("global-modal");
  if (!modal) {
    modal = document.createElement("dialog");
    modal.id = "global-modal";
    modal.className = "modal";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box max-w-3xl bg-ivory">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" aria-label="Close">x</button>
      </form>
      <h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(title)}</h3>
      <div class="prose prose-stone mt-5 max-w-none">${bodyHtml}</div>
      ${actionsHtml ? `<div class="modal-action">${actionsHtml}</div>` : ""}
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  `;
  modal.showModal();
}

export function closeModal() {
  document.getElementById("global-modal")?.close();
}

export function renderStatusBadge(status = "Pending Review") {
  const map = {
    "Pending Review": "bg-royalGold/20 text-savannah border-royalGold/30",
    Contacted: "bg-iceBlue text-royalGreen border-royalGreen/20",
    Confirmed: "bg-royalGreen/12 text-royalGreen border-royalGreen/20",
    "Invoice Sent": "bg-iceBlue text-royalGreen border-royalGreen/20",
    "Deposit Paid": "bg-royalGreen text-ivory border-royalGreen",
    "Fully Paid": "bg-charcoal text-ivory border-charcoal",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
    Completed: "bg-royalGold text-charcoal border-royalGold",
    Unpaid: "bg-red-100 text-red-800 border-red-200",
    "Deposit Pending": "bg-royalGold/20 text-savannah border-royalGold/30",
    "Payment Under Review": "bg-iceBlue text-royalGreen border-royalGreen/20",
    Refunded: "bg-slate-100 text-slate-700 border-slate-200",
    New: "bg-royalGold/20 text-savannah border-royalGold/30",
    Scheduled: "bg-iceBlue text-royalGreen border-royalGreen/20",
    Converted: "bg-royalGreen text-ivory border-royalGreen",
    Approved: "bg-royalGreen text-ivory border-royalGreen",
    Rejected: "bg-red-100 text-red-800 border-red-200"
  };
  return `<span class="inline-flex rounded-full border px-3 py-1 text-xs font-extrabold ${map[status] || "bg-slate-100 text-slate-700 border-slate-200"}">${escapeHtml(status)}</span>`;
}

export function renderEmptyState(title, text, href = "index.html", label = "Back to Home") {
  return `
    <section class="section-pad">
      <div class="container-pad">
        <div class="mx-auto max-w-2xl rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-10 text-center shadow-soft">
          <p class="eyebrow">Nothing to show yet</p>
          <h1 class="mt-3 font-heading text-4xl font-bold text-royalGreen">${escapeHtml(title)}</h1>
          <p class="mt-4 text-charcoal/70">${escapeHtml(text)}</p>
          <a href="${href}" class="btn-royal mt-7">${escapeHtml(label)}</a>
        </div>
      </div>
    </section>
  `;
}

export function renderFAQ(faqs = []) {
  return `
    <div class="grid gap-3">
      ${faqs
        .map(
          (faq, index) => `
          <div class="collapse collapse-plus rounded-2xl border border-royalGreen/10 bg-white shadow-sm">
            <input type="radio" name="faq-accordion" ${index === 0 ? "checked" : ""} />
            <div class="collapse-title text-lg font-extrabold text-royalGreen">${escapeHtml(faq.question)}</div>
            <div class="collapse-content text-charcoal/70"><p>${escapeHtml(faq.answer)}</p></div>
          </div>`
        )
        .join("")}
    </div>
  `;
}

export function sectionHeader(eyebrow, title, text = "") {
  return `
    <div class="mb-10 max-w-3xl">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen md:text-5xl">${escapeHtml(title)}</h2>
      ${text ? `<p class="mt-4 text-lg leading-8 text-charcoal/70">${escapeHtml(text)}</p>` : ""}
    </div>
  `;
}

export function renderHero({ eyebrow = "Royal Horizon Tours", title, text, image, primary, secondary, compact = false }) {
  const heightClass = compact ? "min-h-[420px]" : "min-h-[620px]";
  return `
    <section class="relative ${heightClass} overflow-hidden bg-royalGreen text-ivory">
      <img src="${image}" alt="${escapeHtml(title)}" class="absolute inset-0 h-full w-full object-cover" />
      <div class="hero-overlay absolute inset-0"></div>
      <div class="container-pad relative flex ${heightClass} items-center py-20">
        <div class="max-w-3xl">
          <p class="eyebrow">${escapeHtml(eyebrow)}</p>
          <h1 class="mt-5 font-heading text-5xl font-bold leading-tight text-balance md:text-7xl">${escapeHtml(title)}</h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-ivory/82">${escapeHtml(text)}</p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            ${primary ? `<a href="${primary.href}" class="btn-royal">${escapeHtml(primary.label)}</a>` : ""}
            ${secondary ? `<a href="${secondary.href}" class="btn border-white/40 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen">${escapeHtml(secondary.label)}</a>` : ""}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderServiceCards(items = serviceCards) {
  return `
    <div class="grid gap-6 md:grid-cols-3">
      ${items
        .map(
          (item) => `
        <article class="premium-card overflow-hidden">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" class="h-64 w-full object-cover" />
          <div class="p-6">
            <h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(item.title)}</h3>
            <p class="mt-3 min-h-24 text-sm leading-7 text-charcoal/70">${escapeHtml(item.text)}</p>
            <a href="${item.href}" class="btn-outline-royal mt-6">${escapeHtml(item.cta || "Discover Now")}</a>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderRouteCards(items = kilimanjaroRoutes) {
  return `
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      ${items
        .map(
          (route) => `
        <article class="premium-card overflow-hidden">
          <img src="${route.image}" alt="${escapeHtml(route.name)}" class="h-56 w-full object-cover" />
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(route.name)}</h3>
              <span class="rounded-full bg-iceBlue px-3 py-1 text-xs font-extrabold text-royalGreen">${escapeHtml(route.successRate)}</span>
            </div>
            <p class="mt-3 text-sm leading-7 text-charcoal/70">${escapeHtml(route.overview.slice(0, 150))}...</p>
            <dl class="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-xl bg-warmSand/60 p-3"><dt class="font-bold text-royalGreen">Days</dt><dd>${escapeHtml(route.days)}</dd></div>
              <div class="rounded-xl bg-warmSand/60 p-3"><dt class="font-bold text-royalGreen">Difficulty</dt><dd>${escapeHtml(route.difficulty)}</dd></div>
            </dl>
            <p class="mt-5">${priceMarkup(route.priceFrom)}</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="route-detail.html?route=${route.slug}" class="btn-outline-royal">View Route</a>
              <a href="booking.html?type=kilimanjaro&package=${route.slug}" class="btn-royal">Book This Route</a>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderSafariCards(items = safariPackages) {
  return `
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      ${items
        .map(
          (item) => `
        <article class="premium-card overflow-hidden" data-category="${escapeHtml(item.category)}">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" class="h-56 w-full object-cover" />
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(item.title)}</h3>
              <span class="rounded-full bg-warmSand px-3 py-1 text-xs font-extrabold text-savannah">${escapeHtml(item.duration)}</span>
            </div>
            <p class="mt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-sunset">${escapeHtml(item.category)}</p>
            <p class="mt-3 text-sm leading-7 text-charcoal/70">${escapeHtml(item.overview.slice(0, 155))}...</p>
            <p class="mt-4 text-sm text-charcoal/70"><strong class="text-royalGreen">Destinations:</strong> ${item.destinations.map(escapeHtml).join(", ")}</p>
            <p class="mt-5">${priceMarkup(item.priceFrom)}</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="safari-detail.html?package=${item.slug}" class="btn-outline-royal">View Package</a>
              <a href="booking.html?type=safari&package=${item.slug}" class="btn-royal">Book This Safari</a>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderDayTripCards(items = dayTrips) {
  return `
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      ${items
        .map(
          (trip) => `
        <article class="premium-card overflow-hidden">
          <img src="${trip.image}" alt="${escapeHtml(trip.title)}" class="h-56 w-full object-cover" />
          <div class="p-6">
            <h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(trip.title)}</h3>
            <p class="mt-2 text-sm font-bold text-sunset">${escapeHtml(trip.location)} - ${escapeHtml(trip.duration)}</p>
            <p class="mt-3 text-sm leading-7 text-charcoal/70">${escapeHtml(trip.overview)}</p>
            <p class="mt-5">${priceMarkup(trip.priceFrom)}</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="day-trip-detail.html?trip=${trip.slug}" class="btn-outline-royal">View Trip</a>
              <a href="booking.html?type=day-trip&package=${trip.slug}" class="btn-royal">Book Day Trip</a>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderDestinationCards(items = destinations) {
  return `
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      ${items
        .map(
          (item) => `
        <article class="premium-card overflow-hidden">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" class="h-56 w-full object-cover" />
          <div class="p-6">
            <h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(item.title)}</h3>
            <p class="mt-3 text-sm leading-7 text-charcoal/70">${escapeHtml(item.overview.slice(0, 165))}...</p>
            <a href="destination-detail.html?destination=${item.slug}" class="btn-outline-royal mt-6">Explore Destination</a>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderBlogCards(items = blogPosts) {
  return `
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      ${items
        .map(
          (post) => `
        <article class="premium-card overflow-hidden" data-category="${escapeHtml(post.category)}" data-title="${escapeHtml(post.title.toLowerCase())}">
          <img src="${post.image}" alt="${escapeHtml(post.title)}" class="h-56 w-full object-cover" />
          <div class="p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-sunset">${escapeHtml(post.category)}</p>
            <h3 class="mt-3 font-heading text-3xl font-bold leading-tight text-royalGreen">${escapeHtml(post.title)}</h3>
            <p class="mt-3 text-sm leading-7 text-charcoal/70">${escapeHtml(post.excerpt)}</p>
            <a href="blog-detail.html?post=${post.slug}" class="btn-outline-royal mt-6">Read Story</a>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderReviewCards(items = null) {
  const reviews = (items || getData(STORAGE_KEYS.reviews, [])).filter((review) => review.approved);
  if (!reviews.length) {
    return renderEmptyState("Reviews are being prepared", "Approved guest reviews will appear here after the team checks them.", "connect-expert.html", "Plan Your Trip");
  }
  return `
    <div class="grid gap-6 md:grid-cols-3">
      ${reviews
        .slice(0, 6)
        .map(
          (review) => `
        <article class="rounded-2xl border border-royalGreen/10 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="font-heading text-2xl font-bold text-royalGreen">${escapeHtml(review.name)}</h3>
              <p class="text-sm font-bold text-sunset">${escapeHtml(review.country)} - ${escapeHtml(review.tripType)}</p>
            </div>
            <span class="rounded-full bg-royalGold px-3 py-1 text-sm font-black text-charcoal">${Number(review.rating || 5)}/5</span>
          </div>
          <p class="mt-5 leading-7 text-charcoal/72">"${escapeHtml(review.comment)}"</p>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderOfferTiles(items) {
  return `
    <div class="grid gap-4 md:grid-cols-4">
      ${items
        .map(
          (offer) => `
        <article class="rounded-2xl border border-royalGold/30 bg-warmSand/70 p-6 shadow-soft">
          <span class="rounded-full bg-royalGreen px-3 py-1 text-xs font-extrabold text-ivory">${escapeHtml(offer.tag)}</span>
          <h3 class="mt-4 font-heading text-2xl font-bold text-royalGreen">${escapeHtml(offer.title)}</h3>
          <p class="mt-3 text-sm leading-7 text-charcoal/70">${escapeHtml(offer.text)}</p>
        </article>`
        )
        .join("")}
    </div>
  `;
}

export function renderChecklist(items) {
  return `
    <div class="grid gap-3">
      ${items
        .map(
          (item) => `
        <div class="flex gap-3 rounded-2xl border border-royalGreen/10 bg-white p-4 shadow-sm">
          <span class="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royalGold text-xs font-black text-charcoal">&#10003;</span>
          <p class="leading-7 text-charcoal/74">${escapeHtml(item)}</p>
        </div>`
        )
        .join("")}
    </div>
  `;
}

export function setupHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;
  const slides = [...slider.querySelectorAll("[data-slide]")];
  const dots = [...slider.querySelectorAll("[data-slide-dot]")];
  let active = 0;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("opacity-100", slideIndex === active);
      slide.classList.toggle("pointer-events-auto", slideIndex === active);
      slide.classList.toggle("opacity-0", slideIndex !== active);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("bg-royalGold", dotIndex === active);
      dot.classList.toggle("bg-white/40", dotIndex !== active);
    });
  };
  dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
  slider.querySelector("[data-next-slide]")?.addEventListener("click", () => show(active + 1));
  slider.querySelector("[data-prev-slide]")?.addEventListener("click", () => show(active - 1));
  show(0);
  setInterval(() => show(active + 1), 7000);
}

export function setupFilterButtons(containerSelector, cardSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const cards = [...document.querySelectorAll(cardSelector)];
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const filter = button.dataset.filter;
    container.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("btn-royal"));
    button.classList.add("btn-royal");
    cards.forEach((card) => {
      const visible = filter === "All" || card.dataset.category === filter;
      card.classList.toggle("hidden", !visible);
    });
  });
}

export function bindModalButtons() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-modal-title]");
    if (!trigger) return;
    openModal(trigger.dataset.modalTitle, trigger.dataset.modalBody || "");
  });
}
