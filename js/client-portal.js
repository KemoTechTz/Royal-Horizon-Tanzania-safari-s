import { STORAGE_KEYS, imageLibrary } from "./data.js";
import { downloadInvoice } from "./invoice.js";
import { findItem, getData, upsertItem } from "./storage.js";
import { escapeHtml, renderEmptyState, renderHero, renderStatusBadge, showToast } from "./ui.js";
import { serializeForm, setPageTitle } from "./router-utils.js";

function bookingForDemoClient() {
  return getData(STORAGE_KEYS.bookings, []).find((booking) => booking.email === "client@example.com") || getData(STORAGE_KEYS.bookings, [])[0];
}

function findBookingByLookup(reference, email) {
  return getData(STORAGE_KEYS.bookings, []).find(
    (booking) => booking.reference.toLowerCase() === reference.toLowerCase() && booking.email.toLowerCase() === email.toLowerCase()
  );
}

function getClientForm(reference) {
  return getData(STORAGE_KEYS.clientForms, []).find((form) => form.reference === reference) || {};
}

function checklist(booking) {
  const form = getClientForm(booking.reference);
  return [
    { label: "Booking reviewed by Royal Horizon", done: booking.bookingStatus !== "Pending Review" },
    { label: "Deposit or payment instruction handled", done: ["Deposit Paid", "Fully Paid"].includes(booking.paymentStatus) },
    { label: "Passport information submitted", done: Boolean(form.passportNumber) },
    { label: "Arrival and departure details submitted", done: Boolean(form.arrivalDetails && form.departureDetails) },
    { label: "Dietary and medical notes checked", done: Boolean(form.dietary || form.medical) },
    { label: "Gear rental request reviewed", done: Boolean(form.gearRental) }
  ];
}

export function renderClientPortalPage(root) {
  setPageTitle("Client Portal");
  const sessionRef = sessionStorage.getItem("rh_client_ref");
  const booking = sessionRef ? findItem(STORAGE_KEYS.bookings, sessionRef) : null;
  if (booking) {
    renderPortal(root, booking);
    return;
  }
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Client Portal",
      title: "Your Trip Details, Forms, and Invoice in One Place",
      text: "Use the demo login or look up a booking with your reference and email.",
      image: imageLibrary.travellers,
      primary: { label: "Book an Adventure", href: "booking.html" },
      secondary: { label: "Contact Support", href: "contact.html" },
      compact: true
    })}
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-2">
        <form id="client-demo-login" class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
          <p class="eyebrow">Demo login</p>
          <h2 class="mt-3 font-ui text-4xl font-bold text-royalGreen">Client Sign In</h2>
          <div class="mt-6 grid gap-4">
            <label class="form-control"><span class="label-text font-bold">Email</span><input name="email" type="email" value="client@example.com" class="form-field" required /></label>
            <label class="form-control"><span class="label-text font-bold">Password</span><input name="password" type="password" value="client123" class="form-field" required /></label>
            <button class="btn-royal">Login</button>
          </div>
        </form>
        <form id="booking-lookup" class="rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">
          <p class="eyebrow">Booking lookup</p>
          <h2 class="mt-3 font-ui text-4xl font-bold text-royalGreen">Find Your Booking</h2>
          <div class="mt-6 grid gap-4">
            <label class="form-control"><span class="label-text font-bold">Booking reference</span><input name="reference" class="form-field" placeholder="RH-2026-0041" required /></label>
            <label class="form-control"><span class="label-text font-bold">Email</span><input name="email" type="email" class="form-field" placeholder="client@example.com" required /></label>
            <button class="btn-outline-royal">Open Booking</button>
          </div>
        </form>
      </div>
    </section>
  `;
  setupClientLogin(root);
}

function setupClientLogin(root) {
  document.getElementById("client-demo-login")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = serializeForm(event.currentTarget);
    if (data.email !== "client@example.com" || data.password !== "client123") {
      showToast("Use client@example.com and client123 for the demo client portal.", "error");
      return;
    }
    const booking = bookingForDemoClient();
    if (!booking) {
      root.innerHTML = renderEmptyState("No client bookings found", "Seed demo data from the admin dashboard, then return to the portal.", "admin.html", "Open Admin");
      return;
    }
    sessionStorage.setItem("rh_client_ref", booking.reference);
    renderPortal(root, booking);
  });
  document.getElementById("booking-lookup")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = serializeForm(event.currentTarget);
    const booking = findBookingByLookup(data.reference, data.email);
    if (!booking) {
      showToast("No booking matched that reference and email.", "error");
      return;
    }
    sessionStorage.setItem("rh_client_ref", booking.reference);
    renderPortal(root, booking);
  });
}

function renderPortal(root, booking) {
  const payment = findItem(STORAGE_KEYS.payments, booking.reference);
  const form = getClientForm(booking.reference);
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Client Portal",
      title: `Welcome, ${booking.fullName.split(" ")[0]}`,
      text: "Review your booking, payment status, trip forms, invoice, and preparation checklist.",
      image: imageLibrary.camp,
      primary: { label: "Payment Page", href: `payment.html?ref=${booking.reference}` },
      secondary: { label: "Download Invoice", href: "#invoice" },
      compact: true
    })}
    <section class="section-pad">
      <div class="container-pad grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <aside class="grid gap-6">
          <div class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="eyebrow">Booking</p>
                <h2 class="mt-2 font-ui text-4xl font-bold text-royalGreen">${escapeHtml(booking.reference)}</h2>
              </div>
              <button class="btn btn-sm border-royalGreen bg-white text-royalGreen" id="client-logout">Logout</button>
            </div>
            <div class="mt-6 grid gap-3 text-sm">
              <p><strong>Package:</strong> ${escapeHtml(booking.packageName)}</p>
              <p><strong>Date:</strong> ${escapeHtml(booking.preferredDate || "To be confirmed")}</p>
              <p><strong>Travellers:</strong> ${escapeHtml(booking.travellers)}</p>
              <p><strong>Booking status:</strong> ${renderStatusBadge(booking.bookingStatus)}</p>
              <p><strong>Payment status:</strong> ${renderStatusBadge(payment?.paymentStatus || booking.paymentStatus)}</p>
            </div>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <button class="btn-outline-royal" id="client-invoice">Download Invoice</button>
              <a class="btn-royal" href="payment.html?ref=${booking.reference}">Open Payment</a>
            </div>
          </div>
          <div class="rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">
            <p class="eyebrow">Preparation Checklist</p>
            <div class="mt-5 grid gap-3">
              ${checklist(booking)
                .map(
                  (item) => `
                <div class="flex items-center gap-3 rounded-2xl bg-warmSand/45 p-3">
                  <span class="grid h-7 w-7 place-items-center rounded-full ${item.done ? "bg-royalGreen text-ivory" : "bg-white text-royalGreen"}">${item.done ? "OK" : "--"}</span>
                  <span class="text-sm font-bold text-charcoal/76">${escapeHtml(item.label)}</span>
                </div>`
                )
                .join("")}
            </div>
          </div>
          <div class="rounded-3xl border border-royalGreen/10 bg-royalGreen p-7 text-ivory shadow-soft">
            <p class="eyebrow">Messages</p>
            <div class="mt-5 grid gap-3 text-sm text-ivory/78">
              ${(booking.messages || ["Royal Horizon will add trip updates here."])
                .map((message) => `<p class="rounded-2xl bg-white/10 p-4">${escapeHtml(message)}</p>`)
                .join("")}
            </div>
          </div>
        </aside>
        <div class="rounded-3xl border border-royalGreen/10 bg-warmSand/45 p-4 shadow-soft md:p-7">
          <p class="eyebrow">Travel forms</p>
          <h2 class="mt-3 font-ui text-4xl font-bold text-royalGreen">Prepare Your Journey</h2>
          <form id="client-forms" class="mt-6 grid gap-4">
            <div class="grid gap-4 md:grid-cols-2">
              <label class="form-control"><span class="label-text font-bold">Personal information</span><input name="personalName" class="form-field" value="${escapeHtml(form.personalName || booking.fullName)}" required /></label>
              <label class="form-control"><span class="label-text font-bold">Passport information</span><input name="passportNumber" class="form-field" value="${escapeHtml(form.passportNumber || "")}" placeholder="Passport number and nationality" /></label>
              <label class="form-control"><span class="label-text font-bold">Arrival details</span><textarea name="arrivalDetails" class="form-area" rows="3">${escapeHtml(form.arrivalDetails || "")}</textarea></label>
              <label class="form-control"><span class="label-text font-bold">Departure details</span><textarea name="departureDetails" class="form-area" rows="3">${escapeHtml(form.departureDetails || "")}</textarea></label>
              <label class="form-control"><span class="label-text font-bold">Dietary requirements</span><textarea name="dietary" class="form-area" rows="3">${escapeHtml(form.dietary || "")}</textarea></label>
              <label class="form-control"><span class="label-text font-bold">Medical/fitness notes</span><textarea name="medical" class="form-area" rows="3">${escapeHtml(form.medical || "")}</textarea></label>
              <label class="form-control"><span class="label-text font-bold">Gear rental request</span><textarea name="gearRental" class="form-area" rows="3">${escapeHtml(form.gearRental || "")}</textarea></label>
              <div class="grid gap-4">
                <label class="form-control"><span class="label-text font-bold">Emergency contact name</span><input name="emergencyName" class="form-field" value="${escapeHtml(form.emergencyName || "")}" /></label>
                <label class="form-control"><span class="label-text font-bold">Emergency contact phone</span><input name="emergencyPhone" class="form-field" value="${escapeHtml(form.emergencyPhone || "")}" /></label>
              </div>
            </div>
            <button class="btn-royal">Save Travel Forms</button>
          </form>
        </div>
      </div>
    </section>
  `;
  document.getElementById("client-logout")?.addEventListener("click", () => {
    sessionStorage.removeItem("rh_client_ref");
    renderClientPortalPage(root);
  });
  document.getElementById("client-invoice")?.addEventListener("click", () => downloadInvoice(booking, payment));
  document.getElementById("client-forms")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = serializeForm(event.currentTarget);
    upsertItem(STORAGE_KEYS.clientForms, booking.reference, {
      id: `FORM-${booking.reference}`,
      reference: booking.reference,
      ...data,
      updatedAt: new Date().toISOString()
    });
    showToast("Travel preparation forms saved.");
    renderPortal(root, findItem(STORAGE_KEYS.bookings, booking.reference));
  });
}
