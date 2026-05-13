import { BRAND } from "./data.js";
import { escapeHtml, formatPrice, renderStatusBadge } from "./ui.js";

export function invoiceTotals(booking) {
  const amount = Number(booking?.estimatedAmount || 0);
  const deposit = Number(booking?.depositAmount || Math.round(amount * 0.3));
  const balance = Number(booking?.balanceAmount || Math.max(amount - deposit, 0));
  return { amount, deposit, balance };
}

export function renderInvoicePreview(booking, payment = null) {
  if (!booking) return "";
  const totals = invoiceTotals(booking);
  const paymentStatus = payment?.paymentStatus || booking.paymentStatus || "Unpaid";
  return `
    <article class="rounded-3xl border border-royalGreen/10 bg-white p-6 shadow-soft md:p-8">
      <div class="flex flex-col gap-6 border-b border-royalGreen/10 pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="eyebrow">Invoice Preview</p>
          <h2 class="mt-2 font-heading text-4xl font-bold text-royalGreen">${BRAND.name}</h2>
          <p class="mt-2 text-sm text-charcoal/62">${BRAND.address}</p>
          <p class="text-sm text-charcoal/62">${BRAND.email} - ${BRAND.whatsapp}</p>
        </div>
        <div class="rounded-2xl bg-warmSand/70 p-5 text-sm">
          <p><strong>Booking:</strong> ${escapeHtml(booking.reference)}</p>
          <p><strong>Invoice:</strong> ${escapeHtml(booking.invoiceNumber)}</p>
          <p><strong>Status:</strong> ${renderStatusBadge(paymentStatus)}</p>
        </div>
      </div>
      <div class="grid gap-6 py-6 md:grid-cols-2">
        <div>
          <h3 class="font-heading text-2xl font-bold text-royalGreen">Client</h3>
          <p class="mt-3 font-bold">${escapeHtml(booking.fullName)}</p>
          <p class="text-sm text-charcoal/70">${escapeHtml(booking.email)}</p>
          <p class="text-sm text-charcoal/70">${escapeHtml(booking.whatsapp)}</p>
          <p class="text-sm text-charcoal/70">${escapeHtml(booking.country)}</p>
        </div>
        <div>
          <h3 class="font-heading text-2xl font-bold text-royalGreen">Adventure</h3>
          <p class="mt-3 font-bold">${escapeHtml(booking.packageName)}</p>
          <p class="text-sm text-charcoal/70">${escapeHtml(booking.serviceType)} - ${escapeHtml(booking.groupType)}</p>
          <p class="text-sm text-charcoal/70">Travel date: ${escapeHtml(booking.preferredDate || "To be confirmed")}</p>
          <p class="text-sm text-charcoal/70">Travellers: ${escapeHtml(booking.travellers)}</p>
        </div>
      </div>
      <div class="overflow-x-auto rounded-2xl border border-royalGreen/10">
        <table class="table">
          <thead>
            <tr class="bg-warmSand/70 text-royalGreen">
              <th>Description</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>${escapeHtml(booking.packageName)} estimated total</td><td class="text-right font-bold">${formatPrice(totals.amount, booking.currency || "USD")}</td></tr>
            <tr><td>Deposit due</td><td class="text-right">${formatPrice(totals.deposit, booking.currency || "USD")}</td></tr>
            <tr><td>Balance after deposit</td><td class="text-right">${formatPrice(totals.balance, booking.currency || "USD")}</td></tr>
          </tbody>
        </table>
      </div>
      <p class="mt-6 rounded-2xl bg-iceBlue p-4 text-sm leading-7 text-royalGreen">${escapeHtml(BRAND.paymentNote)}</p>
    </article>
  `;
}

function invoiceDocument(booking, payment = null) {
  const totals = invoiceTotals(booking);
  const status = payment?.paymentStatus || booking.paymentStatus || "Unpaid";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${booking.invoiceNumber} - Royal Horizon Tours</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111111; margin: 0; background: #f4e7d1; }
    .page { max-width: 860px; margin: 32px auto; background: #fffdf7; padding: 42px; border: 1px solid rgba(18,55,42,.16); }
    h1 { color: #12372A; font-size: 36px; margin: 0; }
    h2 { color: #12372A; margin-top: 32px; }
    .top { display: flex; justify-content: space-between; gap: 32px; border-bottom: 2px solid #C9A14A; padding-bottom: 24px; }
    .badge { display: inline-block; padding: 8px 12px; border-radius: 999px; background: #DCEFF5; color: #12372A; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { background: #12372A; color: #FFFDF7; text-align: left; }
    th, td { padding: 14px; border: 1px solid rgba(18,55,42,.16); }
    .right { text-align: right; }
    .note { margin-top: 28px; padding: 18px; background: #F4E7D1; border-left: 4px solid #C9A14A; line-height: 1.6; }
    @media print { body { background: white; } .page { margin: 0; border: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="page">
    <button class="no-print" onclick="window.print()" style="float:right;padding:10px 14px;">Print Invoice</button>
    <div class="top">
      <div>
        <h1>Royal Horizon Tours</h1>
        <p>${BRAND.address}<br>${BRAND.email}<br>${BRAND.whatsapp}</p>
      </div>
      <div>
        <p><strong>Booking:</strong> ${escapeHtml(booking.reference)}</p>
        <p><strong>Invoice:</strong> ${escapeHtml(booking.invoiceNumber)}</p>
        <p><span class="badge">${escapeHtml(status)}</span></p>
      </div>
    </div>
    <h2>Client</h2>
    <p><strong>${escapeHtml(booking.fullName)}</strong><br>${escapeHtml(booking.email)}<br>${escapeHtml(booking.whatsapp)}<br>${escapeHtml(booking.country)}</p>
    <h2>Trip Details</h2>
    <p><strong>${escapeHtml(booking.packageName)}</strong><br>${escapeHtml(booking.serviceType)} - ${escapeHtml(booking.groupType)}<br>Travel date: ${escapeHtml(booking.preferredDate || "To be confirmed")}<br>Travellers: ${escapeHtml(booking.travellers)}</p>
    <table>
      <thead><tr><th>Description</th><th class="right">Amount</th></tr></thead>
      <tbody>
        <tr><td>Estimated total</td><td class="right">${formatPrice(totals.amount, booking.currency || "USD")}</td></tr>
        <tr><td>Deposit amount</td><td class="right">${formatPrice(totals.deposit, booking.currency || "USD")}</td></tr>
        <tr><td>Balance due</td><td class="right">${formatPrice(totals.balance, booking.currency || "USD")}</td></tr>
      </tbody>
    </table>
    <div class="note">${escapeHtml(BRAND.paymentNote)}</div>
  </div>
</body>
</html>`;
}

export function downloadInvoice(booking, payment = null) {
  if (!booking) return;
  const html = invoiceDocument(booking, payment);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${booking.invoiceNumber || booking.reference}-invoice.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function printInvoice(booking, payment = null) {
  if (!booking) return;
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(invoiceDocument(booking, payment));
  win.document.close();
  win.focus();
}
