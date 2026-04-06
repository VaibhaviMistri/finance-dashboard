export function Card({ children, className = "" }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function SectionTitle({ children }) {
  return <p className="section-title">{children}</p>;
}

export function Badge({ type }) {
  return type === "income"
    ? <span className="badge-income">Income</span>
    : <span className="badge-expense">Expense</span>;
}

export function StatCard({ label, value, change, colorClass, icon, subLabel }) {
  const pos = change >= 0;
  return (
    <Card className="flex flex-col gap-2 animate-scale-in">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide leading-relaxed">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${colorClass}`}>{value}</p>
      {change !== undefined && (
        <p className={`text-xs flex items-center gap-1 ${pos ? "text-emerald-500" : "text-red-500"}`}>
          <span>{pos ? "▲" : "▼"}</span>
          <span>{Math.abs(change).toFixed(1)}% vs last month</span>
        </p>
      )}
      {subLabel && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subLabel}</p>}
    </Card>
  );
}

export function EmptyState({ message = "No data", icon = "📭" }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-400 dark:text-slate-600">
      <span className="text-4xl">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full sm:max-w-md p-6 shadow-2xl animate-slide-up rounded-t-3xl sm:rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
