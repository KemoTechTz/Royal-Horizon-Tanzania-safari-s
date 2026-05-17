import { imageLibrary } from "./data.js";
import { renderHero } from "./ui.js";
import { setPageTitle } from "./router-utils.js";

export function renderAdminPage(root) {
  setPageTitle("Admin Portal Coming Later");
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Operations",
      title: "Admin Portal Coming Later",
      text: "This admin area is reserved for a future operations dashboard and is not part of the public showcase.",
      image: imageLibrary.kilimanjaroTrail,
      primary: { label: "Return Home", href: "index.html" },
      secondary: { label: "Contact Us", href: "contact.html" },
      compact: true
    })}
  `;
}
