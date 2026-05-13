export function getData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    console.warn(`Could not parse localStorage key ${key}`, error);
    return fallback;
  }
}

export function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function addItem(key, item) {
  const current = getData(key, []);
  const next = [...current, item];
  setData(key, next);
  return item;
}

function matchesId(item, id) {
  return [item.id, item.ref, item.reference, item.bookingRef, item.invoiceNumber, item.email].filter(Boolean).includes(id);
}

export function updateItem(key, id, updates) {
  const current = getData(key, []);
  const next = current.map((item) => (matchesId(item, id) ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item));
  setData(key, next);
  return next.find((item) => matchesId(item, id)) || null;
}

export function deleteItem(key, id) {
  const current = getData(key, []);
  const next = current.filter((item) => !matchesId(item, id));
  setData(key, next);
  return next;
}

export function findItem(key, id) {
  return getData(key, []).find((item) => matchesId(item, id)) || null;
}

export function generateId(prefix = "RH") {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}

export function upsertItem(key, id, item) {
  const current = getData(key, []);
  const index = current.findIndex((entry) => matchesId(entry, id));
  const next = index >= 0 ? current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, ...item } : entry)) : [...current, item];
  setData(key, next);
  return item;
}
