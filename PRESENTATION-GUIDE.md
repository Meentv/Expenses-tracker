# Presentation Guide — Personal Finance & Expense Tracker

> Simple English, as if the student is presenting their own work.
> Read the bold parts aloud; use the rest as backup if the instructor asks questions.

---

## 1. Introduction to the project

**"Good morning. My project is a Personal Finance and Expense Tracker. It helps a user record income and expenses, organise them by category, search and filter their history, and see their financial balance update automatically. Everything is saved in the browser, so the data is still there after refreshing the page."**

## 2. Why I chose the project

**"I chose this project because it uses real JavaScript skills: working with arrays and objects, calculating totals, handling forms, saving data, and calling an API. It is a practical project that shows how JavaScript connects the page, the data, and the browser storage."**

## 3. Technologies used

**"I used HTML5 for structure, CSS3 for styling and responsive layout, and Vanilla JavaScript with ES Modules for all the logic. I used the browser's localStorage to save data, and the Fetch API to get live exchange rates. I did not use React or any framework, because the assignment requires Vanilla JavaScript."**

## 4. Explanation of the folder structure

**"The project has three main parts. `index.html` holds the page structure. `css/style.css` holds all the styling. The `js` folder holds eight small files, and each file has one job: `data.js` holds the shared data, `calculations.js` does the maths, `storage.js` talks to localStorage, `validation.js` checks the form, `transactions.js` handles add, edit, delete and filtering, `ui.js` draws on the screen, `api.js` fetches exchange rates, and `main.js` connects everything together."**

## 5. Explanation of the HTML structure

**"The page has a sidebar with navigation and an Add Transaction button. The main part has three sections: Dashboard with seven summary cards, Transactions with a filter bar and a table, and Exchange Rates. There is also a modal form for adding and editing, and a footer. Every element JavaScript needs has a unique `id`, so JavaScript can find it with `getElementById`. Labels are connected to inputs with `for` and `id` for accessibility."**

## 6. Explanation of the CSS

**"I used CSS variables so colours are defined once. I used Flexbox for the sidebar and main layout and for the filter bar, and CSS Grid for the seven summary cards. The layout is responsive: on tablet the sidebar becomes a top bar, and on mobile the cards stack into one column. I used media queries for that, and hover and focus states for buttons."**

## 7. Explanation of the JavaScript

**"JavaScript is split into ES Modules. Each file exports its functions and `main.js` imports them. The data is one array of transaction objects in `data.js`. When the user submits the form, `main.js` validates the data, adds it to the array, saves it to localStorage, calculates new totals, and re-renders the screen. The table uses event delegation, so one listener handles all Edit and Delete buttons."**

## 8. How adding income and expenses works

**"The user clicks Add Transaction. The modal opens. The user enters title, amount, type, category, date, and optional notes. On submit, `validation.js` checks everything. If there are errors, they are shown and nothing is saved. If it is valid, `transactions.js` creates an object with a unique id and adds it to the array. Then the app saves and re-draws."**

## 9. How financial calculations work

**"All seven figures are calculated from the transaction array every time the screen updates. Nothing is hardcoded. Income total adds amounts where type is income. Expense total adds where type is expense. Balance is income minus expenses. Highest, lowest, and average only look at expenses. If there are no expenses, they return zero, so the app never divides by zero."**

## 10. How localStorage works

**"localStorage is browser storage that survives a refresh. I save with `JSON.stringify` to turn the array into text, and load with `JSON.parse` to turn it back. Loading is inside `try/catch`, so if storage is empty or corrupted, the app starts with an empty list instead of crashing. Every add, edit, and delete saves immediately."**

## 11. How search and filtering work

**"There are six filters: search by title, type, category, exact date, and from/to range. They combine with AND logic using `filter()` — a transaction must pass every active filter. Search is case-insensitive. The search box uses the `input` event for live results. The dashboard always shows totals for all transactions; only the table is filtered. Clear Filters resets everything."**

## 12. How the API integration works

**"The Exchange Rates panel calls the Open ER-API with `fetch()` and `async/await`. It shows USD to NGN, GBP, and EUR. There are two error cases: HTTP errors, which I check with `response.ok`, and network errors, which `try/catch` catches. On failure, the panel shows a fallback message, and the tracker still works. No API key is needed, so nothing secret is in the code."**

## 13. Testing performed

**"I tested the logic with Node.js: calculations with normal and edge cases like empty lists and decimals, validation with invalid inputs, localStorage with corrupted data, filtering with combined filters, and the API with mocked responses. All checks passed. The full browser checklist is in `TESTING.md`."**

## 14. Challenges encountered

**"Two real challenges: first, transaction ids collided when items were added in the same millisecond, so editing updated the wrong record — I fixed it by adding a random part to the id. Second, my first API choice, Frankfurter, no longer returns NGN, so I verified the live response and switched to Open ER-API. Both are documented in my AI Learning Journal."**

## 15. Conclusion

**"In conclusion, the app meets all the assignment requirements: dashboard summaries, transaction management, calculations, search and filtering, validation, localStorage, and API integration — all in Vanilla JavaScript. Thank you. I am happy to answer questions."**

---

## Likely instructor questions & simple answers

**Q: Why is amount always positive?**
A: The `type` field decides if it adds or subtracts. That keeps the maths simple and prevents negative-amount confusion.

**Q: Why ES Modules? Why not one big JS file?**
A: The assignment requires modules, and one job per file makes the code easier to read, test, and explain.

**Q: How do you prevent hardcoded totals?**
A: `renderDashboard()` calls the 7 calculation functions on the live array every time. Change a transaction and the cards recalculate.

**Q: What happens if localStorage has bad data?**
A: `loadTransactions()` catches the parse error and starts with an empty array. The app does not crash.

**Q: Why does `fetch()` need `response.ok` check?**
A: `fetch()` only throws on network failure, not on HTTP 500. Without the check, a 500 page would be parsed as if it were data.

**Q: How does sorting work with dates?**
A: Dates are `YYYY-MM-DD` strings, so text comparison (`<`, `>`) gives chronological order. Newest first, with id as tie-breaker.

**Q: Why `textContent` instead of `innerHTML`?**
A: `textContent` treats user input as plain text, so a title like `<script>` can never inject HTML. Safer.

**Q: What is event delegation?**
A: One listener on the table body handles all row buttons via `data-action`/`data-id`, instead of adding a listener to every button.

**Q: How do you handle the API being down?**
A: Only the rates panel shows a fallback message. Transactions, calculations, and storage never depend on the API.

**Q: What would you improve with more time?**
A: Charts, currency conversion of amounts (not just rates display), and export to CSV. None were required, so I prioritised correctness first.
