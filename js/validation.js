// ============================================================
// validation.js
// ------------------------------------------------------------
// Responsibility: check a form submission BEFORE saving.
// - Title not empty
// - Amount is a number greater than 0
// - Type is "income" or "expense"
// - Category selected
// - Date is valid
// - Notes optional
//
// Returns a list of error messages (empty list = valid).
// ============================================================

import { categories } from "./data.js";

// Check one transaction object. Returns an array of error
// message strings. If the array is empty, the data is valid.
export function validateTransaction(data) {
  const errors = [];

  // Title: required, must not be empty or only spaces.
  if (typeof data.title !== "string" || data.title.trim() === "") {
    errors.push("Title is required.");
  }

  // Amount: must be a number greater than 0.
  // Number("abc") gives NaN, so we check for that too.
  const amount = Number(data.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push("Amount must be a number greater than 0.");
  }

  // Type: must be exactly "income" or "expense".
  if (data.type !== "income" && data.type !== "expense") {
    errors.push("Please choose Income or Expense.");
  }

  // Category: must be one of the fixed list.
  if (categories.includes(data.category) === false) {
    errors.push("Please select a valid category.");
  }

  // Date: must be a real date in YYYY-MM-DD form.
  // new Date("not-a-date") gives an "Invalid Date".
  const date = new Date(data.date);
  if (data.date === "" || isNaN(date.getTime())) {
    errors.push("Please enter a valid date.");
  }

  // Notes: optional, so no check needed.

  return errors;
}
