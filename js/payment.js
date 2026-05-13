import { BRAND, STORAGE_KEYS, imageLibrary } from "./data.js";
import { findItem, updateItem } from "./storage.js";
import { downloadInvoice, invoiceTotals, renderInvoicePreview } from "./invoice.js";
import { escapeHtml, formatPrice, renderEmptyState, renderHero, renderStatusBadge, showToast } from "./ui.js";
import { getParam, setPageTitle } from "./router-utils.js";

function updatePayment(reference, status, method) {
  const payment = findItem(STORAGE_KEYS.payments, reference);
  const booking = findItem(STORAGE_KEYS.bookings, reference);
  if (!payment || !booking) return null;
  updateItem(STORAGE_KEYS.payments, reference, {
    paymentStatus: status,
    method,
    updatedAt: new Date().toISOString()
  });
  updateItem(STORAGE_KEYS.bookings, reference, {
    paymentStatus: status,
    bookingStatus: status === "Fully Paid" ? "Fully Paid" : status === "Deposit Paid" ? "Deposit Paid" : booking.bookingStatus
  });
  return findItem(STORAGE_KEYS.payments, reference);
}

export function renderPaymentPage(root) {
  setPageTitle("Payment");
  const ref = getParam("ref");
  const booking = findItem(STORAGE_KEYS.bookings, ref);
  const payment = findItem(STORAGE_KEYS.payments, ref);
  if (!booking) {
    root.innerHTML = `
      ${renderHero({
        eyebrow: "Payment",
        title: "Open a Simulated Payment Page",
        text: "Enter a booking reference from your confirmation page to review payment options.",
        image: imageLibrary.lodge,
        primary: { label: "Client Portal", href: "client-portal.html" },
        secondary: { label: "Book First", href: "booking.html" },
        compact: true
      })}
      <section class="section-pad">
        <div class="container-pad">
          <form id="payment-lookup" class="mx-auto max-w-xl rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
            <label class="form-control"><span class="label-text font-bold">Booking reference</span><input name="ref" class="form-field" placeholder="RH-2026-0041" required /></label>
            <button class="btn-royal mt-5 w-full">Open Payment Page</button>
          </form>
        </div>
      </section>
    `;
    document.getElementById("payment-lookup")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = new FormData(event.currentTarget).get("ref");
      window.location.href = `payment.html?ref=${encodeURIComponent(value)}`;
    });
    return;
  }

  const totals = invoiceTotals(booking);
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Payment",
      title: "Simulated Payment Portal",
      text: "Review deposit, balance, and payment status. This preview does not collect card or bank details.",
      image: imageLibrary.lodge,
      primary: { label: "Download Invoice", href: "#invoice" },
      secondary: { label: "Client Portal", href: "client-portal.html" },
      compact: true
    })}
    <section class="section-pad">
      <div class="container-pad grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-3xl border border-royalGreen/10 bg-warmSand/50 p-7 shadow-soft">
          <p class="eyebrow">Booking ${escapeHtml(booking.reference)}</p>
          <h2 class="mt-3 font-heading text-4xl font-bold text-royalGreen">${escapeHtml(booking.packageName)}</h2>
          <div class="mt-6 grid gap-4 rounded-2xl bg-white p-5">
            <p><strong>Client:</strong> ${escapeHtml(booking.fullName)}</p>
            <p><strong>Total:</strong> ${formatPrice(totals.amount, booking.currency || "USD")}</p>
            <p><strong>Deposit:</strong> ${formatPrice(totals.deposit, booking.currency || "USD")}</p>
            <p><strong>Balance:</strong> ${formatPrice(totals.balance, booking.currency || "USD")}</p>
            <p><strong>Payment status:</strong> <span id="payment-status">${renderStatusBadge(payment?.paymentStatus || booking.paymentStatus)}</span></p>
          </div>
          <div class="mt-7 grid gap-4">
            <button class="btn-royal" data-pay-status="Deposit Paid" data-pay-method="Card simulation">Card Simulation: Pay Deposit</button>
            <button class="btn-outline-royal" data-pay-status="Payment Under Review" data-pay-method="Bank transfer proof simulation">Bank Transfer Simulation: Submit Proof</button>
            <button class="btn-outline-royal" data-pay-status="Deposit Pending" data-pay-method="Mobile money manual proof simulation">Mobile Money: Mark Deposit Pending</button>
            <button class="btn bg-royalGreen text-ivory hover:bg-charcoal" data-pay-status="Fully Paid" data-pay-method="Card simulation full balance">Card Simulation: Pay Full Balance</button>
            <button class="btn-outline-royal" id="payment-download-invoice">Download Invoice</button>
          </div>
          <p class="mt-6 rounded-2xl bg-iceBlue p-4 text-sm leading-7 text-royalGreen">${escapeHtml(BRAND.paymentNote)}</p>
        </div>
        <div id="invoice">${renderInvoicePreview(booking, payment)}</div>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-pay-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const updated = updatePayment(booking.reference, button.dataset.payStatus, button.dataset.payMethod);
      if (!updated) return;
      showToast(`Payment status updated to ${updated.paymentStatus}.`);
      document.getElementById("payment-status").innerHTML = renderStatusBadge(updated.paymentStatus);
      const updatedBooking = findItem(STORAGE_KEYS.bookings, booking.reference);
      document.getElementById("invoice").innerHTML = renderInvoicePreview(updatedBooking, updated);
    });
  });
  document.getElementById("payment-download-invoice")?.addEventListener("click", () => {
    downloadInvoice(findItem(STORAGE_KEYS.bookings, booking.reference), findItem(STORAGE_KEYS.payments, booking.reference));
  });
}
