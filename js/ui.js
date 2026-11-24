// ============================================================
// ui.js
// ------------------------------------------------------------
// Responsibility: draw everything on screen (DOM only).
// - Render the 7 summary cards
// - Render the transaction table + empty state
// - Open/close the modal, show messages and errors
//
// No maths, no storage — just displaying what it is given.
// ============================================================

import { transactions } from "./data.js";
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  countTransactions,
  findHighestExpense,
  findLowestExpense,
  calculateAverageExpense,
} from "./calculations.js";

// Format a number for display: 2 decimal places with thousand
// separators so large amounts are easy to read.
// Example: 50000 -> "50,000.00"
export function formatAmount(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Update the 7 dashboard cards from the current transactions.
export function renderDashboard() {
  document.getElementById("totalIncome").textContent = formatAmount(
    calculateTotalIncome(transactions)
  );
  document.getElementById("totalExpenses").textContent = formatAmount(
    calculateTotalExpenses(transactions)
  );
  document.getElementById("availableBalance").textContent = formatAmount(
    calculateBalance(transactions)
  );
  document.getElementById("totalTransactions").textContent =
    countTransactions(transactions);
  document.getElementById("highestExpense").textContent = formatAmount(
    findHighestExpense(transactions)
  );
  document.getElementById("lowestExpense").textContent = formatAmount(
    findLowestExpense(transactions)
  );
  document.getElementById("averageExpense").textContent = formatAmount(
    calculateAverageExpense(transactions)
  );
}

// Draw the transaction rows into the table.
// `list` is the (already sorted/filtered) array to display.
// `emptyMessage` is shown when the list is empty.
export function renderTransactions(list, emptyMessage) {
  const tbody = document.getElementById("transactionTableBody");

  // Clear old rows first.
  tbody.textContent = "";

  if (list.length === 0) {
    // Different message when filters hide everything vs when
    // there are no transactions at all. main.js passes the text.
    showEmptyState(emptyMessage);
    return;
  }
  hideEmptyState();

  list.forEach(function (transaction) {
    const row = document.createElement("tr");

    // Title
    const titleCell = document.createElement("td");
    titleCell.textContent = transaction.title;
    row.appendChild(titleCell);

    // Category
    const categoryCell = document.createElement("td");
    categoryCell.textContent = transaction.category;
    row.appendChild(categoryCell);

    // Date
    const dateCell = document.createElement("td");
    dateCell.textContent = transaction.date;
    row.appendChild(dateCell);

    // Amount: green with + for income, red with - for expense.
    const amountCell = document.createElement("td");
    if (transaction.type === "income") {
      amountCell.textContent = "+" + formatAmount(transaction.amount);
      amountCell.className = "amount-income";
    } else {
      amountCell.textContent = "-" + formatAmount(transaction.amount);
      amountCell.className = "amount-expense";
    }
    row.appendChild(amountCell);

    // Notes
    const notesCell = document.createElement("td");
    notesCell.textContent = transaction.notes;
    row.appendChild(notesCell);

    // Actions: Edit and Delete buttons. The data attributes
    // tell main.js which transaction was clicked.
    const actionsCell = document.createElement("td");
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "row-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.dataset.action = "edit";
    editButton.dataset.id = transaction.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = transaction.id;

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    actionsCell.appendChild(actionsDiv);
    row.appendChild(actionsCell);

    tbody.appendChild(row);
  });
}

// Show the empty-state message (no transactions to display).
// If a message is given, it replaces the default text.
export function showEmptyState(message) {
  if (message !== undefined) {
    document.getElementById("emptyStateText").textContent = message;
  }
  document.getElementById("emptyState").hidden = false;
}

// Hide the empty-state message.
export function hideEmptyState() {
  document.getElementById("emptyState").hidden = true;
}

// Open the modal for adding a new transaction.
export function openAddModal() {
  document.getElementById("modalTitle").textContent = "Add Transaction";
  document.getElementById("saveTransactionBtn").textContent =
    "Save Transaction";
  document.getElementById("transactionModal").hidden = false;
}

// Open the modal pre-filled for editing one transaction.
export function openEditModal(transaction) {
  document.getElementById("modalTitle").textContent = "Edit Transaction";
  document.getElementById("saveTransactionBtn").textContent =
    "Save Changes";
  document.getElementById("editingId").value = transaction.id;
  document.getElementById("titleInput").value = transaction.title;
  document.getElementById("amountInput").value = transaction.amount;
  document.getElementById("categorySelect").value = transaction.category;
  document.getElementById("dateInput").value = transaction.date;
  document.getElementById("notesInput").value = transaction.notes;

  // Check the correct radio button for the type.
  const radios = document.querySelectorAll('input[name="type"]');
  radios.forEach(function (radio) {
    radio.checked = radio.value === transaction.type;
  });

  document.getElementById("transactionModal").hidden = false;
}

// Close the modal.
export function closeModal() {
  document.getElementById("transactionModal").hidden = true;
}

// Reset the form to empty for the next use.
export function clearForm() {
  document.getElementById("transactionForm").reset();
  document.getElementById("editingId").value = "";
  clearFormErrors();
}

// Show validation errors inside the modal as a bullet list.
export function showFormErrors(errors) {
  const box = document.getElementById("formErrors");
  box.textContent = "";
  const list = document.createElement("ul");
  errors.forEach(function (message) {
    const item = document.createElement("li");
    item.textContent = message;
    list.appendChild(item);
  });
  box.appendChild(list);
  box.hidden = false;
}

// Hide the validation error box.
export function clearFormErrors() {
  const box = document.getElementById("formErrors");
  box.textContent = "";
  box.hidden = true;
}

// Show the "Loading rates…" state in the exchange panel.
export function showRatesLoading() {
  document.getElementById("ratesLoading").hidden = false;
  document.getElementById("ratesContent").hidden = true;
  document.getElementById("ratesError").hidden = true;
}

// Show fetched rates in the exchange panel.
export function showRates(rates) {
  document.getElementById("rateNGN").textContent = formatAmount(rates.NGN);
  document.getElementById("rateGBP").textContent = formatAmount(rates.GBP);
  document.getElementById("rateEUR").textContent = formatAmount(rates.EUR);
  document.getElementById("ratesUpdated").textContent =
    "Last updated: " + rates.updated;
  document.getElementById("ratesLoading").hidden = true;
  document.getElementById("ratesError").hidden = true;
  document.getElementById("ratesContent").hidden = false;
}

// Show the fallback message when rates cannot be loaded.
export function showRatesError() {
  document.getElementById("ratesLoading").hidden = true;
  document.getElementById("ratesContent").hidden = true;
  document.getElementById("ratesError").hidden = false;
}

// Show a short toast message (e.g. "Transaction saved").
// It disappears automatically after 3 seconds.
export function showMessage(text) {
  const box = document.getElementById("messageBox");
  box.textContent = text;
  box.hidden = false;
  setTimeout(function () {
    box.hidden = true;
  }, 3000);
}
