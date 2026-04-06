import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./slices/transactionsSlice";
import uiReducer           from "./slices/uiSlice";
import filtersReducer      from "./slices/filtersSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    ui:           uiReducer,
    filters:      filtersReducer,
  },
});
