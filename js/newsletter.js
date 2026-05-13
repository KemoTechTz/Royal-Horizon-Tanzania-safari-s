import { STORAGE_KEYS } from "./data.js";
import { addItem, generateId, getData } from "./storage.js";
import { showToast } from "./ui.js";
import { serializeForm } from "./router-utils.js";

export function setupNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = serializeForm(form);
    const existing = getData(STORAGE_KEYS.newsletter, []);
    if (existing.some((item) => item.email.toLowerCase() === data.email.toLowerCase())) {
      showToast("This email is already in the Royal Horizon community list.", "info");
      return;
    }
    addItem(STORAGE_KEYS.newsletter, {
      id: generateId("NEWS"),
      ...data,
      createdAt: new Date().toISOString()
    });
    form.reset();
    showToast("Welcome to the Royal Horizon community.");
  });
}
