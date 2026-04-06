import { EXPENSE_CATEGORIES } from "../constants";

// Deterministic seeded RNG (mulberry32)
function mkRng(seed) {
  let s = seed;
  return () => { s|=0; s=(s+0x6d2b79f5)|0; let t=Math.imul(s^(s>>>15),1|s); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; };
}
const rng  = mkRng(20260331);
const rand = (lo, hi) => Math.floor(rng() * (hi - lo + 1)) + lo;

const RANGES = {
  "Food & Dining":  [200,   1500],
  "Transport":      [100,    800],
  "Shopping":       [500,   5000],
  "Entertainment":  [200,   1500],
  "Healthcare":     [500,   3000],
  "Utilities":      [800,   3500],
  "Travel":         [2000, 15000],
};

const NOTES = {
  "Food & Dining":  ["Zomato order","Swiggy delivery","Restaurant dinner","Grocery – BigBasket","Tea & snacks"],
  "Transport":      ["Ola / Uber","Metro card recharge","Petrol / fuel","Auto rickshaw","Parking fee"],
  "Shopping":       ["Amazon order","Flipkart purchase","Clothing – Myntra","Electronics","Home supplies"],
  "Entertainment":  ["Netflix subscription","Movie – PVR","Spotify Premium","Gaming top-up","BookMyShow"],
  "Healthcare":     ["Doctor consultation","Apollo Pharmacy","Gym membership","Dental checkup","Diagnostic test"],
  "Utilities":      ["Electricity bill","Jio broadband","Water & maintenance","Gas cylinder","Society charges"],
  "Travel":         ["IndiGo flight","Hotel booking","Oyo stay","Travel insurance","Cab – airport"],
};

export function generateMockTransactions() {
  const list = []; let id = 1;
  for (let m = 0; m < 6; m++) {
    const d     = new Date(2026, 2 - m, 1);
    const yr    = d.getFullYear();
    const mo    = d.getMonth();
    const ds    = (day) => `${yr}-${String(mo+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    // Salary
    list.push({ id: id++, date: ds(1), amount: rand(55000, 90000), category: "Salary", type: "income", note: "Monthly salary – credited" });
    // Freelance (60%)
    if (rng() > 0.4) list.push({ id: id++, date: ds(rand(5,20)), amount: rand(8000, 35000), category: "Freelance", type: "income", note: "Freelance project payment" });
    // Investment (50%)
    if (rng() > 0.5) list.push({ id: id++, date: ds(rand(10,25)), amount: rand(1000, 8000), category: "Investment", type: "income", note: "Dividend / MF return" });
    // Expenses
    for (let e = 0, count = rand(8, 15); e < count; e++) {
      const cat  = EXPENSE_CATEGORIES[rand(0, EXPENSE_CATEGORIES.length - 1)];
      const [lo, hi] = RANGES[cat];
      const notes    = NOTES[cat];
      list.push({ id: id++, date: ds(rand(1,28)), amount: rand(lo, hi), category: cat, type: "expense", note: notes[rand(0, notes.length-1)] });
    }
  }
  return list.sort((a,b) => b.date.localeCompare(a.date));
}

export const SEED_TRANSACTIONS = generateMockTransactions();
