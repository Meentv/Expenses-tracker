// ============================================================
// calculations.js
// ------------------------------------------------------------
// Responsibility: money maths ONLY. No DOM, no storage.
// Each function takes the transactions array and returns
// a number, so the dashboard can never show hardcoded values.
// ============================================================

// Total of all income amounts. Income increases the balance.
export function calculateTotalIncome(list) {
  let total = 0;
  list.forEach(function (transaction) {
    if (transaction.type === "income") {
      total = total + transaction.amount;
    }
  });
  return total;
}

// Total of all expense amounts. Expenses reduce the balance.
export function calculateTotalExpenses(list) {
  let total = 0;
  list.forEach(function (transaction) {
    if (transaction.type === "expense") {
      total = total + transaction.amount;
    }
  });
  return total;
}

// Available balance = income minus expenses.
export function calculateBalance(list) {
  const income = calculateTotalIncome(list);
  const expenses = calculateTotalExpenses(list);
  return income - expenses;
}

// How many transactions exist in total.
export function countTransactions(list) {
  return list.length;
}

// The largest single expense amount. Returns 0 if there are
// no expenses yet (so the card shows 0.00 instead of crashing).
export function findHighestExpense(list) {
  let highest = 0;
  list.forEach(function (transaction) {
    if (transaction.type === "expense") {
      if (transaction.amount > highest) {
        highest = transaction.amount;
      }
    }
  });
  return highest;
}

// The smallest single expense amount. Returns 0 if there are
// no expenses yet.
export function findLowestExpense(list) {
  let lowest = 0;
  let found = false;
  list.forEach(function (transaction) {
    if (transaction.type === "expense") {
      if (found === false) {
        lowest = transaction.amount;
        found = true;
      } else if (transaction.amount < lowest) {
        lowest = transaction.amount;
      }
    }
  });
  return lowest;
}

// Average (mean) of all expense amounts. Returns 0 if there
// are no expenses, to avoid dividing by zero.
export function calculateAverageExpense(list) {
  let total = 0;
  let count = 0;
  list.forEach(function (transaction) {
    if (transaction.type === "expense") {
      total = total + transaction.amount;
      count = count + 1;
    }
  });
  if (count === 0) {
    return 0;
  }
  return total / count;
}
