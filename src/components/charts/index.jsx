import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/uiSlice";
import { PIE_COLORS } from "../../constants";
import { formatINR, formatINRCompact } from "../../utils/finance";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-xs shadow-xl !rounded-xl">
      <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex gap-2" style={{ color: p.color }}>
          <span>{p.name}:</span><span className="font-bold">{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function useC() {
  const t = useSelector(selectTheme);
  return {
    grid: t === "dark" ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.18)",
    axis: t === "dark" ? "#64748b" : "#94a3b8",
  };
}

const AP = { axisLine: false, tickLine: false };
const GP = { strokeDasharray: "3 3" };

export function BalanceTrendChart({ data }) {
  const c = useC();
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid {...GP} stroke={c.grid}/>
        <XAxis dataKey="label" tick={{ fill: c.axis, fontSize: 11 }} {...AP}/>
        <YAxis tickFormatter={formatINRCompact} tick={{ fill: c.axis, fontSize: 11 }} {...AP} width={60}/>
        <Tooltip content={<ChartTooltip/>}/>
        <Area type="monotone" dataKey="cumBalance" name="Balance" stroke="#10b981" fill="url(#balGrad)" strokeWidth={2} dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function IncomeExpensesChart({ data }) {
  const c = useC();
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="28%">
        <CartesianGrid {...GP} stroke={c.grid}/>
        <XAxis dataKey="label" tick={{ fill: c.axis, fontSize: 11 }} {...AP}/>
        <YAxis tickFormatter={formatINRCompact} tick={{ fill: c.axis, fontSize: 11 }} {...AP} width={60}/>
        <Tooltip content={<ChartTooltip/>}/>
        <Bar dataKey="income"   name="Income"   fill="#10b981" radius={[4,4,0,0]}/>
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyNetChart({ data }) {
  const c = useC();
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <CartesianGrid {...GP} stroke={c.grid}/>
        <XAxis dataKey="label" tick={{ fill: c.axis, fontSize: 11 }} {...AP}/>
        <YAxis tickFormatter={formatINRCompact} tick={{ fill: c.axis, fontSize: 11 }} {...AP} width={60}/>
        <Tooltip content={<ChartTooltip/>}/>
        <Bar dataKey="balance" name="Net" radius={[4,4,0,0]}>
          {data.map((m,i) => <Cell key={i} fill={m.balance >= 0 ? "#10b981" : "#ef4444"}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SpendingDonutChart({ data }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-[45%] shrink-0">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
              {data.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
            </Pie>
            <Tooltip formatter={v => formatINR(v)}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {data.slice(0,6).map((c,i) => (
          <div key={c.name} className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i%PIE_COLORS.length] }}/>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">{c.name}</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0">{formatINRCompact(c.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryTrendChart({ data, categories }) {
  const c = useC();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid {...GP} stroke={c.grid}/>
        <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 11 }} {...AP}/>
        <YAxis tickFormatter={formatINRCompact} tick={{ fill: c.axis, fontSize: 11 }} {...AP} width={60}/>
        <Tooltip content={<ChartTooltip/>}/>
        {categories.map((cat,i) => (
          <Line key={cat} type="monotone" dataKey={cat} stroke={PIE_COLORS[i%PIE_COLORS.length]} strokeWidth={2} dot={{ r: 3 }}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
