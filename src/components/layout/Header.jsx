import { useDispatch, useSelector } from "react-redux";
import {
  toggleTheme, setRole, setActiveTab, toggleSidebar, closeSidebar,
  selectTheme, selectRole, selectActiveTab, selectSidebarOpen,
} from "../../store/slices/uiSlice";
import { selectAllTransactions } from "../../store/slices/transactionsSlice";
import { TABS, ROLES } from "../../constants";
import { netBalance, formatINR } from "../../utils/finance";

const SunIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);
const XIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

function Logo() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">₹</div>
      <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base">FinTrack</span>
    </div>
  );
}

function MobileSidebar() {
  const dispatch  = useDispatch();
  const isOpen    = useSelector(selectSidebarOpen);
  const activeTab = useSelector(selectActiveTab);
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => dispatch(closeSidebar())}/>
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <Logo/>
          <button onClick={() => dispatch(closeSidebar())} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <XIcon/>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => dispatch(setActiveTab(t.id))}
              className={activeTab === t.id ? "nav-tab-active justify-start" : "nav-tab justify-start"}>
              <span className="text-base">{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export function Header() {
  const dispatch     = useDispatch();
  const theme        = useSelector(selectTheme);
  const role         = useSelector(selectRole);
  const activeTab    = useSelector(selectActiveTab);
  const transactions = useSelector(selectAllTransactions);
  const balance      = netBalance(transactions);

  return (
    <>
      <MobileSidebar/>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center gap-2 sm:gap-3">

          {/* Mobile hamburger */}
          <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <MenuIcon/>
          </button>

          <Logo/>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-3">
            {TABS.map(t => (
              <button key={t.id} onClick={() => dispatch(setActiveTab(t.id))}
                className={activeTab === t.id ? "nav-tab-active" : "nav-tab"}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Balance (hidden on xs) */}
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">Balance</span>
              <span className={`text-sm font-bold ${balance >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {formatINR(balance)}
              </span>
            </div>

            {/* Role switcher */}
            <select
              value={role}
              onChange={e => dispatch(setRole(e.target.value))}
              className={`text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-xl border cursor-pointer outline-none transition-all
                ${role === ROLES.ADMIN
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400"}`}>
              <option value={ROLES.ADMIN}>👑 Admin</option>
              <option value={ROLES.VIEWER}>👁 Viewer</option>
            </select>

            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700
                         bg-slate-50 dark:bg-slate-800
                         text-slate-600 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-700
                         transition-all duration-200">
              {theme === "dark" ? <SunIcon/> : <MoonIcon/>}
            </button>
          </div>
        </div>

        {/* Mobile bottom tab bar */}
        <div className="lg:hidden flex border-t border-slate-100 dark:border-slate-800">
          {TABS.map(t => (
            <button key={t.id} onClick={() => dispatch(setActiveTab(t.id))}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors
                ${activeTab === t.id
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                  : "text-slate-400 dark:text-slate-500"}`}>
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </header>
    </>
  );
}

export function ViewerBanner() {
  const role = useSelector(selectRole);
  if (role !== ROLES.VIEWER) return null;
  return (
    <div className="bg-blue-50 dark:bg-blue-500/10 border-b border-blue-100 dark:border-blue-500/20 px-4 py-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
      <span>👁</span>
      <span>Viewer mode — read only. Switch to <strong>Admin</strong> to add or edit transactions.</span>
    </div>
  );
}
