import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useFinancialSummary } from "../../hooks/useFinancials";
import { selectAllTransactions } from "../../store/slices/transactionsSlice";
import { Card, SectionTitle } from "../ui";
import { CategoryTrendChart } from "../charts";
import { PIE_COLORS, SAVINGS_GOAL } from "../../constants";
import { formatINR, formatINRCompact, percentChange } from "../../utils/finance";

const TREND_CATS = ["Food & Dining", "Transport", "Shopping", "Entertainment", "Utilities"];

export function InsightsTab() {
  const transactions = useSelector(selectAllTransactions);
  const { monthly, catData, currentMonth, previousMonth } = useFinancialSummary();

  const last3    = monthly.slice(-3);
  const topCat   = catData[0];
  const totalExp = catData.reduce((s, c) => s + c.value, 0);

  const currSavings =
    currentMonth.income > 0
      ? ((currentMonth.income - currentMonth.expenses) / currentMonth.income) * 100
      : 0;

  const avgIncome   = monthly.reduce((s, m) => s + m.income,   0) / (monthly.length || 1);
  const avgExpenses = monthly.reduce((s, m) => s + m.expenses, 0) / (monthly.length || 1);

  const trendData = useMemo(
    () =>
      last3.map((m) => {
        const row = { month: m.label };
        TREND_CATS.forEach((cat) => {
          row[cat] = transactions
            .filter((t) => t.type === "expense" && t.category === cat && t.date.startsWith(m.month))
            .reduce((s, t) => s + t.amount, 0);
        });
        return row;
      }),
    [transactions, last3]
  );

  const kpiCards = [
    {
      icon:    "🔥",
      label:   "Top Spending Category",
      value:   topCat?.name || "—",
      sub:     topCat
                 ? `${formatINR(topCat.value)} · ${((topCat.value / totalExp) * 100).toFixed(1)}% of total`
                 : "No expenses recorded",
      accent:  "border-l-amber-400",
    },
    {
      icon:    "📊",
      label:   "Savings Rate This Month",
      value:   `${currSavings.toFixed(1)}%`,
      sub:     `Goal: ${SAVINGS_GOAL}%`,
      accent:  currSavings >= SAVINGS_GOAL ? "border-l-emerald-500" : "border-l-amber-400",
      badge:   currSavings >= SAVINGS_GOAL
                 ? { text: "✅ On track",    cls: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" }
                 : { text: "⚠️ Below goal", cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    },
    {
      icon:    "💸",
      label:   "Avg Monthly Expenses",
      value:   formatINRCompact(avgExpenses),
      sub:     "Over tracked period",
      accent:  "border-l-red-500",
    },
    {
      icon:    "💵",
      label:   "Avg Monthly Income",
      value:   formatINRCompact(avgIncome),
      sub:     "Over tracked period",
      accent:  "border-l-emerald-500",
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5 animate-slide-up">

      {/* KPI insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((c) => (
          <Card key={c.label} className={`border-l-4 ${c.accent} flex flex-col gap-2`}>
            <span className="text-2xl">{c.icon}</span>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {c.label}
            </p>
            <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {c.value}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{c.sub}</p>
            {c.badge && (
              <span className={`mt-1 inline-block self-start text-xs px-2 py-0.5 rounded-lg font-semibold ${c.badge.cls}`}>
                {c.badge.text}
              </span>
            )}
          </Card>
        ))}
      </div>

      {/* Month-over-month */}
      {currentMonth.month && previousMonth.month && (
        <Card>
          <SectionTitle>Month-over-Month Comparison</SectionTitle>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              ["Income",   "income",   "text-emerald-500"],
              ["Expenses", "expenses", "text-red-500"],
              ["Net",      "balance",  "text-blue-500"],
            ].map(([label, key, cls]) => {
              const curr = currentMonth[key]  || 0;
              const prev = previousMonth[key] || 0;
              const pct  = percentChange(curr, prev);
              return (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{label}</p>
                  <p className={`text-base sm:text-xl font-bold ${cls}`}>{formatINR(curr)}</p>
                  <p className={`text-xs mt-1 font-medium ${pct >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {pct >= 0 ? "+" : ""}{pct.toFixed(1)}% vs {previousMonth.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Category trend line chart */}
      <Card>
        <SectionTitle>Spending Trend by Category (Last 3 Months)</SectionTitle>
        <CategoryTrendChart data={trendData} categories={TREND_CATS} />
        <div className="flex flex-wrap gap-3 mt-4">
          {TREND_CATS.map((cat, i) => (
            <span key={cat} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span
                className="inline-block w-3 h-0.5 rounded-full"
                style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
              />
              {cat}
            </span>
          ))}
        </div>
      </Card>

      {/* Top categories bar table */}
      <Card>
        <SectionTitle>Top Spending Categories</SectionTitle>
        <div className="flex flex-col gap-3">
          {catData.slice(0, 6).map((c, i) => {
            const pct = totalExp > 0 ? (c.value / totalExp) * 100 : 0;
            return (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 dark:text-slate-600 w-4 shrink-0 text-right">
                  {i + 1}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate min-w-0">
                  {c.name}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 sm:w-32 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width:      `${(c.value / (catData[0]?.value || 1)) * 100}%`,
                        background: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 w-8 text-right">
                    {pct.toFixed(0)}%
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 w-24 text-right">
                    {formatINR(c.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Monthly cash flow table */}
      <Card>
        <SectionTitle>Monthly Cash Flow Summary</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <th className="table-th">Month</th>
                <th className="table-th text-right">Income</th>
                <th className="table-th text-right">Expenses</th>
                <th className="table-th text-right">Net</th>
                <th className="table-th text-right">Savings %</th>
              </tr>
            </thead>
            <tbody>
              {[...monthly].reverse().map((m) => {
                const sr = m.income > 0 ? ((m.income - m.expenses) / m.income) * 100 : 0;
                return (
                  <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="table-td font-medium text-slate-700 dark:text-slate-300">{m.label}</td>
                    <td className="table-td text-right text-emerald-500 font-semibold">{formatINR(m.income)}</td>
                    <td className="table-td text-right text-red-500 font-semibold">{formatINR(m.expenses)}</td>
                    <td className={`table-td text-right font-bold ${m.balance >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {m.balance >= 0 ? "+" : ""}{formatINR(m.balance)}
                    </td>
                    <td className={`table-td text-right text-xs font-semibold ${sr >= SAVINGS_GOAL ? "text-emerald-500" : "text-amber-500"}`}>
                      {sr.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
