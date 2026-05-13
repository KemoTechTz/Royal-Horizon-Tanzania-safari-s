import { STORAGE_KEYS, seedReviews } from "./data.js";
import { getData, setData } from "./storage.js";

const demoBooking = {
  id: "RH-2026-0041",
  reference: "RH-2026-0041",
  invoiceNumber: "INV-RH-0041",
  serviceType: "kilimanjaro",
  packageSlug: "lemosho",
  packageName: "Lemosho Route",
  groupType: "Private",
  preferredDate: "2026-08-18",
  travellers: 2,
  accommodation: "Mid-range",
  currency: "USD",
  estimatedAmount: 5390,
  depositAmount: 1617,
  balanceAmount: 3773,
  fullName: "Amelia Carter",
  email: "client@example.com",
  whatsapp: "+1 415 555 0127",
  country: "United States",
  travelNotes: "We would like a calm pace and a private toilet tent if possible.",
  specialRequirements: "Vegetarian meals for one traveller.",
  bookingStatus: "Confirmed",
  paymentStatus: "Deposit Paid",
  createdAt: "2026-05-01T09:30:00.000Z",
  messages: [
    "Your Lemosho climb has been reviewed by our operations team.",
    "Please complete passport and arrival details before final confirmation."
  ]
};

const secondBooking = {
  id: "RH-2026-0042",
  reference: "RH-2026-0042",
  invoiceNumber: "INV-RH-0042",
  serviceType: "safari",
  packageSlug: "family-safari",
  packageName: "Family Safari",
  groupType: "Private",
  preferredDate: "2026-07-09",
  travellers: 4,
  accommodation: "Luxury",
  currency: "USD",
  estimatedAmount: 13294,
  depositAmount: 3988,
  balanceAmount: 9306,
  fullName: "Daniel Meyer",
  email: "daniel@example.com",
  whatsapp: "+49 170 555 2288",
  country: "Germany",
  travelNotes: "Two adults and two children ages 9 and 12.",
  specialRequirements: "One child has a nut allergy.",
  bookingStatus: "Pending Review",
  paymentStatus: "Unpaid",
  createdAt: "2026-05-05T12:15:00.000Z",
  messages: ["We received your safari request and are checking family room availability."]
};

export function seedDemoData({ force = false } = {}) {
  if (!force && localStorage.getItem(STORAGE_KEYS.demoSeeded) === "true") return;

  setData(STORAGE_KEYS.bookings, [demoBooking, secondBooking]);
  setData(STORAGE_KEYS.payments, [
    {
      id: "PAY-RH-0041",
      reference: "RH-2026-0041",
      invoiceNumber: "INV-RH-0041",
      clientName: demoBooking.fullName,
      email: demoBooking.email,
      amount: demoBooking.estimatedAmount,
      depositAmount: demoBooking.depositAmount,
      balanceAmount: demoBooking.balanceAmount,
      currency: "USD",
      paymentStatus: "Deposit Paid",
      method: "Card simulation",
      updatedAt: "2026-05-02T10:30:00.000Z"
    },
    {
      id: "PAY-RH-0042",
      reference: "RH-2026-0042",
      invoiceNumber: "INV-RH-0042",
      clientName: secondBooking.fullName,
      email: secondBooking.email,
      amount: secondBooking.estimatedAmount,
      depositAmount: secondBooking.depositAmount,
      balanceAmount: secondBooking.balanceAmount,
      currency: "USD",
      paymentStatus: "Unpaid",
      method: "",
      updatedAt: "2026-05-05T12:15:00.000Z"
    }
  ]);
  setData(STORAGE_KEYS.enquiries, [
    {
      id: "ENQ-2026-001",
      source: "Adventure Planner",
      fullName: "Sophie Laurent",
      email: "sophie@example.com",
      whatsapp: "+33 6 55 12 88 45",
      travelType: "Safari + Zanzibar",
      destinationInterest: "Serengeti, Ngorongoro, Zanzibar",
      travellers: 2,
      travelMonth: "September 2026",
      budgetRange: "$4,000 - $6,000 pp",
      accommodation: "Luxury",
      groupType: "Private",
      specialRequests: "We prefer boutique lodges and a quiet beach finish.",
      status: "New",
      createdAt: "2026-05-06T08:20:00.000Z"
    },
    {
      id: "ENQ-2026-002",
      source: "Contact",
      fullName: "Grace Kimani",
      email: "grace@example.com",
      whatsapp: "+254 712 555 887",
      travelType: "Day Trip",
      destinationInterest: "Materuni Waterfalls",
      travellers: 5,
      travelMonth: "June 2026",
      budgetRange: "Flexible",
      accommodation: "Not required",
      groupType: "Private",
      specialRequests: "Family day while staying in Moshi.",
      status: "Contacted",
      createdAt: "2026-05-07T10:45:00.000Z"
    }
  ]);
  setData(STORAGE_KEYS.expertCalls, [
    {
      id: "CALL-2026-001",
      fullName: "Oliver Grant",
      email: "oliver@example.com",
      whatsapp: "+44 7700 900123",
      country: "United Kingdom",
      interest: "Kilimanjaro",
      preferredDate: "2026-05-20",
      preferredTime: "17:30",
      notes: "Need route advice for a September climb.",
      status: "Scheduled",
      createdAt: "2026-05-06T11:00:00.000Z"
    }
  ]);
  setData(STORAGE_KEYS.reviews, seedReviews);
  setData(STORAGE_KEYS.newsletter, [
    {
      id: "NEWS-001",
      name: "Priya Raman",
      email: "priya@example.com",
      interest: "Kilimanjaro",
      createdAt: "2026-04-28T14:40:00.000Z"
    },
    {
      id: "NEWS-002",
      name: "Mateo Silva",
      email: "mateo@example.com",
      interest: "Safari",
      createdAt: "2026-05-03T07:21:00.000Z"
    }
  ]);
  setData(STORAGE_KEYS.clientForms, [
    {
      id: "FORM-RH-2026-0041",
      reference: "RH-2026-0041",
      personalName: "Amelia Carter",
      passportNumber: "",
      arrivalDetails: "",
      departureDetails: "",
      dietary: "Vegetarian meal for one traveller.",
      medical: "No current injuries. Mild altitude concern.",
      gearRental: "Sleeping bags and trekking poles",
      emergencyName: "",
      emergencyPhone: "",
      updatedAt: "2026-05-03T09:00:00.000Z"
    }
  ]);
  setData(STORAGE_KEYS.adminNotes, [
    {
      id: "NOTE-RH-2026-0041",
      reference: "RH-2026-0041",
      note: "Check private toilet tent availability and confirm with client.",
      createdAt: "2026-05-03T09:30:00.000Z"
    }
  ]);

  localStorage.setItem(STORAGE_KEYS.demoSeeded, "true");
}

export function resetDemoData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key.startsWith("rh_")) localStorage.removeItem(key);
  });
  seedDemoData({ force: true });
}

export function seedMissingReviews() {
  const existing = getData(STORAGE_KEYS.reviews, []);
  if (existing.length === 0) setData(STORAGE_KEYS.reviews, seedReviews);
}
