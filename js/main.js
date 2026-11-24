// ============================================================
// main.js
// ------------------------------------------------------------
// Responsibility: START the app and connect everything.
// - Loads saved transactions from localStorage
// - Attaches event listeners (clicks, form submit)
// - Calls the right module for each action
//
// This is the ONLY file loaded by index.html.
// It imports the other modules below.
// ============================================================

import { transactions } from "./data.js";
import { loadTransactions, saveTransactions } from "./storage.js";
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
  findTransaction,
  filterTransactions,
} from "./transactions.js";
import { validateTransaction } from "./validation.js";
import {
  renderDashboard,
  renderTransactions,
  renderCharts,
  renderRecent,
  openAddModal,
  openEditModal,
  closeModal,
  clearForm,
  showFormErrors,
  clearFormErrors,
  showMessage,
  showRatesLoading,
  showRates,
  showRatesError,
} from "./ui.js";
import { fetchExchangeRates } from "./api.js";

// Read the current form values into a plain object.
function readFormData() {
  const typeRadio = document.querySelector('input[name="type"]:checked');
  const data = {
    title: document.getElementById("titleInput").value,
    amount: document.getElementById("amountInput").value,
    type: typeRadio === null ? "" : typeRadio.value,
    category: document.getElementById("categorySelect").value,
    date: document.getElementById("dateInput").value,
    notes: document.getElementById("notesInput").value,
  };
  return data;
}

// Read the current filter values from the filter bar.
function readFilters() {
  const filters = {
    search: document.getElementById("searchInput").value.trim(),
    type: document.getElementById("filterType").value,
    category: document.getElementById("filterCategory").value,
    date: document.getElementById("filterDate").value,
    from: document.getElementById("filterFrom").value,
    to: document.getElementById("filterTo").value,
  };
  return filters;
}

// Re-draw the table using the current filters.
// The dashboard always shows totals from ALL transactions,
// only the table list is filtered.
function applyFilters() {
  const filters = readFilters();
  const filtered = filterTransactions(filters);

  // Pick the right empty-state message.
  let emptyMessage;
  if (transactions.length === 0) {
    emptyMessage =
      "No transactions yet. Click “Add Transaction” to record your first income or expense.";
  } else {
    emptyMessage =
      "No transactions match your filters. Try changing or clearing them.";
  }

  renderTransactions(filtered, emptyMessage);
}

// Re-draw the dashboard, charts, recent list, and table.
function refreshScreen() {
  renderDashboard();
  renderCharts();
  renderRecent();
  applyFilters();
}

// Handle the form submit: validate, then add or edit.
function handleFormSubmit(event) {
  // Stop the browser from reloading the page.
  event.preventDefault();

  const data = readFormData();
  const errors = validateTransaction(data);

  // Invalid data: show messages and save nothing.
  if (errors.length > 0) {
    showFormErrors(errors);
    return;
  }
  clearFormErrors();

  const editingId = document.getElementById("editingId").value;

  if (editingId === "") {
    // Adding a new transaction.
    addTransaction(data);
    showMessage("Transaction added.");
  } else {
    // Editing an existing transaction.
    editTransaction(editingId, data);
    showMessage("Transaction updated.");
  }

  // Persist, re-draw, and close the modal.
  saveTransactions();
  refreshScreen();
  closeModal();
  clearForm();
}

// Handle clicks on Edit/Delete buttons inside the table.
// One listener on the table body covers all rows, including
// rows added later (this is called "event delegation").
function handleTableClick(event) {
  const button = event.target;
  if (button.dataset.action === undefined) {
    return;
  }
  const id = button.dataset.id;

  if (button.dataset.action === "edit") {
    const transaction = findTransaction(id);
    if (transaction !== undefined) {
      openEditModal(transaction);
    }
  }

  if (button.dataset.action === "delete") {
    const confirmed = confirm("Delete this transaction?");
    if (confirmed) {
      deleteTransaction(id);
      saveTransactions();
      refreshScreen();
      showMessage("Transaction deleted.");
    }
  }
}

// Load exchange rates and draw them in the panel.
// If the API fails, only the rates panel shows a fallback —
// the tracker itself is unaffected.
async function loadRates() {
  showRatesLoading();
  try {
    const rates = await fetchExchangeRates();
    showRates(rates);
  } catch (error) {
    console.error("Could not load exchange rates:", error);
    showRatesError();
  }
}

// Show today's date in the top bar (e.g. "Monday, 24 November 2026").
function showToday() {
  const today = new Date();
  const text = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("todayDate").textContent = text;
}

// Start the app: load data, draw the screen, wire up events.
function init() {
  loadTransactions();
  refreshScreen();
  loadRates();
  showToday();

  document
    .getElementById("addTransactionBtn")
    .addEventListener("click", function () {
      clearForm();
      openAddModal();
    });

  document
    .getElementById("cancelModalBtn")
    .addEventListener("click", function () {
      closeModal();
      clearForm();
    });

  document
    .getElementById("transactionForm")
    .addEventListener("submit", handleFormSubmit);

  document
    .getElementById("transactionTableBody")
    .addEventListener("click", handleTableClick);

  // Search & filter events: re-draw the table as the user types
  // or changes a filter. "input" fires on every keystroke,
  // "change" fires when a dropdown or date picker changes.
  document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);
  document
    .getElementById("filterType")
    .addEventListener("change", applyFilters);
  document
    .getElementById("filterCategory")
    .addEventListener("change", applyFilters);
  document
    .getElementById("filterDate")
    .addEventListener("change", applyFilters);
  document
    .getElementById("filterFrom")
    .addEventListener("change", applyFilters);
  document
    .getElementById("filterTo")
    .addEventListener("change", applyFilters);

  // Clear all filters back to their defaults.
  document
    .getElementById("clearFiltersBtn")
    .addEventListener("click", function () {
      document.getElementById("filterForm").reset();
      applyFilters();
    });

  // Quick actions: open the modal with the type pre-selected.
  document
    .getElementById("addIncomeBtn")
    .addEventListener("click", function () {
      clearForm();
      openAddModal("income");
    });
  document
    .getElementById("addExpenseBtn")
    .addEventListener("click", function () {
      clearForm();
      openAddModal("expense");
    });
  document
    .getElementById("topAddBtn")
    .addEventListener("click", function () {
      clearForm();
      openAddModal();
    });

  // Close (X) button in the modal header.
  document
    .getElementById("closeModalBtn")
    .addEventListener("click", function () {
      closeModal();
      clearForm();
    });

  // Sidebar Income / Expenses: apply that type filter and
  // scroll to the transactions table.
  const navFilterButtons = document.querySelectorAll("[data-nav-filter]");
  navFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      document.getElementById("filterType").value =
        button.dataset.navFilter;
      applyFilters();
      document
        .getElementById("transactions")
        .scrollIntoView({ behavior: "smooth" });
      document.getElementById("sidebar").classList.remove("open");
    });
  });

  // Mobile menu toggle (sidebar drawer).
  document
    .getElementById("menuBtn")
    .addEventListener("click", function () {
      document.getElementById("sidebar").classList.toggle("open");
    });

  // Settings: clear all transactions (with confirmation).
  document
    .getElementById("clearAllBtn")
    .addEventListener("click", function () {
      const confirmed = confirm(
        "Delete ALL transactions? This cannot be undone."
      );
      if (confirmed) {
        transactions.length = 0;
        saveTransactions();
        refreshScreen();
        showMessage("All transactions cleared.");
      }
    });
}

// Run init() when the page has loaded.
init();
