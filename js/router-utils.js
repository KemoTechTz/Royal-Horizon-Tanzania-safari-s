export function getParam(name, fallback = "") {
  return new URLSearchParams(window.location.search).get(name) || fallback;
}

export function setPageTitle(title) {
  document.title = title ? `${title} | Royal Horizon Tours` : "Royal Horizon Tours";
}

export function safeText(value, fallback = "") {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

export function slugToTitle(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function currentPageName() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  return file.replace(".html", "") || "index";
}

export function byId(id) {
  return document.getElementById(id);
}

export function serializeForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
