import { STORAGE_KEYS } from "./data.js";
import { addItem, generateId } from "./storage.js";
import { showToast } from "./ui.js";
import { serializeForm } from "./router-utils.js";

export function setupReviewForm() {
  const form = document.getElementById("review-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = serializeForm(form);
    addItem(STORAGE_KEYS.reviews, {
      id: generateId("REV"),
      ...data,
      rating: Number(data.rating || 5),
      approved: false,
      featured: false,
      createdAt: new Date().toISOString()
    });
    form.reset();
    showToast("Thank you. Your review will appear after our team approves it.");
  });
}
