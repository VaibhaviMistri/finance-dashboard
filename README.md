# FinTrack — Personal Finance Dashboard

> A clean, responsive, and feature-rich personal finance dashboard built with React, Redux Toolkit, and Tailwind CSS. Designed to help users track income, expenses, and spending patterns — with full dark/light theme support and role-based access control.

<br />

## 📌 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Architecture & Design Decisions](#-architecture--design-decisions)
- [State Management](#-state-management-redux-toolkit)
- [Role-Based Access Control](#-role-based-access-control)
- [INR Currency Support](#-inr-currency-support)
- [Responsive Design](#-responsive-design)
- [Available Scripts](#-available-scripts)

<br />

## 🚀 Live Demo

🔗 **[https://financedashboard-lime.vercel.app/](https://financedashboard-lime.vercel.app/)**

> Default role on load: **Admin** — switch to Viewer from the header dropdown to see read-only mode.

<br />

## ✨ Features

### 📊 Overview
- **4 KPI Summary Cards** — Total Balance, Income, Expenses, Savings Rate with month-over-month % change
- **Balance Trend** — Cumulative area chart showing net worth growth over 6 months
- **Income vs Expenses** — Grouped bar chart comparing monthly income and spending
- **Spending Breakdown** — Interactive donut chart with top-6 category legend
- **Monthly Net Savings** — Bar chart coloured green (surplus) or red (deficit) per month

### 💳 Transactions
- **Multi-filter system** — Filter by type, category, month, and free-text search — all combinable
- **Sortable columns** — Click Date or Amount header to toggle ascending / descending sort
- **Paginated table** — 10 rows per page with numbered pagination and ellipsis for large datasets
- **CRUD operations** — Add, edit, and delete transactions (Admin role only)
- **CSV export** — Download the currently filtered view as a `.csv` file
- **Live summary pills** — Real-time count and total for visible income and expense rows

### 💡 Insights
- **Top spending category** with percentage of total spend
- **Savings rate tracker** vs a configurable goal (default 20%)
- **Month-over-month comparison** — Income, Expenses, and Net vs the previous month
- **Category trend chart** — Multi-line chart for 5 expense categories over the last 3 months
- **Top categories bar table** — Horizontal bar visualisation with percentage breakdown
- **Monthly cash flow table** — Full 6-month summary with per-month savings rate

### 🎨 UI & UX
- **Dark / Light theme toggle** — Persisted to localStorage with zero flash on page load
- **Fully responsive** — Dedicated layouts for mobile, tablet, and desktop
- **Mobile-first navigation** — Bottom tab bar on mobile, horizontal nav on desktop
- **Smooth animations** — Fade-in, slide-up, and scale-in transitions on tab switches and modals
- **Data persistence** — Transactions, role, and theme all survive a page refresh

<br />

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 18 | Component-based UI with hooks |
| State Management | Redux Toolkit | Predictable global state with slices and selectors |
| React–Redux Bindings | react-redux | Connecting the Redux store to React components |
| Styling | Tailwind CSS 3 | Utility-first CSS with built-in dark mode support |
| Charts | Recharts | Composable, responsive chart components for React |
| Build Tool | Create React App | Zero-config development and production build pipeline |

<br />

## 📁 Project Structure

```
finance-dashboard/
├── public/
│   └── index.html                    # HTML shell with DM Sans Google Font
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   └── index.jsx             # Area, Bar, Line, Pie, Donut chart wrappers
│   │   ├── insights/
│   │   │   └── InsightsTab.jsx       # Insights page — KPIs, MoM, trend, cash flow table
│   │   ├── layout/
│   │   │   └── Header.jsx            # Sticky header, mobile sidebar, theme + role controls
│   │   ├── overview/
│   │   │   └── OverviewTab.jsx       # Overview page — KPI cards + 4 charts
│   │   ├── transactions/
│   │   │   ├── TransactionForm.jsx   # Controlled add / edit form with ₹ input
│   │   │   └── TransactionsTab.jsx   # Filtered, sorted, paginated transaction list
│   │   └── ui/
│   │       └── index.jsx             # Design system — Card, Badge, StatCard, Modal, EmptyState
│   ├── constants/
│   │   └── index.js                  # Categories, colours, tab definitions, role constants
│   ├── data/
│   │   └── mockTransactions.js       # Seeded pseudo-random INR transaction generator
│   ├── hooks/
│   │   └── useFinancials.js          # useFinancialSummary · useFilteredTransactions · useAvailableMonths
│   ├── store/
│   │   ├── index.js                  # configureStore — combines all three slices
│   │   └── slices/
│   │       ├── transactionsSlice.js  # CRUD actions + localStorage persistence
│   │       ├── uiSlice.js            # Theme · role · activeTab · sidebarOpen
│   │       └── filtersSlice.js       # Search · type · category · month · sort · page
│   ├── utils/
│   │   └── finance.js                # Pure functions — INR formatting, aggregations, CSV export
│   ├── App.jsx                       # Root component — tab router
│   ├── index.css                     # Tailwind directives + reusable component classes
│   └── index.js                      # ReactDOM entry point + Redux Provider
├── .gitignore
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

<br />

## 🏁 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher

Verify your environment:

```bash
node --version
npm --version
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/VaibhaviMistri/finance-dashboard.git

# 2. Navigate into the project folder
cd finance-dashboard

# 3. Install all dependencies
npm install

# 4. Start the development server
npm start
```

The app opens automatically at **[http://localhost:3000](http://localhost:3000)**.

### Production Build

```bash
npm run build
```

Outputs an optimised static build to the `/build` directory, ready for any static host.

### Deploy to Vercel (Free, ~60 seconds)

<br />

## 🏗 Architecture & Design Decisions

### Why Redux Toolkit instead of Context API?

Three separate tabs — Overview, Transactions, and Insights — all consume the **same transaction data at the same time**. With Context, a state change would re-render the entire tree. Redux solves this with targeted selectors: each component subscribes only to the exact slice of state it needs, and re-renders only when that specific data changes.

Redux Toolkit was chosen over vanilla Redux because:
- `createSlice` eliminates repetitive action type constants and creator functions
- Immer integration allows direct-mutation syntax inside reducers
- `configureStore` sets up Redux DevTools automatically with zero config

### Why extract logic into custom hooks?

```js
// Without a hook — this computation lives inside every component that needs it
const transactions = useSelector(state => state.transactions.items);
const monthly      = useMemo(() => groupByMonth(transactions), [transactions]);
const catData      = useMemo(() => groupByCategory(transactions), [transactions]);
// ...and 8 more lines of derived values

// With a hook — one line, fully memoised, reusable anywhere
const { monthly, catData, totalBalance, savingsRate } = useFinancialSummary();
```

All heavy computation is wrapped in `useMemo` inside the hooks, so charts and KPIs only recalculate when the underlying transaction data actually changes — not on every render.

### Why Tailwind CSS instead of a component library?

Tailwind was chosen over Material UI or Chakra UI for two reasons:

1. **Complete control** — no overriding default component styles or fighting specificity wars
2. **Dark mode in one character** — adding `dark:` before any utility class is all it takes

Reusable component classes (`.card`, `.btn-primary`, `.input-base`, `.badge-income`) are defined once in `index.css` using `@layer components`, creating a lightweight design system without any external dependency.

### Deterministic mock data

`mockTransactions.js` uses a **seeded pseudo-random number generator** (mulberry32, seed `20260331`) instead of `Math.random()`. This means the same realistic dataset appears on every page load — charts look consistent and evaluators always see the same numbers, which matters during a review.

<br />

## 🗄 State Management — Redux Toolkit

### Store Structure

```
store/
├── transactionsSlice   →   { items: Transaction[] }
├── uiSlice             →   { theme, role, activeTab, sidebarOpen }
└── filtersSlice        →   { search, type, category, month, sortBy, sortDir, page }
```

### `transactionsSlice`

Manages the core data array. Every mutation dispatches an action **and** immediately syncs to `localStorage`, so data survives a page refresh without any extra middleware.

### `uiSlice`

Manages all visual and behavioural preferences. The `toggleTheme` action does two things simultaneously:

1. Updates `state.theme` in Redux
2. Adds or removes the `dark` class on `<html>` — required for Tailwind's class-based dark mode

On the very first import of the slice (before any component mounts), the saved theme is read from `localStorage` and applied to the DOM — this eliminates any flash of the wrong theme.

### `filtersSlice`

Manages the complete filter, sort, and pagination state for the Transactions tab. One important rule is built into the `setFilter` reducer: **any filter change that is not a page change automatically resets the page to 1**. This prevents landing on a nonexistent page after narrowing a filter.

### Data Flow

```
User interaction  →  dispatch(action)  →  Redux slice updates
        ↓
useSelector / custom hook recomputes (memoised)
        ↓
Component re-renders with new data
```

<br />

## 🔐 Role-Based Access Control

Two roles are available and switchable in real time from the header dropdown:

| Capability | 👑 Admin | 👁 Viewer |
|---|:---:|:---:|
| View all data and charts | ✅ | ✅ |
| Export transactions as CSV | ✅ | ✅ |
| Add new transactions | ✅ | ❌ |
| Edit existing transactions | ✅ | ❌ |
| Delete transactions | ✅ | ❌ |

> **Implementation note:** Restricted UI elements are **removed from the DOM entirely** for the Viewer role — not just visually hidden with CSS. Hidden elements can be revealed in browser DevTools; absent elements cannot.

The selected role persists to `localStorage` under the key `ft_role`.

<br />

## 💰 INR Currency Support

All monetary values use Indian Rupee formatting powered by the native `Intl.NumberFormat` API with `en-IN` locale — no external library required.

| Function | Input | Output |
|---|---|---|
| `formatINR(n)` | `125000` | `₹1,25,000` |
| `formatINRCompact(n)` | `150000` | `₹1.5L` |
| `formatINRCompact(n)` | `25000000` | `₹2.5Cr` |
| `formatINRCompact(n)` | `8500` | `₹8.5K` |

The compact formatter uses Indian-standard notation — **K** (thousands), **L** (lakhs), **Cr** (crores) — keeping chart axis labels concise without losing meaning.

Mock transaction notes use realistic Indian merchant names: Zomato, Swiggy, BigBasket, Ola, Uber, Jio Broadband, IndiGo, DMart, Myntra, Flipkart, Apollo Pharmacy, and more.

<br />

## 📱 Responsive Design

Built mobile-first using Tailwind's breakpoint prefixes:

| Breakpoint | Min Width | Layout Behaviour |
|---|---|---|
| Mobile | `0px` | Single column · Bottom tab bar · Full-width sheet modals |
| Small | `640px` | 2-column grids · Compact header with balance visible |
| Tablet | `768px` | Side-by-side charts · Note column visible in table |
| Desktop | `1024px` | 4-column KPI grid · Horizontal nav · Full sidebar |

**Key decisions per breakpoint:**

- **Navigation** — Bottom tab bar on mobile for thumb reach; horizontal tabs in header on desktop
- **KPI cards** — 2 per row on mobile → 4 per row on desktop
- **Charts** — Stacked single column on mobile → side-by-side on tablet and above
- **Modals** — Slides up from bottom on mobile (sheet pattern) → centred card on larger screens
- **Transaction table** — Note column hidden on mobile to prevent horizontal overflow
- **Header balance** — Hidden on extra-small screens to keep controls accessible

<br />

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server at `localhost:3000` with hot reload |
| `npm run build` | Create an optimised production build in the `/build` folder |
| `npm test` | Run the test suite in interactive watch mode |

<br />

## 🌱 Future Enhancements

- [ ] Backend integration with a REST API or Firebase Firestore
- [ ] User authentication with JWT or Google OAuth
- [ ] Per-category budget limits with overspend alerts
- [ ] Recurring transaction support with automatic monthly entries
- [ ] Custom date range picker for flexible period filtering
- [ ] PDF report generation and export
- [ ] Unit and integration tests with Jest and React Testing Library

<br />

---

<div align="center">

Built with React · Redux Toolkit · Tailwind CSS · Recharts

</div>