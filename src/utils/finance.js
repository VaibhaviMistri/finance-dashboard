import { MONTHS_SHORT } from "../constants";

// ─── INR Formatting ───────────────────────────────────────────────────────────
export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style:                 "currency",
    currency:              "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const formatINRCompact = (n) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)}K`;
  return formatINR(n);
};

export const formatPercent    = (n, d = 1) => `${n.toFixed(d)}%`;
export const percentChange    = (curr, prev) => prev === 0 ? 0 : ((curr - prev) / Math.abs(prev)) * 100;

// ─── Aggregations ─────────────────────────────────────────────────────────────
export const totalIncome   = (t) => t.filter(x => x.type === "income").reduce((s, x) => s + x.amount, 0);
export const totalExpenses = (t) => t.filter(x => x.type === "expense").reduce((s, x) => s + x.amount, 0);
export const netBalance    = (t) => totalIncome(t) - totalExpenses(t);
export const savingsRate   = (t) => { const i = totalIncome(t); return i === 0 ? 0 : (netBalance(t) / i) * 100; };

export function groupByMonth(txns) {
  const map = {};
  txns.forEach((t) => {
    const key = t.date.slice(0, 7);
    if (!map[key]) map[key] = { month: key, label: MONTHS_SHORT[parseInt(key.slice(5,7),10)-1], income: 0, expenses: 0, balance: 0, cumBalance: 0 };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expenses += t.amount;
  });
  let run = 0;
  return Object.values(map)
    .sort((a,b) => a.month.localeCompare(b.month))
    .map(m => { m.balance = m.income - m.expenses; run += m.balance; m.cumBalance = run; return m; });
}

export function groupByCategory(txns) {
  const map = {};
  txns.filter(t => t.type === "expense").forEach(t => { map[t.category] = (map[t.category]||0) + t.amount; });
  return Object.entries(map).map(([name,value]) => ({ name, value })).sort((a,b) => b.value - a.value);
}

// ─── Storage ──────────────────────────────────────────────────────────────────
export const readStorage  = (key, fb) => { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fb; } catch { return fb; } };
export const writeStorage = (key, v)  => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };

// ─── CSV Export ───────────────────────────────────────────────────────────────
export function exportCSV(txns, filename = "transactions.csv") {
  const header = "Date,Amount (INR),Type,Category,Note";
  const rows   = txns.map(t => `${t.date},${t.amount.toFixed(2)},${t.type},${t.category},"${t.note}"`);
  const blob   = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
