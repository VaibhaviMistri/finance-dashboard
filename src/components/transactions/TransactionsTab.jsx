import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, editTransaction, deleteTransaction } from "../../store/slices/transactionsSlice";
import { selectRole } from "../../store/slices/uiSlice";
import { setFilter, toggleSort, resetFilters, selectFilters } from "../../store/slices/filtersSlice";
import { useFilteredTransactions, useAvailableMonths } from "../../hooks/useFinancials";
import { TransactionForm } from "./TransactionForm";
import { Badge, Card, EmptyState, Modal } from "../ui";
import { ALL_CATEGORIES, ROLES, CATEGORY_COLORS } from "../../constants";
import { formatINR, exportCSV } from "../../utils/finance";

function SortIndicator({ col }) {
  const { sortBy, sortDir } = useSelector(selectFilters);
  if (sortBy !== col) return <span className="text-slate-200 dark:text-slate-700 ml-1 text-[10px]">↕</span>;
  return <span className="text-emerald-500 ml-1 text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>;
}

function TransactionsTable({ paginated, role, onEdit, onDelete }) {
  const dispatch = useDispatch();
  if (!paginated.length) return <EmptyState message="No transactions match your filters."/>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/60">
            <th className="table-th" onClick={() => dispatch(toggleSort("date"))}>Date<SortIndicator col="date"/></th>
            <th className="table-th">Category</th>
            <th className="table-th hidden md:table-cell">Note</th>
            <th className="table-th">Type</th>
            <th className="table-th text-right" onClick={() => dispatch(toggleSort("amount"))}>Amount<SortIndicator col="amount"/></th>
            {role === ROLES.ADMIN && <th className="table-th text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginated.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td className="table-td text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">{t.date}</td>
              <td className="table-td">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[t.category] || "#94a3b8" }}/>
                  <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm whitespace-nowrap">{t.category}</span>
                </span>
              </td>
              <td className="table-td hidden md:table-cell text-slate-400 dark:text-slate-500 text-xs max-w-[160px] truncate">{t.note}</td>
              <td className="table-td"><Badge type={t.type}/></td>
              <td className={`table-td text-right font-bold text-sm whitespace-nowrap ${t.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                {t.type === "income" ? "+" : "−"}{formatINR(t.amount)}
              </td>
              {role === ROLES.ADMIN && (
                <td className="table-td text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(t)} className="px-2 py-1 text-xs rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Edit</button>
                    <button onClick={() => onDelete(t.id)} className="px-2 py-1 text-xs rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Del</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({ page, totalPages }) {
  const dispatch = useDispatch();
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  return (
    <div className="flex items-center justify-center gap-1.5 p-4 border-t border-slate-100 dark:border-slate-800 flex-wrap">
      <button disabled={page === 1} onClick={() => dispatch(setFilter({ page: page - 1 }))} className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40">← Prev</button>
      {visible.reduce((acc, p, i, arr) => {
        if (i > 0 && p - arr[i-1] > 1) acc.push(<span key={`dot-${p}`} className="text-slate-300 dark:text-slate-600 text-xs">…</span>);
        acc.push(
          <button key={p} onClick={() => dispatch(setFilter({ page: p }))}
            className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
              p === page ? "bg-emerald-500 text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}>{p}</button>
        );
        return acc;
      }, [])}
      <button disabled={page === totalPages} onClick={() => dispatch(setFilter({ page: page + 1 }))} className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40">Next →</button>
    </div>
  );
}

export function TransactionsTab() {
  const dispatch = useDispatch();
  const role     = useSelector(selectRole);
  const filters  = useSelector(selectFilters);
  const months   = useAvailableMonths();
  const { filtered, paginated, totalPages, page } = useFilteredTransactions();
  const [showAdd, setShowAdd] = useState(false);
  const [editTx,  setEditTx]  = useState(null);

  const hasFilters  = filters.search || filters.type !== "all" || filters.category !== "all" || filters.month !== "all";
  const incTotal    = filtered.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const expTotal    = filtered.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);

  const sel = "input-base py-1.5 !text-xs";

  return (
    <div className="flex flex-col gap-4 animate-slide-up">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={filters.search}
          onChange={e => dispatch(setFilter({ search: e.target.value }))}
          placeholder="Search by category, note, amount…"
          className={`${sel} min-w-[160px] flex-1`}
        />
        <select value={filters.type}     onChange={e => dispatch(setFilter({ type: e.target.value }))}     className={`${sel} w-auto`}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filters.category} onChange={e => dispatch(setFilter({ category: e.target.value }))} className={`${sel} w-auto`}>
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filters.month}    onChange={e => dispatch(setFilter({ month: e.target.value }))}    className={`${sel} w-auto`}>
          {months.map(m => <option key={m} value={m}>{m === "all" ? "All Months" : m}</option>)}
        </select>
        <div className="flex gap-2 ml-auto shrink-0">
          <button onClick={() => exportCSV(filtered)} className="btn-ghost text-xs py-1.5">↓ CSV</button>
          {role === ROLES.ADMIN && (
            <button onClick={() => setShowAdd(true)} className="btn-primary text-xs py-1.5">+ Add</button>
          )}
        </div>
      </div>

      {/* Summary + clear */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          {filtered.filter(t=>t.type==="income").length} income · {formatINR(incTotal)}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
          {filtered.filter(t=>t.type==="expense").length} expenses · {formatINR(expTotal)}
        </span>
        {hasFilters && (
          <button onClick={() => dispatch(resetFilters())} className="text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <Card className="!p-0 overflow-hidden">
        <TransactionsTable paginated={paginated} role={role} onEdit={setEditTx} onDelete={id => dispatch(deleteTransaction(id))}/>
        <Pagination page={page} totalPages={totalPages}/>
      </Card>

      {showAdd && (
        <Modal title="Add Transaction" onClose={() => setShowAdd(false)}>
          <TransactionForm onSave={tx => { dispatch(addTransaction(tx)); setShowAdd(false); }} onClose={() => setShowAdd(false)}/>
        </Modal>
      )}
      {editTx && (
        <Modal title="Edit Transaction" onClose={() => setEditTx(null)}>
          <TransactionForm initial={editTx} onSave={tx => { dispatch(editTransaction(tx)); setEditTx(null); }} onClose={() => setEditTx(null)}/>
        </Modal>
      )}
    </div>
  );
}
