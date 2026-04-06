export const EXPENSE_CATEGORIES = [
  "Food & Dining", "Transport", "Shopping",
  "Entertainment", "Healthcare", "Utilities", "Travel",
];
export const INCOME_CATEGORIES  = ["Salary", "Freelance", "Investment"];
export const ALL_CATEGORIES     = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const PIE_COLORS = [
  "#10b981","#3b82f6","#8b5cf6","#f59e0b",
  "#ef4444","#06b6d4","#ec4899","#84cc16",
];

export const CATEGORY_COLORS = {
  "Food & Dining": "#10b981", "Transport":     "#3b82f6",
  "Shopping":      "#8b5cf6", "Entertainment": "#f59e0b",
  "Healthcare":    "#ef4444", "Utilities":     "#06b6d4",
  "Travel":        "#ec4899", "Salary":        "#22c55e",
  "Freelance":     "#a3e635", "Investment":    "#38bdf8",
};

export const TABS = [
  { id: "overview",     label: "Overview",     icon: "▦" },
  { id: "transactions", label: "Transactions", icon: "↕" },
  { id: "insights",     label: "Insights",     icon: "◎" },
];

export const ROLES = { ADMIN: "admin", VIEWER: "viewer" };

export const STORAGE_KEYS = {
  TRANSACTIONS: "ft_txns",
  THEME:        "ft_theme",
  ROLE:         "ft_role",
};

export const PER_PAGE        = 10;
export const SAVINGS_GOAL    = 20; // percent
