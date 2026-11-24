# STAGE 1 — Implementation Plan
## Personal Finance & Expense Tracker (Craft Innovation Hub)

**Status:** ✅ Stages 1–12 + full redesign complete (46 logic checks passing; README updated for new tags/charts). Remaining student actions: 10-scenario browser pass + real screenshots (see TESTING.md).
**Deadline:** Tomorrow — this plan is compressed to fit that, without skipping mandatory features.

---

## 1. What exists now (inspection result)

Your repo `Meentv/Expenses-tracker` currently contains only:

- `README.md` (3-line project description)
- No `index.html`, no `css/`, no `js/`

**Decision:** There is no working code to preserve, so we build fresh following the assignment's suggested folder structure exactly. No framework, no backend, no libraries — Vanilla JS only, as required.

---

## 2. Mandatory features checklist (from your assignment)

| # | Requirement | Where it will live |
|---|-------------|-------------------|
| A | Dashboard: total income, total expenses, balance, transaction count, highest/lowest/average expense, recent transactions | Summary cards + recent list in `index.html`, rendered by `ui.js`, numbers from `calculations.js` |
| B | Transactions: add/edit/delete income & expense, latest first, empty state | `transactions.js` (logic) + `ui.js` (rendering) + modal form in `index.html` |
| C | Reusable calculation functions, never hardcoded | `calculations.js` — 7 pure functions (see §6) |
| D | Search + filter by title, type, category, date, date range, clear all, combinable | Filter bar in `index.html`, logic in `transactions.js` |
| E | Validation: title, amount > 0, type, category, date; notes optional | `validation.js` + inline error messages in the form |
| F | localStorage save/load/update/delete, survive refresh, handle empty/corrupt data | `storage.js` |
| G | Free currency API via `fetch()`, loading state, HTTP + network error handling, fallback message, no API key | `api.js` + exchange-rate panel in `index.html` |
| H | ES Modules, clean folder structure, one responsibility per file | 8 JS modules (see §6) |
| Docs | README (with every HTML tag explained), AI Learning Journal, test results, presentation guide | `README.md`, `AI-LEARNING-JOURNAL.md`, `TESTING.md`, `PRESENTATION-GUIDE.md` |

**Explicitly NOT adding** (to protect tomorrow's deadline): charts/graphs, dark mode, user accounts, backend, pagination, CSV export. None are required by the assignment. If time remains after everything mandatory works, we can discuss one small extra — and I'll label it as "beyond requirements" so you can explain it honestly.

---

## 3. Pages & sections — one single-page dashboard

No router, no multiple pages. One `index.html` with these sections (top to bottom):

1. **Sidebar / header** — app title, navigation links (Dashboard, Transactions, Exchange Rates — these scroll to sections on the same page), "Add Transaction" button.
2. **Summary cards (7)** — Total Income, Total Expenses, Available Balance, Total Transactions, Highest Expense, Lowest Expense, Average Expense. Each card shows a number calculated live from your transaction list.
3. **Add/Edit form** — a modal dialog (popup) with fields: Title, Amount, Type (Income/Expense radio or select), Category (dropdown), Date, Notes (optional). Used for both adding and editing.
4. **Search & filter bar** — search box (title), type filter, category filter, single date, date range (from/to), Clear Filters button.
5. **Transaction list** — table/list of transactions, newest first, each row shows title, category, date, amount (green for income, red for expense), Edit and Delete buttons. Shows a friendly empty state when there are no transactions or no filter matches.
6. **Exchange rate panel** — shows live currency rates from the API, with a loading spinner and a fallback message if the API fails. The tracker keeps working even if this panel fails.
7. **Footer** — small credit line.

**Responsive behaviour:** On desktop, sidebar + grid of cards. On tablet/mobile, cards stack, sidebar collapses to a top bar. Done with CSS Grid/Flexbox + media queries — no JS needed for layout.

---

## 4. Folder structure (exactly as suggested, plus 3 doc files)

```
expense-tracker/
├── index.html                  ← page structure (all sections above)
├── css/
│   └── style.css               ← all styling + responsive rules
├── js/
│   ├── main.js                 ← starts the app, wires everything together
│   ├── data.js                 ← shared state + category lists
│   ├── transactions.js         ← add / edit / delete / search / filter
│   ├── calculations.js         ← the 7 money maths functions
│   ├── ui.js                   ← renders cards, list, empty states, messages
│   ├── storage.js              ← localStorage save / load
│   ├── validation.js           ← form checking rules
│   └── api.js                  ← fetch() exchange rates
├── README.md                   ← how to run + every HTML tag explained
├── AI-LEARNING-JOURNAL.md      ← honest record of AI help & learning
├── TESTING.md                  ← real test results only (no bluff)
└── PRESENTATION-GUIDE.md       ← your talk track + likely instructor Q&A
```

**Why no extra JS files?** Each file above has one clear job. Adding more files (e.g. a separate `utils.js`) would split simple code across too many places and make it harder for you to explain. `data.js` holds the small shared pieces (categories, the transaction array) so other modules don't need to pass data through many layers.

---

## 5. Data model — what one transaction looks like

Every transaction is a plain JavaScript **object** (a labelled bag of values):

```js
{
  id: "1712345678901",     // unique id, made from Date.now() when created
  title: "Groceries",      // string, required, not empty
  amount: 25000,           // number, always positive (type decides + or −)
  type: "expense",         // "income" or "expense" only
  category: "Food",        // from a fixed dropdown list
  date: "2026-11-20",      // "YYYY-MM-DD" string from the date input
  notes: "Weekly shop"     // string, optional, may be ""
}
```

Key beginner-friendly decisions:

- **Amount is always stored positive.** The `type` field says whether it adds or subtracts. This makes the maths simple: income total = sum of amounts where type is income; expense total = sum where type is expense; balance = income − expenses.
- **All transactions live in one array** (`transactions` in `data.js`). Adding = push to the array. Editing = find by `id` and update. Deleting = filter the array to remove that `id`. After every change, we save to localStorage and re-render the dashboard — so the numbers are always calculated from real records, never hardcoded.
- **Categories (proposed):** Salary, Freelance, Business, Gift, Food, Transport, Housing, Utilities, Entertainment, Health, Shopping, Education, Other. One combined dropdown keeps the code simple. *(Tell me if you want separate income/expense category lists — it's a small change, but one list is easier to explain.)*

---

## 6. JavaScript modules — responsibilities & how they talk

Think of it as a small team where each member has one job:

| Module | Job | Key functions (beginner names) |
|--------|-----|-------------------------------|
| `data.js` | Holds the shared `transactions` array + category lists | (exports variables, no logic) |
| `storage.js` | Talks to localStorage | `saveTransactions()`, `loadTransactions()` |
| `calculations.js` | Pure maths — takes the array, returns a number. No DOM, no storage. Easy to test. | `calculateTotalIncome()`, `calculateTotalExpenses()`, `calculateBalance()`, `countTransactions()`, `findHighestExpense()`, `findLowestExpense()`, `calculateAverageExpense()` |
| `validation.js` | Checks a form submission before anything is saved | `validateTransaction()` → returns list of error messages |
| `transactions.js` | Business logic: add, edit, delete, search, filter, sort | `addTransaction()`, `editTransaction()`, `deleteTransaction()`, `filterTransactions()` |
| `ui.js` | Only job: draw things on screen | `renderDashboard()`, `renderTransactions()`, `showEmptyState()`, `showMessage()` |
| `api.js` | Only job: fetch exchange rates | `fetchExchangeRates()` (async, try/catch) |
| `main.js` | The coordinator: loads data, attaches event listeners (button clicks, form submit), calls the others in the right order | `init()` |

**How they communicate (the flow for "Add Transaction"):**

```
User clicks "Add" → main.js opens modal (ui.js)
User submits form → main.js calls validation.js
  → if invalid: ui.js shows error messages, nothing saved
  → if valid: transactions.js adds it to the array in data.js
  → storage.js saves the array to localStorage (JSON.stringify)
  → calculations.js computes new totals from the array
  → ui.js re-renders cards + list
```

**ES Modules:** each file uses `export` to share its functions and `import` to use another file's functions. `index.html` loads only `main.js` with `<script type="module">`, and `main.js` imports the rest. This is why the app must be opened through a local server (see §9) — browsers block module imports from `file://` for security.

---

## 7. API integration approach

- **Chosen API: Frankfurter** — `https://api.frankfurter.app/latest?from=USD&to=NGN,GBP,EUR`
  - Free, no API key needed (nothing secret in your code), reputable (used widely for currency demos), returns simple JSON like `{ "amount": 1, "base": "USD", "rates": { "NGN": 1550.2, "GBP": 0.79, "EUR": 0.92 } }`.
  - Why this one: no key = nothing to leak; simple response = beginner-friendly `fetch()` code; CORS-enabled so the browser allows the call.
- **What you display:** a small "Exchange Rates" panel showing 1 USD = X NGN / GBP / EUR, with the date from the API.
- **Loading state:** panel shows "Loading rates…" while waiting.
- **Error handling (two layers):**
  1. HTTP error (e.g. 404/500) → check `response.ok`, show fallback message.
  2. Network error (offline, API down) → `try/catch` catches it, show fallback message.
- **Isolation rule:** `api.js` never touches transactions or localStorage. If the API is down, the tracker still works perfectly — only the rates panel shows the fallback. This directly satisfies "the API must not prevent the core tracker from working."

---

## 8. Validation & storage rules

**Validation (before any save):**
- Title: required, must not be empty/whitespace.
- Amount: required, must be a number greater than 0 (rejects negative, zero, text).
- Type: must be exactly "income" or "expense".
- Category: must be one of the dropdown options (not empty).
- Date: required, must be a valid date.
- Notes: optional — anything goes, including empty.
- Any failure → show clear messages under the fields, save nothing.

**Storage:**
- Key name: `"expenseTrackerTransactions"`.
- Save: `JSON.stringify(transactions)` → `localStorage.setItem(...)`.
- Load: `localStorage.getItem(...)` → `JSON.parse(...)` inside `try/catch`. If storage is empty → start with `[]`. If stored data is corrupted (bad JSON) → catch the error, start with `[]`, and show a small warning instead of crashing.
- Every add/edit/delete immediately re-saves, so a refresh always restores your data.

---

## 9. Potential technical challenges & how we'll handle them

| Challenge | Why it happens | Our solution |
|-----------|---------------|--------------|
| ES Modules + `fetch()` fail when opening `index.html` directly (`file://`) | Browsers block module imports and some fetches from local files for security | Run via a local server: VS Code Live Server, or `python -m http.server` / `npx serve`. Documented in README. |
| Corrupted localStorage data crashes the app | `JSON.parse()` throws on invalid JSON | `try/catch` in `loadTransactions()`, fall back to empty array. |
| Amount typed as text ("abc") or negative | Form inputs always give strings | Convert with `Number()`, check `> 0` and `!isNaN()` in validation. |
| Dates sorting wrong | String dates sort differently than expected | Store as `YYYY-MM-DD` (sorts correctly as text) and sort newest-first before rendering. |
| API down / offline | Network issues are normal | Fallback message in rates panel only; tracker unaffected. |
| Floating-point money maths (e.g. 0.1 + 0.2) | JS numbers are binary fractions | Round displayed totals to 2 decimal places with `toFixed(2)`. Storage keeps raw numbers. |
| Deadline tomorrow | Scope creep is the biggest risk | Locked feature list above; no extras until all mandatory features pass tests. |

---

## 10. Testing strategy (real results only — no bluff)

We'll test in `TESTING.md` as we build, recording **actual** results (pass/fail + what we saw). The 10 required scenarios:

1. Add valid income → balance increases correctly.
2. Add valid expense → balance decreases correctly.
3. Submit empty form → validation messages, nothing saved.
4. Enter negative amount → rejected with message.
5. Edit a transaction → dashboard updates.
6. Delete a transaction → dashboard updates.
7. Refresh browser → data restored from localStorage.
8. Search for nonexistent title → empty state shown.
9. Filter with no matches → empty state shown.
10. API unavailable (test by going offline / blocking the domain) → fallback message, tracker still works.

Plus: after **every** add/edit/delete, we verify all 7 dashboard figures against hand-calculated expected values. Screenshots for submission will be taken from the real running app at the end (Stage 12) — never staged or faked.

---

## 11. Deadline-tomorrow execution order (compressed stages)

Each stage ends with a quick test before moving on. Estimated total: one focused day.

| Order | Work | Test before moving on |
|-------|------|----------------------|
| 1 | Folder structure + `index.html` skeleton (all sections, no styling yet) | Page opens, all sections visible |
| 2 | `style.css` — layout, cards, responsive breakpoints | Looks right on desktop + mobile width |
| 3 | `data.js` + `storage.js` + `calculations.js` | Console check: load/save + maths on sample data |
| 4 | `transactions.js` + `ui.js` + modal form (add/edit/delete/list) | Add/edit/delete update the dashboard |
| 5 | `validation.js` wired into the form | Empty/negative/invalid submissions rejected |
| 6 | Search & filters (title, type, category, date, range, clear) | Combined filters + empty states correct |
| 7 | `api.js` + exchange panel | Rates load; offline shows fallback |
| 8 | Full 10-scenario test pass → `TESTING.md` | All pass (or honestly marked) |
| 9 | `README.md` (every HTML tag actually used + JS/CSS concepts), `AI-LEARNING-JOURNAL.md`, `PRESENTATION-GUIDE.md`, screenshots | Docs match the real code — every tag listed must exist in the project |

**Teaching throughout:** at each step I'll explain what we're building, why, the JS concepts involved, show the code, explain the logic, tell you how to test it, and give you one small independent task. You review before we proceed.

---

## 12. Decisions I need your approval on

1. **Single-page dashboard** (no separate pages) — recommended for simplicity and deadline.
2. **Frankfurter API** for exchange rates (USD → NGN, GBP, EUR) — free, no key.
3. **One combined category list** for income + expenses (listed in §5).
4. **Currency display:** amounts shown as plain numbers with 2 decimals (e.g. `25,000.00`). If you want a currency symbol (e.g. ₦ or $), tell me which — it's a one-line change in `ui.js`.
5. **No charts** (not required; protects the deadline).

---

## ✅ Approval gate

Reply with **"Approved"** (or tell me what to change) and we'll start Stage 2: folder/file structure + HTML skeleton. I will not write application code until you approve this plan.
