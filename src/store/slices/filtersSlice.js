import { createSlice } from "@reduxjs/toolkit";

const initial = { search: "", type: "all", category: "all", month: "all", sortBy: "date", sortDir: "desc", page: 1 };

const filtersSlice = createSlice({
  name: "filters",
  initialState: initial,
  reducers: {
    setFilter(state, { payload }) {
      Object.assign(state, payload);
      if (!("page" in payload)) state.page = 1;
    },
    toggleSort(state, { payload }) {
      if (state.sortBy === payload) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      else { state.sortBy = payload; state.sortDir = "desc"; }
      state.page = 1;
    },
    resetFilters(state) { Object.assign(state, initial); },
  },
});

export const { setFilter, toggleSort, resetFilters } = filtersSlice.actions;
export const selectFilters = s => s.filters;
export default filtersSlice.reducer;
