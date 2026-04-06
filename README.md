# FinTrack — Personal Finance Dashboard

A clean, responsive personal finance dashboard built with **React**, **Redux Toolkit**, and **Tailwind CSS**. Tracks income, expenses, and spending patterns with INR currency, dark/light theme, and role-based access control.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
http://localhost:3000
```

### Production Build
```bash
npm run build
```

### Free Deployment (Vercel)
```bash
npm run build
npx vercel --prod   # gives you a live HTTPS URL in ~60 seconds
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/
│   │   └── index.jsx            # Recharts wrappers: Area, Bar, Line, Pie, Donut
│   ├── insights/
│   │   └── InsightsTab.jsx      # Insights page: KPIs, MoM, trend, cash flow table
│   ├── layout/
│   │   └── Header.jsx           # Sticky header, mobile sidebar, theme toggle, role switcher
│   ├── overview/
│   │   └── OverviewTab.jsx      # Dashboard overview: KPI cards + 4 charts
│   ├── transactions/
│   │   ├── TransactionsTab.jsx  # Filterable, sortable, paginated transaction list
│   │   └── TransactionForm.jsx  # Add / edit transaction modal form
│   └── ui/
│       └── index.jsx            # Primitives: Card, Badge, StatCard, Modal, EmptyState
├── constants/
│   └── index.js                 # Categories, colours, tabs, roles, storage keys
├── data/
│   └── mockTransactions.js      # Deterministic seeded mock data (INR amounts)
├── hooks/
│   └── useFinancials.js         # useFinancialSummary · useFilteredTransactions · useAvailableMonths
├── store/
│   ├── index.js                 # configureStore root
│   └── slices/
│       ├── transactionsSlice.js # CRUD actions + localStorage persistence
│       ├── uiSlice.js           # Theme · role · activeTab · sidebarOpen
│       └── filtersSlice.js      # Search · type · category · month · sort · page
├── utils/
│   └── finance.js               # INR formatters, aggregations, groupBy, CSV export, storage
├── App.jsx                      # Root component — tab router
└── index.js                     # ReactDOM entry + Redux Provider
```

---

## ✨ Features

### Overview
| Feature | Details |
|---|---|
| KPI Cards | Total Balance, Income, Expenses, Savings Rate with MoM % change |
| Balance Trend | Cumulative area chart over 6 months |
| Income vs Expenses | Grouped bar chart by month |
| Spending Breakdown | Donut chart with top-6 category legend |
| Monthly Net | Bar chart coloured green (surplus) / red (deficit) |

### Transactions
| Feature | Details |
|---|---|
| Filterable | Type · Category · Month · Full-text search — all combinable |
| Sortable | Click Date or Amount column header to sort asc/desc |
| Paginated | 10 per page with numbered page buttons |
| CRUD | Add / Edit / Delete (Admin only, hidden in Viewer mode) |
| CSV Export | Downloads currently filtered view as `.csv` |
| Summary pills | Live count + total for visible income and expenses |

### Insights
| Feature | Details |
|---|---|
| KPI Cards | Top category, savings rate vs goal, avg income/expenses |
| Month-over-Month | Income, Expenses, Net vs previous month |
| Category Trend | Multi-line chart for top 5 expense categories (last 3 months) |
| Top Categories | Bar table with percentage of total spend |
| Cash Flow Table | Month-by-month income, expenses, net, savings rate |

### Role-Based UI
| Feature | Admin | Viewer |
|---|---|---|
| View all data | ✅ | ✅ |
| Add transactions | ✅ | ❌ |
| Edit transactions | ✅ | ❌ |
| Delete transactions | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

Switch roles via the dropdown in the header. Role persists across page refreshes via `localStorage`.

---

## 🏗 Architecture

### State Management — Redux Toolkit
Three slices, each with a single responsibility:

| Slice | Responsibility |
|---|---|
| `transactionsSlice` | CRUD actions, items array, localStorage sync |
| `uiSlice` | `theme` · `role` · `activeTab` · `sidebarOpen` |
| `filtersSlice` | `search` · `type` · `category` · `month` · `sortBy` · `sortDir` · `page` |

### Custom Hooks
Business logic lives in `hooks/useFinancials.js`, not in components:
- `useFinancialSummary` — derives all KPIs from transaction list (memoised)
- `useFilteredTransactions` — filter + sort + paginate pipeline (memoised)
- `useAvailableMonths` — month options for the filter dropdown

### Pure Utilities
`utils/finance.js` contains only pure functions — no Redux, no React. Easily testable in isolation.

### Dark / Light Theme
- Tailwind `darkMode: "class"` strategy
- `uiSlice.toggleTheme` adds/removes the `dark` class on `<html>`
- Preference persisted to `localStorage`
- Instant switch, no flash on load

### Deterministic Mock Data
`data/mockTransactions.js` uses a **seeded pseudo-random generator** (mulberry32, seed `20260331`) so the dashboard shows the same realistic INR data every time — no randomness on refresh.

---

## 💰 INR Formatting

| Function | Example Output |
|---|---|
| `formatINR(n)` | `₹1,25,000` |
| `formatINRCompact(n)` | `₹1.2L` / `₹2.5Cr` / `₹850K` |
| `formatPercent(n)` | `18.4%` |

---

## ⚙️ Configuration

| Constant | File | Default |
|---|---|---|
| Transactions per page | `constants/index.js` | `10` |
| Savings goal % | `constants/index.js` | `20` |
| Mock data seed | `data/mockTransactions.js` | `20260331` |

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `@reduxjs/toolkit` | State management |
| `react-redux` | React–Redux bindings |
| `recharts` | Charts (Area, Bar, Line, Pie) |
| `tailwindcss` | Utility-first CSS |
| `autoprefixer` + `postcss` | CSS build tooling |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 640px` (mobile) | Single column, bottom tab bar, sheet-style modals |
| `640–1024px` (tablet) | 2-column grids, compact header |
| `> 1024px` (desktop) | Full sidebar nav, 4-column KPI grid, wide tables |
