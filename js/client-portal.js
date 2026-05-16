import { imageLibrary } from "./data.js";
import { renderHero } from "./ui.js";
import { setPageTitle } from "./router-utils.js";

export function renderClientPortalPage(root) {
  setPageTitle("Client Portal Coming Later");
  root.innerHTML = `
    ${renderHero({
      eyebrow: "Client Updates",
      title: "Client Portal Coming Later",
      text: "We are simplifying the public travel experience for now. Future guest dashboards will be designed around real traveller needs. For assistance, please contact Royal Horizon Tours directly.",
      image: imageLibrary.travellers,
      primary: { label: "Contact Us", href: "contact.html" },
      secondary: { label: "Start Booking", href: "booking.html" },
      compact: true
    })}
    <section class="section-pad">
      <div class="container-pad text-center">
        <a href="index.html" class="btn-outline-royal">Return Home</a>
      </div>
    </section>
  `;
}
