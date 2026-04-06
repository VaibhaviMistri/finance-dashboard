import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllTransactions } from "../store/slices/transactionsSlice";
import { selectFilters } from "../store/slices/filtersSlice";
import { groupByMonth, groupByCategory, totalIncome, totalExpenses, netBalance, savingsRate, percentChange } from "../utils/finance";
import { PER_PAGE } from "../constants";

export function useFinancialSummary() {
  const transactions = useSelector(selectAllTransactions);
  return useMemo(() => {
    const monthly  = groupByMonth(transactions);
    const catData  = groupByCategory(transactions);
    const current  = monthly[monthly.length - 1] || {};
    const previous = monthly[monthly.length - 2] || {};
    return {
      monthly, catData,
      currentMonth: current, previousMonth: previous,
      totalBalance:  netBalance(transactions),
      totalIncome:   totalIncome(transactions),
      totalExpenses: totalExpenses(transactions),
      savingsRate:   savingsRate(transactions),
      incomeChange:  percentChange(current.income   || 0, previous.income   || 0),
      expenseChange: percentChange(current.expenses || 0, previous.expenses || 0),
    };
  }, [transactions]);
}

export function useFilteredTransactions() {
  const transactions = useSelector(selectAllTransactions);
  const f            = useSelector(selectFilters);
  return useMemo(() => {
    let list = transactions.filter(t => {
      if (f.type     !== "all" && t.type     !== f.type)           return false;
      if (f.category !== "all" && t.category !== f.category)       return false;
      if (f.month    !== "all" && !t.date.startsWith(f.month))     return false;
      if (f.search && !`${t.category} ${t.note} ${t.amount}`.toLowerCase().includes(f.search.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a,b) => {
      const va = f.sortBy === "amount" ? a.amount : a[f.sortBy];
      const vb = f.sortBy === "amount" ? b.amount : b[f.sortBy];
      if (va < vb) return f.sortDir === "asc" ? -1 : 1;
      if (va > vb) return f.sortDir === "asc" ?  1 : -1;
      return 0;
    });
    const totalPages = Math.ceil(list.length / PER_PAGE);
    const page       = Math.min(f.page, totalPages || 1);
    return { filtered: list, paginated: list.slice((page-1)*PER_PAGE, page*PER_PAGE), totalPages, page };
  }, [transactions, f]);
}

export function useAvailableMonths() {
  const transactions = useSelector(selectAllTransactions);
  return useMemo(() => {
    const s = new Set(transactions.map(t => t.date.slice(0,7)));
    return ["all", ...Array.from(s).sort().reverse()];
  }, [transactions]);
}
