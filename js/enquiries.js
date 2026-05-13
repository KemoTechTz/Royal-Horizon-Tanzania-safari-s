import { STORAGE_KEYS } from "./data.js";
import { addItem, generateId } from "./storage.js";
import { showToast } from "./ui.js";
import { serializeForm } from "./router-utils.js";

export function setupExpertCallForm() {
  const form = document.getElementById("expert-call-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = serializeForm(form);
    addItem(STORAGE_KEYS.expertCalls, {
      id: generateId("CALL"),
      ...data,
      status: "New",
      createdAt: new Date().toISOString()
    });
    form.reset();
    showToast("Your WhatsApp call request is saved. Royal Horizon will contact you on WhatsApp.");
  });
}

export function setupAdventurePlannerForm() {
  const form = document.getElementById("adventure-planner-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = serializeForm(form);
    addItem(STORAGE_KEYS.enquiries, {
      id: generateId("ENQ"),
      source: "Adventure Planner",
      ...data,
      status: "New",
      createdAt: new Date().toISOString()
    });
    form.reset();
    showToast("Your adventure plan is saved. Our local team will review it and respond personally.");
  });
}

export function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = serializeForm(form);
    addItem(STORAGE_KEYS.enquiries, {
      id: generateId("ENQ"),
      source: "Contact",
      travelType: data.subject || "General",
      destinationInterest: data.message || "",
      travellers: data.travellers || "",
      travelMonth: data.travelMonth || "",
      budgetRange: data.budgetRange || "",
      accommodation: "",
      groupType: "",
      specialRequests: data.message || "",
      ...data,
      status: "New",
      createdAt: new Date().toISOString()
    });
    form.reset();
    showToast("Message received. Royal Horizon will reply with clear next steps.");
  });
}
