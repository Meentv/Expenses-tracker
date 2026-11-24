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
  getMonthlyTotals,
  getCategoryTotals,
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
// If `type` is "income" or "expense", that radio is pre-selected
// (used by the quick-action buttons). Otherwise none is selected.
export function openAddModal(type) {
  document.getElementById("modalTitle").textContent = "Add Transaction";
  document.getElementById("saveTransactionBtn").textContent =
    "Save Transaction";
  const radios = document.querySelectorAll('input[name="type"]');
  radios.forEach(function (radio) {
    radio.checked = radio.value === type;
  });
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

// Month names for chart labels ("2026-11" -> "Nov 2026").
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Draw both charts from real transaction data.
// Shows an empty state instead of fake numbers when there
// is no data yet.
export function renderCharts() {
  renderMonthlyChart();
  renderCategoryChart();
}

// Income vs expenses bars, one column per month.
function renderMonthlyChart() {
  const chart = document.getElementById("monthlyChart");
  const empty = document.getElementById("monthlyEmpty");
  chart.textContent = "";

  const months = getMonthlyTotals(transactions);
  if (months.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  // Find the largest value so bar heights are proportional.
  let max = 0;
  months.forEach(function (item) {
    if (item.income > max) {
      max = item.income;
    }
    if (item.expense > max) {
      max = item.expense;
    }
  });

  months.forEach(function (item) {
    const col = document.createElement("div");
    col.className = "month-col";

    const bars = document.createElement("div");
    bars.className = "month-bars";

    const incomeBar = document.createElement("div");
    incomeBar.className = "bar bar-income";
    incomeBar.style.height = Math.round((item.income / max) * 100) + "%";
    incomeBar.title = "Income: " + formatAmount(item.income);

    const expenseBar = document.createElement("div");
    expenseBar.className = "bar bar-expense";
    expenseBar.style.height = Math.round((item.expense / max) * 100) + "%";
    expenseBar.title = "Expenses: " + formatAmount(item.expense);

    bars.appendChild(incomeBar);
    bars.appendChild(expenseBar);

    const label = document.createElement("span");
    label.className = "month-label";
    const parts = item.month.split("-");
    const monthIndex = Number(parts[1]) - 1;
    label.textContent = MONTH_NAMES[monthIndex] + " " + parts[0];

    col.appendChild(bars);
    col.appendChild(label);
    chart.appendChild(col);
  });
}

// Expense totals per category, largest first, as bars.
function renderCategoryChart() {
  const chart = document.getElementById("categoryChart");
  const empty = document.getElementById("categoryEmpty");
  chart.textContent = "";

  const categories = getCategoryTotals(transactions);
  if (categories.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const max = categories[0].total;

  categories.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "category-row";

    const name = document.createElement("span");
    name.className = "category-name";
    name.textContent = item.category;

    const track = document.createElement("div");
    track.className = "category-track";
    const fill = document.createElement("div");
    fill.className = "category-fill";
    fill.style.width = Math.round((item.total / max) * 100) + "%";
    track.appendChild(fill);

    const amount = document.createElement("span");
    amount.className = "category-amount";
    amount.textContent = formatAmount(item.total);

    row.appendChild(name);
    row.appendChild(track);
    row.appendChild(amount);
    chart.appendChild(row);
  });
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
