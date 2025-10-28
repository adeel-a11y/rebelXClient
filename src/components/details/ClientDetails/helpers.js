// src/components/details/client-details/helpers.js
export const STATUS_COLORS = {
  Sampling: { bg: "#e3f9f0", fg: "#036857" },
  "New Prospect": { bg: "#e8f0ff", fg: "#123fa8" },
  Uncategorized: { bg: "#eef2f6", fg: "#475569" },
  "Closed lost": { bg: "#ffe6ea", fg: "#b0123b" },
  "Initial Contact": { bg: "#fff2e0", fg: "#9a4a00" },
  "Closed won": { bg: "#e6fbef", fg: "#04684d" },
  Committed: { bg: "#f2e9ff", fg: "#6320c1" },
  Consideration: { bg: "#fff7cf", fg: "#8a5900" },
  Other: { bg: "#f1f5f9", fg: "#334155" },
};

export const PAYMENT_COLORS = {
  "Credit Card": { bg: "#e7f1ff", fg: "#1742a1" },
  "CC#": { bg: "#f4e9ff", fg: "#6b21a8" },
  "Auth Payment Link": { bg: "#e6fdff", fg: "#0f6170" },
  "Mobile Check Deposit": { bg: "#fff5cc", fg: "#7a4b00" },
  ACH: { bg: "#e6fbf1", fg: "#0b6b4c" },
  Cash: { bg: "#fff0e1", fg: "#9a3f00" },
  "Nothing Due": { bg: "#eef2f6", fg: "#475569" },
  "Check By Mail": { bg: "#fff1db", fg: "#8a4a00" },
  "Net Terms": { bg: "#dff2ff", fg: "#075985" },
  Other: { bg: "#f2f4f7", fg: "#334155" },
};

export const SHIPPING_COLORS = {
  "UPS Ground": { bg: "#e6efff", fg: "#1a43a6" },
  "UPS 2nd Day Air": { bg: "#e3f7ff", fg: "#055d7a" },
  "UPS 3 Day Select": { bg: "#ecebff", fg: "#4338ca" },
  "UPS Next Day Air Saver": { bg: "#f3ecff", fg: "#6d28d9" },
  "USPS Ground Advantage": { bg: "#e6fbf0", fg: "#065f46" },
  "Will Call": { bg: "#fff4e6", fg: "#9a4f00" },
  "Local Delivery": { bg: "#fff9d6", fg: "#8a5a00" },
  "Freight Via SAIA": { bg: "#e0f3ff", fg: "#075985" },
};

export const COMPANY_TYPE_COLORS = {
  "Smoke Shop": { bg: "#e6f8ff", fg: "#075b83" },
  "Vape Store": { bg: "#efe7ff", fg: "#5e2aa5" },
  Shop: { bg: "#e6fcef", fg: "#0b6b4b" },
  Distro: { bg: "#fff7cf", fg: "#855700" },
  "Master Distro": { bg: "#e8f0ff", fg: "#163da1" },
  "Broker/Jobber": { bg: "#e3fbf2", fg: "#0a6a55" },
  Manufacturer: { bg: "#fff0e1", fg: "#9a3f00" },
  Dispensary: { bg: "#fff0bf", fg: "#7a4a00" },
  "Kratom Dispensary": { bg: "#f3e9ff", fg: "#6b21a8" },
  "Kratom Dispensary/Distributor": { bg: "#ecebff", fg: "#3730a3" },
  "CBD Dispensary": { bg: "#e6fdff", fg: "#0e5e71" },
  "Kava/Kratom Bar": { bg: "#e0f2ff", fg: "#075985" },
  "Kava Bar": { bg: "#e0e7ff", fg: "#3940a3" },
  "Health Food Store": { bg: "#e6fbf0", fg: "#0b6b4b" },
  "Tobacco Shop": { bg: "#eef3f8", fg: "#334155" },
  "Liquor store": { bg: "#ffe6ea", fg: "#b1123b" },
  "Online Retailer": { bg: "#dff0ff", fg: "#0f3b7a" },
  Franchise: { bg: "#fff7d6", fg: "#8a5a00" },
  Spa: { bg: "#efe7ff", fg: "#6b28a8" },
  Individual: { bg: "#e6f0ff", fg: "#1a40a6" },
  "Beer and Wine Bar": { bg: "#e8fbea", fg: "#166534" },
  Market: { bg: "#e6fdff", fg: "#155e75" },
  "Amherst Client": { bg: "#f4e9ff", fg: "#6d28d9" },
  "Sully's Client": { bg: "#e0f2ff", fg: "#075985" },
  "Whole Saler": { bg: "#e8edf3", fg: "#334155" },
  "Gas station": { bg: "#fff2df", fg: "#9a4f00" },
  "Vape Empire": { bg: "#e3e6ff", fg: "#3730a3" },
  Other: { bg: "#f1f5f9", fg: "#334155" },
};

export const CONTACT_TYPE_COLORS = {
  "Potential Customer": { bg: "#e6f0ff", fg: "#1a40a6" },
  "Current Customer": { bg: "#ecfdf3", fg: "#0b6b46" },
  "Inactive Customer": { bg: "#ffe6ea", fg: "#b0123b" },
  Uncategorized: { bg: "#eef2f6", fg: "#475569" },
  Other: { bg: "#f2f4f7", fg: "#334155" },
};

export const dash = (v) =>
  v === null || v === undefined || v === "" ? "—" : String(v);

export const fmtDate = (v) => (v ? new Date(v).toLocaleString() : "—");

export function gmapsLink(fullAddr) {
  return fullAddr
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        fullAddr
      )}`
    : null;
}

export function fullAddressFromClient(c) {
  const parts = [c?.address, c?.city, c?.state, c?.postalCode].filter(Boolean);
  return parts.join(", ");
}

// "729" -> "07/29", "1225" -> "12/25"
export function formatExpiry(raw) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 3) {
    const mm = digits[0];
    const yy = digits.slice(1);
    return `${mm.padStart(2, "0")}/${yy}`;
  }
  if (digits.length === 4) {
    const mm = digits.slice(0, 2);
    const yy = digits.slice(2);
    return `${mm}/${yy}`;
  }
  return raw;
}
