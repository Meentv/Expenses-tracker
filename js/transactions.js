// ============================================================
// transactions.js
// ------------------------------------------------------------
// Responsibility: transaction business logic.
// - Add, edit, delete transactions
// - Find one transaction by id
// - Sort newest first
//
// Works with the array from data.js. Does NOT touch the DOM
// or localStorage directly — main.js coordinates those.
// ============================================================

import { transactions } from "./data.js";

// Create a new transaction object and add it to the array.
// `data` contains title, amount, type, category, date, notes.
// Returns the new transaction (including its generated id).
export function addTransaction(data) {
  const transaction = {
    // Date.now() alone can repeat if two items are added in the
    // same millisecond, so we add a random part to keep ids unique.
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    title: data.title.trim(),
    amount: Number(data.amount),
    type: data.type,
    category: data.category,
    date: data.date,
    notes: data.notes.trim(),
  };
  transactions.push(transaction);
  return transaction;
}

// Find one transaction by its id. Returns the transaction
// object, or undefined if it does not exist.
export function findTransaction(id) {
  const found = transactions.find(function (transaction) {
    return transaction.id === id;
  });
  return found;
}

// Update an existing transaction. Finds it by id and copies
// the new values over the old ones. Returns true if updated.
export function editTransaction(id, data) {
  const transaction = findTransaction(id);
  if (transaction === undefined) {
    return false;
  }
  transaction.title = data.title.trim();
  transaction.amount = Number(data.amount);
  transaction.type = data.type;
  transaction.category = data.category;
  transaction.date = data.date;
  transaction.notes = data.notes.trim();
  return true;
}

// Remove one transaction by id. Returns true if removed.
export function deleteTransaction(id) {
  const index = transactions.findIndex(function (transaction) {
    return transaction.id === id;
  });
  if (index === -1) {
    return false;
  }
  transactions.splice(index, 1);
  return true;
}

// Filter transactions by search text, type, category, date and
// date range. All filters combine (AND): a transaction must
// match every active filter to be shown. Returns a NEW array,
// sorted newest first. "all" or "" means that filter is off.
export function filterTransactions(filters) {
  const sorted = getSortedTransactions();
  const result = sorted.filter(function (transaction) {
    // Search by title (case-insensitive, partial match).
    if (filters.search !== "") {
      const title = transaction.title.toLowerCase();
      const query = filters.search.toLowerCase();
      if (title.includes(query) === false) {
        return false;
      }
    }
    // Filter by type (income / expense).
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }
    // Filter by category.
    if (
      filters.category !== "all" &&
      transaction.category !== filters.category
    ) {
      return false;
    }
    // Filter by one exact date.
    if (filters.date !== "" && transaction.date !== filters.date) {
      return false;
    }
    // Filter by date range (from and to are inclusive).
    // YYYY-MM-DD strings compare correctly with < and >.
    if (filters.from !== "" && transaction.date < filters.from) {
      return false;
    }
    if (filters.to !== "" && transaction.date > filters.to) {
      return false;
    }
    return true;
  });
  return result;
}

// Return a NEW array sorted newest first, so the original
// array order is not changed. Dates are YYYY-MM-DD strings,
// which sort correctly with simple < and > comparisons.
// If two share a date, the later-created one (bigger id) wins.
export function getSortedTransactions() {
  const copy = transactions.slice();
  copy.sort(function (a, b) {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    if (a.id > b.id) {
      return -1;
    }
    return 0;
  });
  return copy;
}
