import {
  STORAGE_KEYS,
  bookingStatuses,
  dayTrips,
  expertCallStatuses,
  imageLibrary,
  kilimanjaroRoutes,
  paymentStatuses,
  safariPackages
} from "./data.js";
import { downloadInvoice, renderInvoicePreview } from "./invoice.js";
import { resetDemoData, seedDemoData } from "./demo-data.js";
import { addItem, findItem, generateId, getData, updateItem, upsertItem } from "./storage.js";
import { escapeHtml, formatPrice, openModal, renderHero, renderStatusBadge, showToast } from "./ui.js";
import { serializeForm, setPageTitle } from "./router-utils.js";

let activeTab = "overview";

function stats() {
  const bookings = getData(STORAGE_KEYS.bookings, []);
  const payments = getData(STORAGE_KEYS.payments, []);
  const enquiries = getData(STORAGE_KEYS.enquiries, []);
  const calls = getData(STORAGE_KEYS.expertCalls, []);
  const reviews = getData(STORAGE_KEYS.reviews, []);
  const newsletter = getData(STORAGE_KEYS.newsletter, []);
  return {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((item) => item.bookingStatus === "Pending Review").length,
    calls: calls.filter((item) => item.status !== "Completed").length,
    newsletter: newsletter.length,
    pendingReviews: reviews.filter((item) => !item.approved && item.status !== "Rejected").length,
    revenue: bookings.reduce((sum, item) => sum + Number(item.estimatedAmount || 0), 0),
    pendingPayments: payments.filter((item) => !["Deposit Paid", "Fully Paid"].includes(item.paymentStatus)).length,
    enquiries: enquiries.filter((item) => item.status !== "Archived").length
  };
}

function statusOptions(items, selected) {
  return items.map((item) => `<option ${item === selected ? "selected" : ""}>${escapeHtml(item)}</option>`).join("");
}

function allPackages() {
  return [
    ...kilimanjaroRoutes.map((item) => ({ slug: item.slug, title: item.name, type: "Kilimanjaro", priceFrom: item.priceFrom })),
    ...safariPackages.map((item) => ({ slug: item.slug, title: item.title, type: "Safari", priceFrom: item.priceFrom })),
    ...dayTrips.map((item) => ({ slug: item.slug, title: item.title, type: "Day Trip", priceFrom: item.priceFrom }))
  ];
}

function packageSettings(slug) {
  return getData(STORAGE_KEYS.adminNotes, []).find((item) => item.type === "package-setting" && item.slug === slug) || { active: true, featured: false };
}

export function renderAdminPage(root) {
  setPageTitle("Admin Dashboard");
  if (sessionStorage.getItem("rh_admin_session") === "true") {
    renderDashboard(root);
    return;
  }
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Admin",
      title: "Royal Horizon Operations Dashboard",
      text: "Manage bookings, calls, enquiries, payments, reviews, newsletter leads, and package visibility from one operations view.",
      image: imageLibrary.kilimanjaroTrail,
      primary: { label: "Client Portal", href: "client-portal.html" },
      secondary: { label: "Back to Site", href: "index.html" },
      compact: true
    })}
    <section class="section-pad">
      <div class="container-pad">
        <form id="admin-login" class="mx-auto max-w-xl rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
          <p class="eyebrow">Secure team access</p>
          <h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen">Admin Login</h2>
          <div class="mt-6 grid gap-4">
            <label class="form-control"><span class="label-text font-bold">Email</span><input name="email" type="email" class="form-field" value="admin@royalhorizon.com" required /></label>
            <label class="form-control"><span class="label-text font-bold">Password</span><input name="password" type="password" class="form-field" value="admin123" required /></label>
            <button class="btn-royal">Login</button>
          </div>
        </form>
      </div>
    </section>
  `;
  document.getElementById("admin-login")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = serializeForm(event.currentTarget);
    if (data.email === "admin@royalhorizon.com" && data.password === "admin123") {
      sessionStorage.setItem("rh_admin_session", "true");
      renderDashboard(root);
    } else {
      showToast("Use admin@royalhorizon.com and admin123.", "error");
    }
  });
}

function renderDashboard(root) {
  const data = stats();
  root.innerHTML = `
    <section class="bg-royalGreen py-10 text-ivory">
      <div class="container-pad flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="eyebrow">Admin Dashboard</p>
          <h1 class="mt-3 font-heading text-5xl font-bold">Royal Horizon Control Room</h1>
          <p class="mt-3 max-w-2xl text-ivory/76">Operations view for bookings, enquiries, payment states, reviews, package settings, and demo data tools.</p>
        </div>
        <button id="admin-logout" class="btn border-white/30 bg-white/10 text-ivory hover:bg-white hover:text-royalGreen">Logout</button>
      </div>
    </section>
    <section class="section-pad">
      <div class="container-pad">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          ${[
            ["Total bookings", data.totalBookings],
            ["Pending bookings", data.pendingBookings],
            ["Expert calls", data.calls],
            ["Newsletter leads", data.newsletter],
            ["Pending reviews", data.pendingReviews],
            ["Estimated revenue", formatPrice(data.revenue, "USD")],
            ["Pending payments", data.pendingPayments]
          ]
            .map(
              ([label, value]) => `
            <article class="rounded-2xl border border-royalGreen/10 bg-white p-5 shadow-soft">
              <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-sunset">${label}</p>
              <p class="mt-3 font-heading text-3xl font-bold text-royalGreen">${value}</p>
            </article>`
            )
            .join("")}
        </div>
        <div class="mt-8 overflow-x-auto">
          <div class="tabs tabs-boxed w-max bg-warmSand/70" id="admin-tabs">
            ${["overview", "bookings", "enquiries", "expert-calls", "reviews", "newsletter", "packages", "payments", "demo-tools"]
              .map((tab) => `<button class="tab ${activeTab === tab ? "tab-active" : ""}" data-admin-tab="${tab}">${tab.replace("-", " ")}</button>`)
              .join("")}
          </div>
        </div>
        <div id="admin-panel" class="mt-6">${renderAdminPanel(activeTab)}</div>
      </div>
    </section>
  `;
  bindAdminEvents(root);
}

function renderAdminPanel(tab) {
  const renderers = {
    overview: renderOverview,
    bookings: renderBookings,
    enquiries: renderEnquiries,
    "expert-calls": renderExpertCalls,
    reviews: renderReviews,
    newsletter: renderNewsletter,
    packages: renderPackages,
    payments: renderPayments,
    "demo-tools": renderDemoTools
  };
  return (renderers[tab] || renderOverview)();
}

function renderOverview() {
  const s = stats();
  return `
    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
        <p class="eyebrow">Operations pulse</p>
        <h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen">Today Needs Attention</h2>
        <div class="mt-6 grid gap-4">
          <div class="rounded-2xl bg-white p-4"><strong>${s.pendingBookings}</strong> booking requests need review.</div>
          <div class="rounded-2xl bg-white p-4"><strong>${s.pendingPayments}</strong> payment records need follow-up.</div>
          <div class="rounded-2xl bg-white p-4"><strong>${s.pendingReviews}</strong> guest reviews are waiting for moderation.</div>
          <div class="rounded-2xl bg-white p-4"><strong>${s.enquiries}</strong> active planner/contact enquiries are in the queue.</div>
        </div>
      </div>
      <div class="rounded-3xl border border-royalGreen/10 bg-royalGreen p-7 text-ivory shadow-soft">
        <p class="eyebrow">Revenue view</p>
        <h2 class="mt-3 font-heading text-4xl font-bold">${formatPrice(s.revenue, "USD")}</h2>
        <p class="mt-4 text-ivory/74">Estimated value of current bookings. Use the payments tab to move records through deposit, full payment, review, or refund states.</p>
      </div>
    </div>
  `;
}

function renderBookings() {
  const bookings = getData(STORAGE_KEYS.bookings, []);
  return `
    <div class="overflow-x-auto rounded-3xl border border-royalGreen/10 bg-white shadow-soft">
      <table class="table admin-table">
        <thead><tr><th>Reference</th><th>Client</th><th>Package</th><th>Date</th><th>Travellers</th><th>Booking</th><th>Payment</th><th>Amount</th><th>Actions</th></tr></thead>
        <tbody>
          ${bookings
            .map(
              (booking) => `
            <tr>
              <td class="font-bold text-royalGreen">${escapeHtml(booking.reference)}</td>
              <td>${escapeHtml(booking.fullName)}<br><span class="text-xs text-charcoal/60">${escapeHtml(booking.email)}</span></td>
              <td>${escapeHtml(booking.packageName)}</td>
              <td>${escapeHtml(booking.preferredDate || "TBC")}</td>
              <td>${escapeHtml(booking.travellers)}</td>
              <td><select class="select select-xs border-royalGreen/20" data-booking-status="${booking.reference}">${statusOptions(bookingStatuses, booking.bookingStatus)}</select></td>
              <td><select class="select select-xs border-royalGreen/20" data-payment-status="${booking.reference}">${statusOptions(paymentStatuses, booking.paymentStatus)}</select></td>
              <td>${formatPrice(booking.estimatedAmount, booking.currency || "USD")}</td>
              <td>
                <div class="flex flex-wrap gap-2">
                  <button class="btn btn-xs" data-view-booking="${booking.reference}">View</button>
                  <button class="btn btn-xs" data-note-booking="${booking.reference}">Note</button>
                  <button class="btn btn-xs" data-invoice-booking="${booking.reference}">Invoice</button>
                  <button class="btn btn-xs bg-royalGreen text-ivory" data-mark-paid="${booking.reference}">Paid</button>
                </div>
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEnquiries() {
  const enquiries = getData(STORAGE_KEYS.enquiries, []);
  return `
    <div class="grid gap-4">
      ${enquiries
        .map(
          (item) => `
        <article class="rounded-3xl border border-royalGreen/10 bg-white p-6 shadow-soft">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p class="eyebrow">${escapeHtml(item.source || "Enquiry")}</p>
              <h3 class="mt-2 font-heading text-3xl font-bold text-royalGreen">${escapeHtml(item.fullName)}</h3>
              <p class="mt-2 text-sm text-charcoal/70">${escapeHtml(item.email)} - ${escapeHtml(item.whatsapp || "")}</p>
              <p class="mt-3 text-sm leading-7 text-charcoal/72">${escapeHtml(item.travelType || item.subject || "General")} | ${escapeHtml(item.destinationInterest || item.message || "")}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              ${renderStatusBadge(item.status || "New")}
              <button class="btn btn-sm" data-enquiry-contacted="${item.id}">Contacted</button>
              <button class="btn btn-sm bg-royalGreen text-ivory" data-enquiry-convert="${item.id}">Convert</button>
              <button class="btn btn-sm" data-enquiry-archive="${item.id}">Archive</button>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

function renderExpertCalls() {
  const calls = getData(STORAGE_KEYS.expertCalls, []);
  return `
    <div class="overflow-x-auto rounded-3xl border border-royalGreen/10 bg-white shadow-soft">
      <table class="table admin-table">
        <thead><tr><th>Name</th><th>Interest</th><th>Date</th><th>Time</th><th>WhatsApp</th><th>Status</th><th>Notes</th></tr></thead>
        <tbody>
          ${calls
            .map(
              (call) => `
            <tr>
              <td>${escapeHtml(call.fullName)}<br><span class="text-xs text-charcoal/60">${escapeHtml(call.email)}</span></td>
              <td>${escapeHtml(call.interest)}</td>
              <td>${escapeHtml(call.preferredDate)}</td>
              <td>${escapeHtml(call.preferredTime)}</td>
              <td>${escapeHtml(call.whatsapp)}</td>
              <td><select class="select select-xs" data-call-status="${call.id}">${statusOptions(expertCallStatuses, call.status || "New")}</select></td>
              <td class="max-w-xs whitespace-normal">${escapeHtml(call.notes || "")}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderReviews() {
  const reviews = getData(STORAGE_KEYS.reviews, []);
  return `
    <div class="grid gap-4">
      ${reviews
        .map(
          (review) => `
        <article class="rounded-3xl border border-royalGreen/10 bg-white p-6 shadow-soft">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 class="font-heading text-3xl font-bold text-royalGreen">${escapeHtml(review.name)}</h3>
              <p class="text-sm font-bold text-sunset">${escapeHtml(review.country)} - ${escapeHtml(review.tripType)} - ${escapeHtml(review.rating)}/5</p>
              <p class="mt-3 leading-7 text-charcoal/72">"${escapeHtml(review.comment)}"</p>
            </div>
            <div class="flex flex-wrap gap-2">
              ${renderStatusBadge(review.approved ? "Approved" : review.status || "Pending Review")}
              <button class="btn btn-sm bg-royalGreen text-ivory" data-review-approve="${review.id}">Approve</button>
              <button class="btn btn-sm" data-review-feature="${review.id}">${review.featured ? "Unfeature" : "Feature"}</button>
              <button class="btn btn-sm" data-review-reject="${review.id}">Reject</button>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>
  `;
}

function renderNewsletter() {
  const leads = getData(STORAGE_KEYS.newsletter, []);
  return `
    <div class="overflow-x-auto rounded-3xl border border-royalGreen/10 bg-white shadow-soft">
      <table class="table admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Interest</th><th>Signup date</th></tr></thead>
        <tbody>
          ${leads
            .map(
              (lead) => `
            <tr>
              <td>${escapeHtml(lead.name)}</td>
              <td>${escapeHtml(lead.email)}</td>
              <td>${escapeHtml(lead.interest)}</td>
              <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPackages() {
  return `
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      ${allPackages()
        .map((pkg) => {
          const settings = packageSettings(pkg.slug);
          return `
            <article class="rounded-3xl border border-royalGreen/10 bg-white p-6 shadow-soft">
              <p class="eyebrow">${escapeHtml(pkg.type)}</p>
              <h3 class="mt-2 font-heading text-3xl font-bold text-royalGreen">${escapeHtml(pkg.title)}</h3>
              <p class="mt-3 text-sm text-charcoal/70">Starting price ${formatPrice(pkg.priceFrom, "USD")}</p>
              <div class="mt-5 grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2 rounded-2xl bg-warmSand/50 p-3 text-sm font-bold"><input type="checkbox" class="toggle toggle-sm" data-package-active="${pkg.slug}" ${settings.active !== false ? "checked" : ""} /> Active</label>
                <label class="flex items-center gap-2 rounded-2xl bg-warmSand/50 p-3 text-sm font-bold"><input type="checkbox" class="toggle toggle-sm" data-package-featured="${pkg.slug}" ${settings.featured ? "checked" : ""} /> Featured</label>
              </div>
            </article>`;
        })
        .join("")}
    </div>
  `;
}

function renderPayments() {
  const payments = getData(STORAGE_KEYS.payments, []);
  return `
    <div class="overflow-x-auto rounded-3xl border border-royalGreen/10 bg-white shadow-soft">
      <table class="table admin-table">
        <thead><tr><th>Reference</th><th>Client</th><th>Amount</th><th>Deposit</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${payments
            .map(
              (payment) => `
            <tr>
              <td class="font-bold text-royalGreen">${escapeHtml(payment.reference)}</td>
              <td>${escapeHtml(payment.clientName)}<br><span class="text-xs text-charcoal/60">${escapeHtml(payment.email)}</span></td>
              <td>${formatPrice(payment.amount, payment.currency || "USD")}</td>
              <td>${formatPrice(payment.depositAmount, payment.currency || "USD")}</td>
              <td>${formatPrice(payment.balanceAmount, payment.currency || "USD")}</td>
              <td>${renderStatusBadge(payment.paymentStatus)}</td>
              <td><div class="flex flex-wrap gap-2">
                <button class="btn btn-xs" data-payment-set="${payment.reference}" data-payment-value="Deposit Paid">Deposit Paid</button>
                <button class="btn btn-xs" data-payment-set="${payment.reference}" data-payment-value="Fully Paid">Fully Paid</button>
                <button class="btn btn-xs" data-payment-set="${payment.reference}" data-payment-value="Payment Under Review">Under Review</button>
                <button class="btn btn-xs" data-payment-set="${payment.reference}" data-payment-value="Refunded">Refunded</button>
              </div></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDemoTools() {
  return `
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
        <p class="eyebrow">Seed sample data</p>
        <h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen">Add Demo Records</h2>
        <p class="mt-4 leading-7 text-charcoal/70">Seeds bookings, payments, enquiries, calls, reviews, newsletter leads, forms, and admin notes if the browser has not been seeded yet.</p>
        <button id="seed-demo-data" class="btn-outline-royal mt-6">Seed Sample Data</button>
      </div>
      <div class="rounded-3xl border border-royalGreen/10 bg-white p-7 shadow-soft">
        <p class="eyebrow">Reset workspace</p>
        <h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen">Reset Demo Data</h2>
        <p class="mt-4 leading-7 text-charcoal/70">Clears Royal Horizon browser records and restores the original sample operating data.</p>
        <button id="reset-demo-data" class="btn bg-sunset text-ivory hover:bg-charcoal mt-6">Reset Demo Data</button>
      </div>
    </div>
  `;
}

function updatePaymentStatus(reference, status) {
  updateItem(STORAGE_KEYS.payments, reference, { paymentStatus: status, updatedAt: new Date().toISOString() });
  updateItem(STORAGE_KEYS.bookings, reference, {
    paymentStatus: status,
    bookingStatus: status === "Fully Paid" ? "Fully Paid" : status === "Deposit Paid" ? "Deposit Paid" : findItem(STORAGE_KEYS.bookings, reference)?.bookingStatus
  });
}

function rerender(root) {
  renderDashboard(root);
}

function bindAdminEvents(root) {
  document.getElementById("admin-logout")?.addEventListener("click", () => {
    sessionStorage.removeItem("rh_admin_session");
    renderAdminPage(root);
  });
  document.getElementById("admin-tabs")?.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-admin-tab]");
    if (!tab) return;
    activeTab = tab.dataset.adminTab;
    document.getElementById("admin-panel").innerHTML = renderAdminPanel(activeTab);
  });
  document.addEventListener("change", (event) => {
    const bookingStatus = event.target.closest("[data-booking-status]");
    const paymentStatus = event.target.closest("[data-payment-status]");
    const callStatus = event.target.closest("[data-call-status]");
    const active = event.target.closest("[data-package-active]");
    const featured = event.target.closest("[data-package-featured]");
    if (bookingStatus) {
      updateItem(STORAGE_KEYS.bookings, bookingStatus.dataset.bookingStatus, { bookingStatus: bookingStatus.value });
      showToast("Booking status updated.");
    }
    if (paymentStatus) {
      updatePaymentStatus(paymentStatus.dataset.paymentStatus, paymentStatus.value);
      showToast("Payment status updated.");
    }
    if (callStatus) {
      updateItem(STORAGE_KEYS.expertCalls, callStatus.dataset.callStatus, { status: callStatus.value });
      showToast("Expert call status updated.");
    }
    if (active || featured) {
      const slug = (active || featured).dataset.packageActive || (active || featured).dataset.packageFeatured;
      const settings = packageSettings(slug);
      upsertItem(STORAGE_KEYS.adminNotes, `PKG-${slug}`, {
        id: `PKG-${slug}`,
        type: "package-setting",
        slug,
        active: active ? active.checked : settings.active !== false,
        featured: featured ? featured.checked : settings.featured,
        updatedAt: new Date().toISOString()
      });
      showToast("Package setting saved.");
    }
  });
  document.addEventListener("click", (event) => {
    const view = event.target.closest("[data-view-booking]");
    const note = event.target.closest("[data-note-booking]");
    const invoice = event.target.closest("[data-invoice-booking]");
    const markPaid = event.target.closest("[data-mark-paid]");
    const enquiryContacted = event.target.closest("[data-enquiry-contacted]");
    const enquiryConvert = event.target.closest("[data-enquiry-convert]");
    const enquiryArchive = event.target.closest("[data-enquiry-archive]");
    const reviewApprove = event.target.closest("[data-review-approve]");
    const reviewFeature = event.target.closest("[data-review-feature]");
    const reviewReject = event.target.closest("[data-review-reject]");
    const paymentSet = event.target.closest("[data-payment-set]");
    if (view) {
      const booking = findItem(STORAGE_KEYS.bookings, view.dataset.viewBooking);
      const payment = findItem(STORAGE_KEYS.payments, view.dataset.viewBooking);
      const notes = getData(STORAGE_KEYS.adminNotes, []).filter((item) => item.reference === booking.reference);
      openModal(
        booking.reference,
        `${renderInvoicePreview(booking, payment)}<h4>Internal Notes</h4>${notes.map((item) => `<p>${escapeHtml(item.note)}</p>`).join("") || "<p>No internal notes yet.</p>"}`
      );
    }
    if (note) {
      const text = window.prompt("Add internal note for this booking:");
      if (text) {
        addItem(STORAGE_KEYS.adminNotes, {
          id: generateId("NOTE"),
          reference: note.dataset.noteBooking,
          note: text,
          createdAt: new Date().toISOString()
        });
        showToast("Internal note saved.");
      }
    }
    if (invoice) {
      downloadInvoice(findItem(STORAGE_KEYS.bookings, invoice.dataset.invoiceBooking), findItem(STORAGE_KEYS.payments, invoice.dataset.invoiceBooking));
    }
    if (markPaid) {
      updatePaymentStatus(markPaid.dataset.markPaid, "Fully Paid");
      showToast("Booking marked fully paid.");
      rerender(root);
    }
    if (enquiryContacted) {
      updateItem(STORAGE_KEYS.enquiries, enquiryContacted.dataset.enquiryContacted, { status: "Contacted" });
      showToast("Enquiry marked contacted.");
      rerender(root);
    }
    if (enquiryConvert) {
      updateItem(STORAGE_KEYS.enquiries, enquiryConvert.dataset.enquiryConvert, { status: "Converted" });
      showToast("Enquiry converted to booking simulation status.");
      rerender(root);
    }
    if (enquiryArchive) {
      updateItem(STORAGE_KEYS.enquiries, enquiryArchive.dataset.enquiryArchive, { status: "Archived" });
      showToast("Enquiry archived.");
      rerender(root);
    }
    if (reviewApprove) {
      updateItem(STORAGE_KEYS.reviews, reviewApprove.dataset.reviewApprove, { approved: true, status: "Approved" });
      showToast("Review approved and visible on the homepage.");
      rerender(root);
    }
    if (reviewFeature) {
      const review = findItem(STORAGE_KEYS.reviews, reviewFeature.dataset.reviewFeature);
      updateItem(STORAGE_KEYS.reviews, reviewFeature.dataset.reviewFeature, { featured: !review.featured, approved: true, status: "Approved" });
      showToast("Review feature setting updated.");
      rerender(root);
    }
    if (reviewReject) {
      updateItem(STORAGE_KEYS.reviews, reviewReject.dataset.reviewReject, { approved: false, status: "Rejected" });
      showToast("Review rejected.");
      rerender(root);
    }
    if (paymentSet) {
      updatePaymentStatus(paymentSet.dataset.paymentSet, paymentSet.dataset.paymentValue);
      showToast(`Payment marked ${paymentSet.dataset.paymentValue}.`);
      rerender(root);
    }
    if (event.target.id === "seed-demo-data") {
      seedDemoData({ force: false });
      showToast("Sample data is available.");
      rerender(root);
    }
    if (event.target.id === "reset-demo-data") {
      resetDemoData();
      showToast("Demo data reset.");
      rerender(root);
    }
  });
}
