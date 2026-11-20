export const clean = (v, max = 200) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
export const cleanMultiline = (v, max = 5000) => String(v ?? '').replace(/\r\n/g, '\n').trim().slice(0, max);

// Accepts 9876543210, 09876543210, 919876543210, +91 98765 43210. Returns 10 digits or null.
export function tenDigitPhone(raw) {
  let d = String(raw ?? '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function toInt(v, { min = 0, max = 100000 } = {}) {
  const n = Number.parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
