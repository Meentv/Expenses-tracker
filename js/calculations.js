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

// Monthly income/expense totals for the chart.
// Groups transactions by "YYYY-MM" (first 7 chars of the date),
// then returns the last 6 months in chronological order.
// Each item: { month: "2026-11", income: 0, expense: 0 }
export function getMonthlyTotals(list) {
  const byMonth = {};
  list.forEach(function (transaction) {
    const month = transaction.date.slice(0, 7);
    if (byMonth[month] === undefined) {
      byMonth[month] = { month: month, income: 0, expense: 0 };
    }
    if (transaction.type === "income") {
      byMonth[month].income = byMonth[month].income + transaction.amount;
    } else {
      byMonth[month].expense = byMonth[month].expense + transaction.amount;
    }
  });

  const result = [];
  Object.keys(byMonth).forEach(function (month) {
    result.push(byMonth[month]);
  });

  // Oldest first so the chart reads left to right.
  result.sort(function (a, b) {
    if (a.month < b.month) {
      return -1;
    }
    if (a.month > b.month) {
      return 1;
    }
    return 0;
  });

  // Keep only the most recent 6 months.
  return result.slice(-6);
}

// Expense totals per category for the breakdown chart.
// Each item: { category: "Food", total: 25000 }
// Sorted largest first. Income is ignored.
export function getCategoryTotals(list) {
  const totals = {};
  list.forEach(function (transaction) {
    if (transaction.type === "expense") {
      if (totals[transaction.category] === undefined) {
        totals[transaction.category] = 0;
      }
      totals[transaction.category] =
        totals[transaction.category] + transaction.amount;
    }
  });

  const result = [];
  Object.keys(totals).forEach(function (category) {
    result.push({ category: category, total: totals[category] });
  });

  result.sort(function (a, b) {
    return b.total - a.total;
  });
  return result;
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
