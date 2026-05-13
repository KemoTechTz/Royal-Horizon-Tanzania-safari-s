import { getAllPackages, getPackageBySlug, getPackageLabel, STORAGE_KEYS } from "./data.js";
import { addItem, findItem, getData } from "./storage.js";
import { downloadInvoice, renderInvoicePreview } from "./invoice.js";
import { escapeHtml, formatPrice, renderEmptyState, renderHero, renderStatusBadge, showToast, updateCurrencyPrices } from "./ui.js";
import { getParam, serializeForm, setPageTitle } from "./router-utils.js";
import { imageLibrary } from "./data.js";

const serviceLabels = {
  kilimanjaro: "Kilimanjaro",
  safari: "Safari",
  "day-trip": "Day Trip",
  custom: "Custom"
};

const accommodationMultipliers = {
  Budget: 0.92,
  "Mid-range": 1,
  Luxury: 1.22
};

function packageOptions(type) {
  const packages = getAllPackages().filter((item) => !type || type === "custom" || item.type === type);
  return packages
    .map((item) => `<option value="${item.slug}" data-type="${item.type}">${escapeHtml(item.label)}</option>`)
    .join("");
}

function getSelectedPackage(form) {
  const slug = form.packageSlug.value;
  return getPackageBySlug(slug);
}

function estimateAmount(form) {
  const pkg = getSelectedPackage(form);
  const base = Number(pkg?.priceFrom || 1250);
  const travellers = Math.max(Number(form.travellers.value || 1), 1);
  const groupMultiplier = form.groupType.value === "Private" ? 1.1 : 0.96;
  const accommodationMultiplier = accommodationMultipliers[form.accommodation.value] || 1;
  const serviceType = form.serviceType.value;
  if (serviceType === "day-trip") return Math.round(base * travellers);
  return Math.round(base * travellers * groupMultiplier * accommodationMultiplier);
}

function nextBookingNumbers() {
  const bookings = getData(STORAGE_KEYS.bookings, []);
  const sequence = String(41 + bookings.length).padStart(4, "0");
  const year = new Date().getFullYear();
  return {
    reference: `RH-${year}-${sequence}`,
    invoiceNumber: `INV-RH-${sequence}`
  };
}

function summaryHtml(form) {
  const amount = estimateAmount(form);
  const deposit = Math.round(amount * 0.3);
  const balance = amount - deposit;
  const pkg = getSelectedPackage(form);
  const included = pkg?.included?.slice(0, 4) || ["Local planning support", "Direct Royal Horizon coordination", "Clear payment schedule"];
  return `
    <div class="grid gap-4 rounded-3xl border border-royalGreen/10 bg-white p-6 shadow-soft">
      <div class="grid gap-4 md:grid-cols-2">
        <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-sunset">Service</p><p class="font-heading text-2xl font-bold text-royalGreen">${escapeHtml(serviceLabels[form.serviceType.value] || "Custom")}</p></div>
        <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-sunset">Package</p><p class="font-heading text-2xl font-bold text-royalGreen">${escapeHtml(pkg?.name || pkg?.title || "Custom Adventure")}</p></div>
        <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-sunset">Date</p><p class="font-bold">${escapeHtml(form.preferredDate.value || "To be confirmed")}</p></div>
        <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-sunset">Travellers</p><p class="font-bold">${escapeHtml(form.travellers.value || "1")} - ${escapeHtml(form.groupType.value)}</p></div>
        <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-sunset">Accommodation</p><p class="font-bold">${escapeHtml(form.accommodation.value)}</p></div>
        <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-sunset">Estimated Price</p><p class="font-heading text-3xl font-bold text-royalGreen">${formatPrice(amount, form.currency.value)}</p></div>
      </div>
      <div class="rounded-2xl bg-warmSand/60 p-5">
        <p class="font-bold text-royalGreen">Included summary</p>
        <ul class="mt-3 grid gap-2 text-sm text-charcoal/72">
          ${included.map((item) => `<li>- ${escapeHtml(item)}</li>`).join("")}
        </ul>
        <p class="mt-4 text-sm text-charcoal/72">Deposit estimate: <strong>${formatPrice(deposit, form.currency.value)}</strong>. Balance estimate: <strong>${formatPrice(balance, form.currency.value)}</strong>.</p>
      </div>
    </div>
  `;
}

export function renderBookingPage(root) {
  setPageTitle("Book Your Adventure");
  const queryType = getParam("type", "kilimanjaro");
  const queryPackage = getParam("package", "");
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Booking",
      title: "Reserve Your Tanzania Adventure",
      text: "Share the essentials now. Royal Horizon reviews every booking personally before final confirmation.",
      image: imageLibrary.camp,
      primary: { label: "Talk to Expert", href: "connect-expert.html" },
      secondary: { label: "Booking Policy", href: "booking-policy.html" },
      compact: true
    })}
    <section class="section-pad">
      <div class="container-pad grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="dark-card h-fit p-7">
          <p class="eyebrow">Three clear steps</p>
          <h2 class="mt-3 font-heading text-4xl font-bold">No middlemen. No confusing handoff.</h2>
          <div class="mt-7 grid gap-4 text-sm text-ivory/78">
            <p><strong class="text-royalGold">1.</strong> Select your route or package.</p>
            <p><strong class="text-royalGold">2.</strong> Share primary traveller details.</p>
            <p><strong class="text-royalGold">3.</strong> Review estimate, accept terms, and receive your reference.</p>
          </div>
        </aside>
        <div class="rounded-3xl border border-royalGreen/10 bg-warmSand/45 p-4 shadow-soft md:p-7">
          <div class="mb-6 grid grid-cols-3 gap-2 text-center text-sm font-extrabold">
            <span class="rounded-full bg-royalGreen px-3 py-2 text-ivory" data-step-pill="1">Adventure</span>
            <span class="rounded-full bg-white px-3 py-2 text-royalGreen" data-step-pill="2">Traveller</span>
            <span class="rounded-full bg-white px-3 py-2 text-royalGreen" data-step-pill="3">Confirm</span>
          </div>
          <form id="booking-form" class="grid gap-6">
            <section data-step="1" class="grid gap-5">
              <h2 class="font-heading text-3xl font-bold text-royalGreen">Step 1: Adventure Details</h2>
              <div class="grid gap-4 md:grid-cols-2">
                <label class="form-control"><span class="label-text font-bold">Service type</span><select name="serviceType" class="form-select" required>
                  <option value="kilimanjaro">Kilimanjaro</option>
                  <option value="safari">Safari</option>
                  <option value="day-trip">Day Trip</option>
                  <option value="custom">Custom</option>
                </select></label>
                <label class="form-control"><span class="label-text font-bold">Route or package</span><select name="packageSlug" class="form-select" required>${packageOptions(queryType)}</select></label>
                <label class="form-control"><span class="label-text font-bold">Group or private</span><select name="groupType" class="form-select" required><option>Private</option><option>Group</option></select></label>
                <label class="form-control"><span class="label-text font-bold">Preferred date</span><input name="preferredDate" type="date" class="form-field" required /></label>
                <label class="form-control"><span class="label-text font-bold">Number of travellers</span><input name="travellers" type="number" min="1" value="2" class="form-field" required /></label>
                <label class="form-control"><span class="label-text font-bold">Accommodation level</span><select name="accommodation" class="form-select" required><option>Budget</option><option selected>Mid-range</option><option>Luxury</option></select></label>
                <label class="form-control md:col-span-2"><span class="label-text font-bold">Currency</span><select name="currency" class="form-select" required><option>USD</option><option>TZS</option><option>EUR</option><option>GBP</option></select></label>
              </div>
            </section>
            <section data-step="2" class="hidden grid gap-5">
              <h2 class="font-heading text-3xl font-bold text-royalGreen">Step 2: Primary Information</h2>
              <div class="grid gap-4 md:grid-cols-2">
                <label class="form-control"><span class="label-text font-bold">Full name</span><input name="fullName" class="form-field" required /></label>
                <label class="form-control"><span class="label-text font-bold">Email</span><input name="email" type="email" class="form-field" required /></label>
                <label class="form-control"><span class="label-text font-bold">WhatsApp number</span><input name="whatsapp" class="form-field" required /></label>
                <label class="form-control"><span class="label-text font-bold">Country</span><input name="country" class="form-field" required /></label>
                <label class="form-control md:col-span-2"><span class="label-text font-bold">Travel notes</span><textarea name="travelNotes" class="form-area" rows="4"></textarea></label>
                <label class="form-control md:col-span-2"><span class="label-text font-bold">Special requirements</span><textarea name="specialRequirements" class="form-area" rows="3"></textarea></label>
              </div>
            </section>
            <section data-step="3" class="hidden grid gap-5">
              <h2 class="font-heading text-3xl font-bold text-royalGreen">Step 3: Confirmation</h2>
              <div id="booking-summary"></div>
              <label class="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-7">
                <input type="checkbox" name="terms" class="checkbox mt-1 border-royalGreen" required />
                <span>I understand this is a booking request. Royal Horizon will review availability, confirm the final quote, and send official payment instructions before live payment.</span>
              </label>
            </section>
            <div class="flex flex-col gap-3 border-t border-royalGreen/10 pt-5 sm:flex-row sm:justify-between">
              <button type="button" class="btn-outline-royal hidden" id="booking-prev">Back</button>
              <button type="button" class="btn-royal sm:ml-auto" id="booking-next">Continue</button>
              <button type="submit" class="btn-royal hidden" id="booking-submit">Submit Booking</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `;
  setupBookingForm({ queryType, queryPackage });
}

function setupBookingForm({ queryType, queryPackage }) {
  const form = document.getElementById("booking-form");
  if (!form) return;
  let step = 1;
  form.serviceType.value = queryType;
  form.packageSlug.innerHTML = packageOptions(queryType);
  if (queryPackage) form.packageSlug.value = queryPackage;
  form.currency.value = localStorage.getItem(STORAGE_KEYS.currency) || "USD";

  const showStep = () => {
    document.querySelectorAll("[data-step]").forEach((section) => section.classList.toggle("hidden", section.dataset.step !== String(step)));
    document.querySelectorAll("[data-step-pill]").forEach((pill) => {
      const active = pill.dataset.stepPill === String(step);
      pill.classList.toggle("bg-royalGreen", active);
      pill.classList.toggle("text-ivory", active);
      pill.classList.toggle("bg-white", !active);
      pill.classList.toggle("text-royalGreen", !active);
    });
    document.getElementById("booking-prev").classList.toggle("hidden", step === 1);
    document.getElementById("booking-next").classList.toggle("hidden", step === 3);
    document.getElementById("booking-submit").classList.toggle("hidden", step !== 3);
    if (step === 3) document.getElementById("booking-summary").innerHTML = summaryHtml(form);
  };

  const fieldsForStep = (currentStep) => [...document.querySelector(`[data-step="${currentStep}"]`).querySelectorAll("input, select, textarea")];
  const validateStep = () => fieldsForStep(step).every((field) => field.reportValidity());

  form.serviceType.addEventListener("change", () => {
    form.packageSlug.innerHTML = packageOptions(form.serviceType.value);
  });
  form.addEventListener("input", () => {
    if (step === 3) document.getElementById("booking-summary").innerHTML = summaryHtml(form);
  });
  window.addEventListener("rh:currency-change", () => {
    form.currency.value = localStorage.getItem(STORAGE_KEYS.currency) || "USD";
    if (step === 3) document.getElementById("booking-summary").innerHTML = summaryHtml(form);
  });
  document.getElementById("booking-next").addEventListener("click", () => {
    if (!validateStep()) return;
    step = Math.min(step + 1, 3);
    showStep();
  });
  document.getElementById("booking-prev").addEventListener("click", () => {
    step = Math.max(step - 1, 1);
    showStep();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateStep() || !form.reportValidity()) return;
    const data = serializeForm(form);
    const pkg = getSelectedPackage(form);
    const amount = estimateAmount(form);
    const deposit = Math.round(amount * 0.3);
    const { reference, invoiceNumber } = nextBookingNumbers();
    const booking = {
      id: reference,
      reference,
      invoiceNumber,
      serviceType: data.serviceType,
      packageSlug: data.packageSlug,
      packageName: pkg?.name || pkg?.title || getPackageLabel(data.packageSlug),
      groupType: data.groupType,
      preferredDate: data.preferredDate,
      travellers: Number(data.travellers),
      accommodation: data.accommodation,
      currency: data.currency,
      estimatedAmount: amount,
      depositAmount: deposit,
      balanceAmount: amount - deposit,
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      country: data.country,
      travelNotes: data.travelNotes || "",
      specialRequirements: data.specialRequirements || "",
      bookingStatus: "Pending Review",
      paymentStatus: "Unpaid",
      messages: ["Your booking request has been received. Our team will review the route, availability, and final quote."],
      createdAt: new Date().toISOString()
    };
    addItem(STORAGE_KEYS.bookings, booking);
    addItem(STORAGE_KEYS.payments, {
      id: `PAY-${reference}`,
      reference,
      invoiceNumber,
      clientName: booking.fullName,
      email: booking.email,
      amount,
      depositAmount: deposit,
      balanceAmount: amount - deposit,
      currency: data.currency,
      paymentStatus: "Unpaid",
      method: "",
      updatedAt: new Date().toISOString()
    });
    showToast(`Booking reference ${reference} created.`);
    window.location.href = `booking-success.html?ref=${encodeURIComponent(reference)}`;
  });
  showStep();
  updateCurrencyPrices();
}

export function renderBookingSuccessPage(root) {
  const ref = getParam("ref");
  const booking = findItem(STORAGE_KEYS.bookings, ref);
  const payment = findItem(STORAGE_KEYS.payments, ref);
  setPageTitle("Booking Success");
  if (!booking) {
    root.innerHTML = renderEmptyState("Booking reference not found", "Check your reference or open the client portal to look up your trip.", "client-portal.html", "Open Client Portal");
    return;
  }
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Booking received",
      title: "Your Royal Horizon Reference Is Ready",
      text: "Keep this reference for payment, client portal access, and preparation forms.",
      image: imageLibrary.travellers,
      primary: { label: "Go to Payment", href: `payment.html?ref=${booking.reference}` },
      secondary: { label: "Open Client Portal", href: "client-portal.html" },
      compact: true
    })}
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
          <p class="eyebrow">Booking Reference</p>
          <h2 class="mt-3 font-heading text-5xl font-bold text-royalGreen">${escapeHtml(booking.reference)}</h2>
          <div class="mt-6 grid gap-3">
            <p><strong>Package:</strong> ${escapeHtml(booking.packageName)}</p>
            <p><strong>Client:</strong> ${escapeHtml(booking.fullName)}</p>
            <p><strong>Date:</strong> ${escapeHtml(booking.preferredDate)}</p>
            <p><strong>Booking status:</strong> ${renderStatusBadge(booking.bookingStatus)}</p>
            <p><strong>Payment status:</strong> ${renderStatusBadge(booking.paymentStatus)}</p>
          </div>
          <div class="mt-7 grid gap-3 sm:grid-cols-2">
            <button class="btn-outline-royal" id="download-invoice">Download Invoice</button>
            <a class="btn-royal" href="payment.html?ref=${booking.reference}">Go to Payment</a>
            <a class="btn-outline-royal" href="client-portal.html">Open Client Portal</a>
            <a class="btn-outline-royal" href="index.html">Back to Home</a>
          </div>
        </div>
        <div>${renderInvoicePreview(booking, payment)}</div>
      </div>
    </section>
  `;
  document.getElementById("download-invoice")?.addEventListener("click", () => downloadInvoice(booking, payment));
}
