// ============================================================
// data.js
// ------------------------------------------------------------
// Responsibility: hold the shared data every module needs.
// - The transactions array (all income + expense records)
// - The fixed category list
// - The localStorage key name
//
// No logic here — just shared variables.
// ============================================================

// The key name used in localStorage. Keeping it in one place
// means storage.js and main.js always use the same name.
export const STORAGE_KEY = "expenseTrackerTransactions";

// All transactions live in ONE array. Every other module
// imports this same array, so there is only one copy of the data.
// We use `const` (the array itself never gets replaced, only
// items are added/removed inside it).
export const transactions = [];

// Fixed list of categories. The dropdowns in index.html use
// these same values, and validation.js checks against them.
export const categories = [
  "Salary",
  "Freelance",
  "Business",
  "Gift",
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Other",
];
