import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS, ROLES } from "../../constants";
import { readStorage, writeStorage } from "../../utils/finance";

const savedTheme = readStorage(STORAGE_KEYS.THEME, "dark");
const savedRole  = readStorage(STORAGE_KEYS.ROLE,  ROLES.ADMIN);

// Apply theme on initial load
if (savedTheme === "dark") document.documentElement.classList.add("dark");
else document.documentElement.classList.remove("dark");

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme:       savedTheme,
    role:        savedRole,
    activeTab:   "overview",
    sidebarOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", state.theme === "dark");
      writeStorage(STORAGE_KEYS.THEME, state.theme);
    },
    setRole(state, { payload }) {
      state.role = payload;
      writeStorage(STORAGE_KEYS.ROLE, payload);
    },
    setActiveTab(state, { payload }) {
      state.activeTab   = payload;
      state.sidebarOpen = false;
    },
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar(state)  { state.sidebarOpen = false; },
  },
});

export const { toggleTheme, setRole, setActiveTab, toggleSidebar, closeSidebar } = uiSlice.actions;
export const selectTheme       = s => s.ui.theme;
export const selectRole        = s => s.ui.role;
export const selectActiveTab   = s => s.ui.activeTab;
export const selectSidebarOpen = s => s.ui.sidebarOpen;
export default uiSlice.reducer;
