import { useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../constants";

export function TransactionForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    date: new Date().toISOString().slice(0,10),
    amount: "", category: "Food & Dining", type: "expense", note: "",
  });
  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cats  = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const valid = form.amount && parseFloat(form.amount) > 0 && form.date;

  const handleType = (t) => { set("type", t); set("category", t === "income" ? "Salary" : "Food & Dining"); };

  const Label = ({ children }) => (
    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{children}</label>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Type toggle */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 p-1 gap-1">
        {["expense","income"].map(t => (
          <button key={t} onClick={() => handleType(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              form.type === t
                ? t === "income" ? "bg-emerald-500 text-white shadow-sm" : "bg-red-500 text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}>
            {t === "income" ? "📈 Income" : "📉 Expense"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Amount (₹)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-semibold">₹</span>
            <input
              type="number" min="0" step="1"
              value={form.amount}
              onChange={e => set("amount", e.target.value)}
              placeholder="0"
              className="input-base pl-7"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Date</Label>
          <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="input-base"/>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <select value={form.category} onChange={e => set("category", e.target.value)} className="input-base">
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Note (optional)</Label>
        <input type="text" value={form.note} onChange={e => set("note", e.target.value)} placeholder="e.g. Grocery – DMart" className="input-base"/>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
        <button onClick={() => valid && onSave({ ...form, amount: parseFloat(form.amount) })} disabled={!valid} className="btn-primary flex-1">
          {initial ? "Update" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}
