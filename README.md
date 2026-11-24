# Personal Finance & Expense Tracker

A modern Personal Finance & Expense Tracker built with **HTML5, CSS3, and Vanilla JavaScript (ES Modules)**. Record income and expenses, organise them by category, search and filter your history, and watch your balance update automatically — all saved in your browser with localStorage, plus live exchange rates from a free public API.

Built for the **Craft Innovation Hub JavaScript Practical Assignment**.

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure (dashboard, forms, table) |
| CSS3 | Styling, layout (Flexbox + Grid), responsive design |
| Vanilla JavaScript (ES Modules) | All application logic — no frameworks, no libraries |
| Browser localStorage | Save transactions so they survive a refresh |
| Fetch API + Open ER-API | Live USD exchange rates (NGN, GBP, EUR), no API key |
| VS Code + local server | Development (Live Server or `python -m http.server`) |

No React, no TypeScript, no backend — exactly as the assignment requires.

---

## Features

- **Dashboard:** total balance, total income, total expenses, transaction count, highest/lowest/average expense, recent transactions (newest first). All figures are calculated from real records — nothing is hardcoded.
- **Analytics charts (real data, no library):** Income vs Expenses monthly bars (last 6 months) and Expense Breakdown by Category bars, with empty states when there is no data. Recent Transactions cell shows the last 5 records.
- **Quick actions:** Add Income / Add Expense buttons that open the form with the type pre-selected; sidebar Income/Expenses links apply the matching filter.
- **Transactions:** add, edit, and delete income/expense records with title, amount, type, category, date, and optional notes.
- **Search & filtering:** by title, type, category, exact date, and date range — filters combine, with a Clear Filters button.
- **Form validation:** empty titles, non-positive amounts, missing type/category, and invalid dates are rejected with clear messages.
- **Persistence:** everything is saved to localStorage and restored on refresh; empty or corrupted storage is handled safely.
- **Exchange rates:** live rates via `fetch()` with loading state, HTTP/network error handling, and a fallback message. The tracker works even if the API is down.
- **Responsive:** works on desktop, tablet, and mobile.

---

## Folder Structure

```
expense-tracker/
├── index.html                  ← page structure (all sections)
├── css/
│   └── style.css               ← all styling + responsive rules
├── js/
│   ├── main.js                 ← starts the app, wires up events
│   ├── data.js                 ← shared state (transactions array, categories)
│   ├── transactions.js         ← add / edit / delete / search / filter / sort
│   ├── calculations.js         ← the 7 money maths functions
│   ├── ui.js                   ← renders cards, table, modal, messages
│   ├── storage.js              ← localStorage save / load
│   ├── validation.js           ← form checking rules
│   ├── api.js                  ← fetch() exchange rates
├── README.md                   ← this file
├── AI-LEARNING-JOURNAL.md      ← honest record of AI help & learning
├── TESTING.md                  ← real test results
├── PRESENTATION-GUIDE.md       ← talk track + likely Q&A
└── IMPLEMENTATION-PLAN.md      ← Stage 1 plan
```

Each JS file has one responsibility. `index.html` loads only `main.js` (`type="module"`), which imports the rest.

---

## How to Run

> **Important:** open the app through a local server, not by double-clicking `index.html`. Browsers block ES Module imports and some fetches from `file://` for security.

**Option A — VS Code Live Server (easiest):**
1. Open this folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".

**Option B — Python (no install needed if Python is present):**
```bash
cd expense-tracker
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option C — Node.js:**
```bash
npx serve .
```

No build step, no `npm install`, no API key. Just serve the folder.

---

## HTML Tag Explanation (every tag actually used)

Each entry says: what the tag means, what it does, why it is used in this project, and where it appears. Tags are listed in the order they appear in `index.html`.

### Document setup

- **`<!DOCTYPE html>`** — Tells the browser the document uses HTML5. Must be the very first line. Used at the top of `index.html`.
- **`<html lang="en">`** — The root element wrapping the whole page. `lang="en"` tells browsers/screen readers the language is English. Wraps everything in `index.html`.
- **`<head>`** — Contains page information (not visible content): character encoding, title, and the CSS link. At the top of `index.html`.
- **`<meta charset="UTF-8">`** — Declares the character encoding so symbols like 💰 and ₦ display correctly. In `<head>`.
- **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`** — Makes the page scale correctly on phones (essential for responsive design). In `<head>`.
- **`<title>`** — Sets the browser tab title: "Personal Finance & Expense Tracker". In `<head>`.
- **`<link rel="stylesheet" href="css/style.css">`** — Connects the external CSS file. In `<head>`. `rel` says *what kind* of resource, `href` says *where*.

### Page structure

- **`<body>`** — Contains all visible page content. Everything from the sidebar to the footer sits inside it.
- **`<aside class="sidebar">`** — Side content: brand/logo, navigation, Add Transaction button. Fixed on desktop; becomes an off-canvas drawer on mobile (toggled by the menu button).
- **`<header class="topbar">`** — The top bar: mobile menu button, page title ("Dashboard"), today's date, Add button. Sticky at the top of the content area.
- **`<h1>`** — The main page heading ("Dashboard" in the top bar). Only one `<h1>` per page — the most important heading.
- **`<nav>`** — Contains navigation links/buttons. Used for Dashboard, Transactions, Income, Expenses, Categories, Exchange Rates, Settings. `aria-label="Main navigation"` helps screen readers.
- **`<main>`** — Holds the main content (overview, analytics, transactions, rates, settings). One `<main>` per page; helps accessibility and SEO.
- **`<section>`** — Groups related content with a heading. Used 5 times: `#dashboard`, `#analytics`, `#transactions`, `#exchange-rates`, `#settings`.
- **`<article>`** — A self-contained piece of content. Used 7 times for the summary cards (3 overview + 4 stats; each card stands alone).
- **`<div>`** — A generic container for layout/styling. Used for the cards grid, filter groups, table wrapper, modal, and message box.
- **`<footer>`** — The bottom section with the credit line. At the end of `index.html`.

### Headings and text

- **`<h2>`** — Section headings ("Dashboard", "Transactions", "Exchange Rates", modal title). Second-level headings under `<h1>`.
- **`<h3>`** — Card headings ("Total Income", etc.). Third level, inside each `<article>`.
- **`<p>`** — A paragraph of text. Used for the tagline, section notes, empty state, rates states, and footer.
- **`<span>`** — Inline text container (no line break). Used in the rates list to label each currency.
- **`<strong>`** — Bold text. Used for the rate values (`<strong id="rateNGN">`).

### Links and buttons

- **`<a href="#dashboard">`** — A hyperlink. `href` with `#` scrolls to the element with that `id` on the same page. Used in the nav (Dashboard, Transactions, Categories, Exchange Rates, Settings) and the "View All" button.
- **`<svg viewBox="0 0 24 24">`** — Inline vector icon (scalable graphic). Used 7 times for sidebar nav icons. `viewBox` defines the coordinate grid; `aria-hidden="true"` hides decorative icons from screen readers.
- **`<path d="M4 6h16">`** — An SVG shape drawn with commands (lines/curves). Used inside `<svg>` for list, arrow, chart, and gear icons.
- **`<rect x="3" y="3" width="7" height="7">`** — An SVG rectangle. Used inside the Dashboard grid icon (4 small squares).
- **`<circle cx="12" cy="12" r="3">`** — An SVG circle. Used inside the Settings gear icon.
- **`<button type="button">`** — An interactive button. Used for "Add Transaction", "Clear Filters", "Cancel", and "Save Transaction". `type="button"` prevents accidental form submission; the Save button uses `type="submit"`.

### Forms

- **`<form id="filterForm">`** — Holds the filter inputs. Used for the search/filter bar (submitting is prevented; filters apply live on `input`/`change`).
- **`<form id="transactionForm" novalidate>`** — Holds the Add/Edit modal fields. `novalidate` turns off the browser's built-in popups so our own `validation.js` messages show instead.
- **`<label for="titleInput">`** — Describes a form input. `for` must match the input's `id` — clicking the label focuses the field (accessibility).
- **`<input>`** — A single-line input field. Used for: search (`type="search"`), dates (`type="date"`), title/notes (`type="text"`), amount (`type="number"`), radio choices (`type="radio"`), and a hidden id field (`type="hidden"`).
- **`<select>`** — A dropdown list. Used for Type filter, Category filter, and Category in the modal.
- **`<option value="Food">`** — One choice inside a `<select>`. The `value` is what JavaScript reads; the text is what the user sees.
- **`<fieldset>`** — Groups related form controls (the Income/Expense radio pair). Gives them a shared border and box.
- **`<legend>`** — The caption for a `<fieldset>` ("Type *"). Must be the first child of the fieldset.

### Table

- **`<table>`** — Organises tabular data (transactions). Used for the transaction history.
- **`<thead>`** — The table header row (Title, Category, Date, Amount, Notes, Actions). One per table.
- **`<tbody id="transactionTableBody">`** — The table body where JavaScript adds one row per transaction. Empty in HTML; filled by `ui.js`.
- **`<tr>`** — One table row. One static header row in HTML; body rows are created by JavaScript.
- **`<th>`** — A header cell (column title). 6 of them in the header row.
- **`<td>`** — A data cell. **Not in the static HTML** — created by JavaScript (`document.createElement("td")`) for each transaction row. Listed here because it is used in the project.

### Lists

- **`<ul>`** — An unordered (bulleted) list. Used for the exchange rates list and the validation error list (built by JS).
- **`<li>`** — One list item. Used 3 times for NGN/GBP/EUR rates; error items are created by JS.

### Script

- **`<script type="module" src="js/main.js">`** — Connects JavaScript to the page. `type="module"` enables ES Modules (`import`/`export`). Placed at the end of `<body>` so the HTML exists before JS runs. Only `main.js` is loaded; it imports the other 7 modules.

### Important HTML attributes used

| Attribute | Meaning | Where used |
|-----------|---------|------------|
| `id` | Unique name for one element — JavaScript finds elements by id | All interactive elements (e.g. `id="totalIncome"`, `id="searchInput"`) |
| `class` | Shared name for styling a group of elements | Layout/styling hooks (e.g. `class="card"`) |
| `type` | Input/button behaviour (`text`, `number`, `date`, `radio`, `submit`…) | All `<input>` and `<button>` elements |
| `name` | Groups related inputs (radios share `name="type"`) | The Income/Expense radio pair |
| `value` | The data an input/option carries | `<option>` values, hidden `editingId`, radio values |
| `placeholder` | Grey hint text inside an empty input | Search box, title, amount, notes |
| `required` | Marks a field as mandatory (paired with our own validation) | Title, amount, category, date |
| `for` | Links a `<label>` to its input by id | Every labelled form field |
| `href` | Link target (page or `#section`) | Nav links, CSS `<link>` |
| `src` | Resource location | `<script src="js/main.js">` |
| `hidden` | Boolean: element is not displayed until JS removes it | Modal, empty state, rates states, error box |
| `novalidate` | Boolean: disable browser validation popups | Transaction form (we validate in JS) |
| `min` / `step` | Number input limits (`min="0"`, `step="0.01"`) | Amount input |
| `charset` / `content` | Meta encoding / viewport settings | `<meta>` tags in `<head>` |
| `lang` | Page language | `<html lang="en">` |
| `rel` | Type of linked resource | CSS `<link rel="stylesheet">` |
| `role` / `aria-*` | Accessibility roles/labels for screen readers | Modal dialog, nav, sections, decorative SVGs (`aria-hidden`) |
| `viewBox` | SVG coordinate grid for scaling icons | All 7 sidebar `<svg>` icons |
| `data-nav-filter` | Custom data JS reads via `dataset` | Sidebar Income/Expenses buttons |
| `data-*` (`data-action`, `data-id`) | Custom data JS can read via `dataset` | Edit/Delete buttons created by `ui.js` |

---

## JavaScript Explanation (beginner-friendly)

### Core concepts

- **Variables (`const` / `let`):** `const` for values that never change (the `transactions` array, the API URL); `let` for values that change (running totals in calculations).
- **Functions:** Named blocks of reusable code, e.g. `calculateTotalIncome(list)`. They take parameters (inputs) and `return` a result. Every module exports small, single-purpose functions.
- **Arrays:** Ordered lists. `transactions` is one array holding every record. `push()` adds, `splice()` removes, `slice()` copies.
- **Objects:** Labelled bags of values. One transaction is an object: `{ id, title, amount, type, category, date, notes }`.
- **Conditionals (`if` / `else`):** Used everywhere — e.g. `if (transaction.type === "income")`, `if (errors.length > 0)`.
- **Loops:** `forEach()` visits every array item (all calculations use it).
- **Array methods:** `forEach()` (visit all), `find()` (get one by id), `findIndex()` (get position for delete), `filter()` (keep matching items), `slice()` + `sort()` (copy then sort newest-first), `includes()` (check category list).
- **DOM manipulation:** `document.getElementById()` finds an element by id; `document.createElement()` builds new elements; `textContent` sets visible text safely (user input can never inject HTML); `hidden` shows/hides elements.
- **Event listeners:** `addEventListener("click", …)`, `("submit", …)`, `("input", …)`, `("change", …)`. The table uses *event delegation*: one listener on `<tbody>` handles all Edit/Delete buttons via `button.dataset.action` / `button.dataset.id`.
- **ES Modules:** `export` shares a function/variable from a file; `import { … } from "./file.js"` uses it elsewhere. Only `main.js` is loaded by HTML; it imports the other modules.
- **localStorage:** Browser storage that survives refresh. `localStorage.setItem(key, text)` saves; `localStorage.getItem(key)` reads. Only text can be stored, so we convert with `JSON.stringify()` (array → text) and `JSON.parse()` (text → array).
- **fetch() / async / await:** `fetch(url)` requests data; `await` waits for the Promise; `await response.json()` parses the body. Used in `api.js`.
- **try/catch:** Catches errors so the app doesn't crash — used for corrupted localStorage data and API failures.

### What each function does

| Module | Function | What it does |
|--------|----------|--------------|
| `calculations.js` | `calculateTotalIncome(list)` | Sums amounts where `type === "income"` |
| | `calculateTotalExpenses(list)` | Sums amounts where `type === "expense"` |
| | `calculateBalance(list)` | Income minus expenses |
| | `countTransactions(list)` | Returns `list.length` |
| | `findHighestExpense(list)` | Largest expense amount (0 if none) |
| | `findLowestExpense(list)` | Smallest expense amount (0 if none) |
| | `calculateAverageExpense(list)` | Mean of expenses (0 if none — no divide-by-zero) |
| | `getMonthlyTotals(list)` | Last 6 months of `{ month, income, expense }` for the bar chart |
| | `getCategoryTotals(list)` | Expense totals per category, largest first, for the breakdown chart |
| `transactions.js` | `addTransaction(data)` | Creates an object with a unique id, pushes it to the array |
| | `editTransaction(id, data)` | Finds by id and overwrites its fields |
| | `deleteTransaction(id)` | Finds index by id and removes it with `splice()` |
| | `findTransaction(id)` | Returns one transaction or `undefined` |
| | `getSortedTransactions()` | Returns a copy sorted newest-first |
| | `filterTransactions(filters)` | Applies search/type/category/date/range (combined) |
| `storage.js` | `saveTransactions()` | `JSON.stringify` + `setItem` |
| | `loadTransactions()` | `getItem` + `JSON.parse` inside `try/catch` |
| `validation.js` | `validateTransaction(data)` | Returns a list of error messages (empty = valid) |
| `ui.js` | `renderDashboard()` | Calls all 7 calculations, writes them into the cards |
| | `renderCharts()` | Draws monthly + category charts from real data (empty states if none) |
| | `renderRecent()` | Draws the last 5 transactions (newest first) in the dashboard cell |
| | `renderTransactions(list, msg)` | Builds table rows (green + / red − amounts) |
| | `openAddModal()` / `openEditModal(tx)` / `closeModal()` | Modal show/hide + form filling |
| | `showRatesLoading()` / `showRates()` / `showRatesError()` | Exchange panel states |
| | `showMessage(text)` | Toast notification (auto-hides after 3s) |
| `api.js` | `fetchExchangeRates()` | Fetches USD→NGN/GBP/EUR, throws on any failure |
| `main.js` | `init()` | Loads data, draws screen, attaches all listeners |
| | `handleFormSubmit()` | Validate → add/edit → save → re-draw |
| | `handleTableClick()` | Edit/Delete via event delegation |
| | `readFilters()` / `applyFilters()` | Read filter bar, re-draw filtered table |
| | `showToday()` | Fills the top-bar date |
| | Quick-action / nav / menu / clear-all handlers | Pre-select type, apply sidebar filters, toggle mobile drawer, clear data |
| | `loadRates()` | `try/catch` wrapper around the API call |

**Flow for "Add Transaction":** click Add → `main.js` opens modal (`ui.js`) → submit → `validation.js` checks → `transactions.js` adds to `data.js` array → `storage.js` saves → `calculations.js` computes totals → `ui.js` re-renders. The dashboard is always calculated from real records.

---

## CSS Explanation (with project examples)

- **Selectors:** `.card` styles all cards; `.card-income .card-value` styles the value *inside* an income card (green). `*` resets all default margins.
- **Classes vs IDs:** Classes (`.card`, `.btn`) style groups; IDs (`#dashboard`) target one element. This project styles almost entirely with classes.
- **CSS variables (`:root`):** `--primary: #0f766e`, `--radius: 16px`, `--shadow`, etc. Change a value once, it updates everywhere. Used via `var(--primary)`.
- **Colours & backgrounds:** Light grey page (`#f1f5f9`), white surfaces, dark sidebar (`#0f172a`), green income (`#16a34a`), red expense (`#dc2626`). One palette, used consistently.
- **Box model:** Every element is content + `padding` (inside) + `border` + `margin` (outside). `box-sizing: border-box` (set on `*`) means `width` includes padding/border, so layouts don't overflow. Cards use `padding: 20px`; sections use `margin-bottom: 40px`.
- **Flexbox (`display: flex`):** 1-D layout (row/column). Used for sidebar+page side-by-side, filter bar wrapping, modal buttons, nav links, chart columns.
- **CSS Grid + Bento layout (`display: grid`):** 2-D layout (rows + columns). The dashboard uses a 4-column Bento grid: `.bento { grid-template-columns: repeat(4, 1fr); }` with cells spanning differently — `.bento-balance { grid-column: span 2; }` (hero), chart/category cells span 2, recent spans 4. Varied sizes create visual hierarchy instead of identical rows. At 1024px it becomes 2 columns; at 640px, 1 column.
- **Positioning:** `sticky` keeps the sidebar/top bar visible on scroll; `fixed` pins the modal overlay, toast, and mobile drawer; `relative` + `absolute` (via `::after`) places the balance-card glow. `[hidden] { display: none !important; }` guarantees hidden elements stay hidden.
- **Glassmorphism:** The top bar uses `background-color: rgba(255,255,255,0.72)` + `backdrop-filter: blur(14px)` — a translucent surface that blurs content scrolling underneath. The balance card has a soft blurred glow (`filter: blur(40px)` circle) for depth. Used sparingly (top bar + hero card only) so the design stays minimal.
- **Shadows & border radius:** `--shadow` (soft, layered) on cards/panels; `--shadow-hover` on hover for depth feedback. `--radius: 16px` for cards, `--radius-sm: 10px` for buttons/inputs — consistent rounded corners everywhere.
- **Transitions:** `transition: background-color 0.15s ease` on nav/buttons, `box-shadow/transform 0.2s` on cards, `height/width 0.3s` on chart bars. Subtle motion only — no decorative animation.
- **Responsive design (media queries):** `@media (max-width: 1024px)` Bento → 2 columns; `@media (max-width: 900px)` sidebar becomes an off-canvas drawer (`.sidebar.open` slides in); `@media (max-width: 640px)` Bento → 1 column, filters stack. Same HTML, rearranged by CSS.
- **Hover & focus:** `.btn-primary:hover` darkens on mouse-over; `:focus` shows a green outline for keyboard users (accessibility).
- **Table wrapper:** `.table-wrap { overflow-x: auto; }` lets the table scroll sideways on small screens instead of breaking the layout.

---

## Testing

See `TESTING.md` for real results (logic tests + browser checklist). All financial figures were verified against hand-calculated expected values after every operation.

## Screenshots

Take these from the running app (Live Server) and save them in a `screenshots/` folder before submission:
1. Dashboard with sample transactions (desktop).
2. Add/Edit modal open.
3. Mobile view (narrow browser window).
4. Exchange rates panel loaded.

## License / Credits

Student project for Craft Innovation Hub. Exchange rates: Open ER-API (free, no key). Built with HTML, CSS & Vanilla JavaScript.
