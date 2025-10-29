export const dash = (v) =>
  v === undefined || v === null || v === "" ? "—" : v;

export const cls = (...xs) => xs.filter(Boolean).join(" ");

export const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? dash(v) : d.toLocaleString();
};