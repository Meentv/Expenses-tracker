// ============================================================
// storage.js
// ------------------------------------------------------------
// Responsibility: talk to browser localStorage.
// - saveTransactions(): array -> JSON string -> localStorage
// - loadTransactions(): localStorage -> JSON -> array
//
// Handles empty storage and corrupted data safely.
// ============================================================

import { transactions, STORAGE_KEY } from "./data.js";

// Save the current transactions array to localStorage.
// JSON.stringify turns the array into a text string,
// because localStorage can only store text.
export function saveTransactions() {
  try {
    const text = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEY, text);
  } catch (error) {
    // Storage can fail (e.g. browser storage is full or blocked).
    // We log it instead of crashing the whole app.
    console.error("Could not save transactions:", error);
  }
}

// Load transactions from localStorage into the shared array.
// Safe cases:
// - Nothing stored yet  -> keep the empty array.
// - Stored text is broken -> catch the error, keep empty array.
export function loadTransactions() {
  try {
    const text = localStorage.getItem(STORAGE_KEY);

    // Empty storage: nothing to load.
    if (text === null) {
      return;
    }

    // JSON.parse turns the text back into an array.
    // If the text is corrupted, this line throws and the
    // catch block below handles it.
    const parsed = JSON.parse(text);

    // Only accept an array. Anything else means bad data.
    if (Array.isArray(parsed) === false) {
      return;
    }

    // Copy the loaded items into our shared array.
    // (We push item by item so the imported array stays the same.)
    transactions.length = 0;
    parsed.forEach(function (transaction) {
      transactions.push(transaction);
    });
  } catch (error) {
    console.error("Could not load transactions:", error);
    transactions.length = 0;
  }
}
