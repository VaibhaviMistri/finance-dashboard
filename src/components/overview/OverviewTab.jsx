import { useMemo } from "react";
import { useFinancialSummary } from "../../hooks/useFinancials";
import { Card, SectionTitle, StatCard } from "../ui";
import { BalanceTrendChart, IncomeExpensesChart, MonthlyNetChart, SpendingDonutChart } from "../charts";
import { formatINR, formatPercent } from "../../utils/finance";
import { SAVINGS_GOAL } from "../../constants";

export function OverviewTab() {
  const { monthly, catData, totalBalance, totalIncome, totalExpenses, savingsRate, incomeChange, expenseChange } = useFinancialSummary();

  const balanceTrend = useMemo(() => {
    let r = 0; return monthly.map(m => ({ ...m, cumBalance: (r += m.balance) }));
  }, [monthly]);

  const stats = [
    {
      label: "Total Balance", icon: "💰",
      value: formatINR(totalBalance),
      colorClass: totalBalance >= 0 ? "text-emerald-500" : "text-red-500",
    },
    {
      label: "Total Income", icon: "📈",
      value: formatINR(totalIncome),
      colorClass: "text-emerald-500",
      change: incomeChange,
    },
    {
      label: "Total Expenses", icon: "📉",
      value: formatINR(totalExpenses),
      colorClass: "text-red-500",
      change: expenseChange,
    },
    {
      label: "Savings Rate", icon: "🏦",
      value: formatPercent(savingsRate),
      colorClass: savingsRate >= SAVINGS_GOAL ? "text-emerald-500" : "text-amber-500",
      subLabel: savingsRate >= SAVINGS_GOAL ? `✅ Goal met (${SAVINGS_GOAL}%)` : `⚠️ Goal: ${SAVINGS_GOAL}%`,
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5 animate-slide-up">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s}/>)}
      </div>

      {/* Time-series */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <SectionTitle>Balance Trend</SectionTitle>
          <BalanceTrendChart data={balanceTrend}/>
        </Card>
        <Card>
          <SectionTitle>Income vs Expenses</SectionTitle>
          <IncomeExpensesChart data={monthly}/>
        </Card>
      </div>

      {/* Categorical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <SectionTitle>Spending Breakdown</SectionTitle>
          <SpendingDonutChart data={catData}/>
        </Card>
        <Card>
          <SectionTitle>Monthly Net Savings</SectionTitle>
          <MonthlyNetChart data={monthly}/>
        </Card>
      </div>
    </div>
  );
}
