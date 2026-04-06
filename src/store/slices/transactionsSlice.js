import { createSlice } from "@reduxjs/toolkit";
import { SEED_TRANSACTIONS } from "../../data/mockTransactions";
import { readStorage, writeStorage } from "../../utils/finance";
import { STORAGE_KEYS } from "../../constants";

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: { items: readStorage(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS) },
  reducers: {
    addTransaction(state, { payload }) {
      state.items.unshift({ ...payload, id: Date.now() });
      writeStorage(STORAGE_KEYS.TRANSACTIONS, state.items);
    },
    editTransaction(state, { payload }) {
      const i = state.items.findIndex(t => t.id === payload.id);
      if (i !== -1) { state.items[i] = payload; writeStorage(STORAGE_KEYS.TRANSACTIONS, state.items); }
    },
    deleteTransaction(state, { payload }) {
      state.items = state.items.filter(t => t.id !== payload);
      writeStorage(STORAGE_KEYS.TRANSACTIONS, state.items);
    },
    resetToSeed(state) {
      state.items = SEED_TRANSACTIONS;
      writeStorage(STORAGE_KEYS.TRANSACTIONS, state.items);
    },
  },
});

export const { addTransaction, editTransaction, deleteTransaction, resetToSeed } = transactionsSlice.actions;
export const selectAllTransactions = s => s.transactions.items;
export default transactionsSlice.reducer;
