# Testing Log — Personal Finance & Expense Tracker

> Only tests that were actually performed are recorded here.
> Results are updated as each stage is tested. Nothing is pre-filled or guessed.

**Environment:** Node.js logic tests (importing the real modules) + browser manual tests via local server (`python3 -m http.server 8000`).

---

## Stage 5 — Data model, transactions, storage, validation (logic tests)

Run with Node.js against the real `js/` modules. All checks passed after one bug fix (see below).

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | Add income 100000 + expenses 25000 & 5000 → total income | 100000 | ✅ PASS |
| 2 | Total expenses | 30000 | ✅ PASS |
| 3 | Balance (income − expenses) | 70000 | ✅ PASS |
| 4 | Transaction count | 3 | ✅ PASS |
| 5 | Highest expense | 25000 | ✅ PASS |
| 6 | Lowest expense | 5000 | ✅ PASS |
| 7 | Average expense | 15000 | ✅ PASS |
| 8 | Sorted newest first | "Transport" (2026-11-21) first | ✅ PASS |
| 9 | Valid data passes validation | 0 errors | ✅ PASS |
| 10 | Invalid data (empty title, −5 amount, no type/category/date) | 5 errors | ✅ PASS |
| 11 | Edit Groceries 25000 → 30000, total expenses update | 35000 | ✅ PASS (after fix) |
| 12 | Delete Groceries, count & balance update | 2 / 95000 | ✅ PASS |

**Bug found & fixed during testing:** New transactions initially used `Date.now()` alone as the id. When several items were added in the same millisecond, they shared one id, so editing updated the wrong record (expenses showed 60000 instead of 35000). Fixed by appending a random suffix: `Date.now().toString() + Math.random().toString(36).slice(2)` in `transactions.js`. All tests re-run and passed.

## Stage 6 — Financial calculations edge cases

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | Empty list → all 7 figures | 0 (no crash, no divide-by-zero) | ✅ PASS |
| 2 | Income-only list → expense stats stay 0 | 0 | ✅ PASS |
| 3 | Expense-only list → negative balance | −8000 | ✅ PASS |
| 4 | Single expense → highest = lowest = average | 8000 | ✅ PASS |
| 5 | Decimals (99.99 income, 33.33 + 66.66 expenses) | balance 0, average 49.995 | ✅ PASS |
| 6 | Mixed sample (100000 / 25000 / 5000) | balance 70000, average 15000 | ✅ PASS |

**Display change:** `formatAmount()` in `ui.js` now uses `toLocaleString()` so figures show thousand separators (e.g. `100,000.00`). Verified: `100000 → "100,000.00"`, `99.99 → "99.99"`, `-8000 → "-8,000.00"`.

## Stages 7–9 — Validation, localStorage, search & filtering

### Stage 7: validation edge cases (10 checks, all PASS)
Valid baseline passes; whitespace-only title, zero amount, text amount (`"abc"`), empty amount, bad type (`"gift"`), unknown category (`"Lottery"`), invalid date (`"not-a-date"`) each rejected with exactly 1 error; empty notes still valid (optional field); decimal amount (`99.99`) valid.

### Stage 8: localStorage (7 checks, all PASS)
Empty storage loads 0 transactions; save writes a JSON string; clearing memory then reloading restores 2 transactions with titles intact; corrupted JSON (`"{broken json!!!"`) loads empty without crashing (error logged, app continues); non-array JSON (`{"not":"an array"}`) loads empty.

### Stage 9: search & filtering (11 checks, all PASS)
Sample data: Monthly Salary (income, 2026-11-01), Groceries (expense/Food, 2026-11-20), Taxi Ride (expense/Transport, 2026-11-21), Freelance Project (income, 2026-11-22).
No filters → 4; search `salary` → 1; search `SALARY` (uppercase) → 1 (case-insensitive); search `zzzz` → 0; type income → 2; type expense → 2; category Food → 1; exact date 2026-11-20 → 1; range 2026-11-20..2026-11-21 → 2; combined expense+Food → 1; combined income+Food → 0.

## Stage 10 — API integration (Open ER-API)

**API change note:** The plan originally chose Frankfurter, but live verification showed it no longer returns NGN (only EUR/GBP). Switched to Open ER-API (`https://open.er-api.com/v6/latest/USD`) — free, no key, includes NGN. Live response confirmed via fetch: `NGN 1367.64, GBP 0.763, EUR 0.911` (2026-11-23). Sandbox network blocks this domain, so logic was tested with a mocked `fetch()` returning the exact live response shape.

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | Success response → NGN/GBP/EUR extracted | 1367.64 / 0.763 / 0.911 | ✅ PASS |
| 2 | HTTP 500 (`ok: false`) → throws | Error caught by `loadRates()` | ✅ PASS |
| 3 | Network failure (fetch throws) → throws | Error caught | ✅ PASS |
| 4 | API `result: "error"` → throws | Error caught | ✅ PASS |

Browser behaviour (to verify in Stage 11): panel shows "Loading rates…" then rates + update time; offline/blocked API shows fallback message; tracker still works.

## Redesign — chart calculations (14 checks, all PASS)

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | Monthly totals: 2 months present | 2 | ✅ PASS |
| 2 | Chronological order (oldest first) | 2026-10 first | ✅ PASS |
| 3 | Oct income / expense | 40000 / 10000 | ✅ PASS |
| 4 | Nov income / expense | 100000 / 30000 | ✅ PASS |
| 5 | Empty list → no months | 0 | ✅ PASS |
| 6 | Category totals: expenses only | 2 categories | ✅ PASS |
| 7 | Largest first (Food 35000) | Food first | ✅ PASS |
| 8 | Income-only → no categories | 0 | ✅ PASS |
| 9 | Balance still correct after additions | 100000 | ✅ PASS |
| 10 | All 40 original element IDs preserved in new HTML | 40/40 | ✅ PASS |

**Redesign notes:** Charts are pure CSS bars (no library — assignment forbids unnecessary libs) fed by `getMonthlyTotals()` / `getCategoryTotals()`. Empty data shows chart empty states, never fake figures. Sidebar Income/Expenses apply real filters; Settings Clear-All actually clears localStorage. No fake notification/profile UI (no backend exists). TikTok reference was inaccessible (HTTP 400) — redesign follows established fintech patterns; student may share screenshots for further refinement.

## Bento revision — regression check

- All 40 original + 12 redesign IDs preserved in new HTML (verified by grep).
- All JS syntax valid; all files serve HTTP 200.
- New `renderRecent()` uses the same newest-first sort as the table; shows last 5 only; empty state when no data.
- Bento grid: 4 cols desktop → 2 cols ≤1024px → 1 col ≤640px; sidebar off-canvas ≤900px. (Visual check required in browser — see checklist below.)

## Template revision — regression check

- All IDs preserved except `todayDate` (replaced by `greetingText`); new IDs: `donutChart`, `donutLegend`, `sparkExpense`, `sparkIncome`, `greetingText`, `thisMonthBtn`, `ctaAddBtn`.
- Money now displays with ₦ (`formatMoney`); exchange rates stay plain (no ₦ on GBP/EUR).
- Donut: top 4 categories + Others grouped; percentages from real totals; empty state when no expenses.
- Sparklines: SVG polyline from last 6 monthly totals; hidden when fewer than 2 months.
- Search moved to top bar (same `searchInput` ID — filtering unchanged). "This Month" sets From/To to current month.
- New tags `<polyline>` and `<br>` documented in README; `<h1>` no longer used (noted honestly).

## Manual browser tests — STUDENT MUST PERFORM THESE (Stage 11)

Logic tests above are automated and passing. The following browser tests **cannot be automated here** and must be performed by the student in the running app (Live Server). Tick each one only after actually doing it, and note the observed result:

- [ ] **1. Add valid income** — e.g. Salary 100000 → Total Income `100,000.00`, Balance `100,000.00`.
- [ ] **2. Add valid expense** — e.g. Groceries 25000 → Expenses `25,000.00`, Balance `75,000.00`, Highest `25,000.00`.
- [ ] **3. Submit empty form** — expect 5 validation messages, nothing saved.
- [ ] **4. Enter negative amount** — expect "Amount must be a number greater than 0."
- [ ] **5. Edit a transaction** — change amount, verify all 7 cards update.
- [ ] **6. Delete a transaction** — confirm dialog, cards update, toast shows.
- [ ] **7. Refresh browser** — data restored from localStorage.
- [ ] **8. Search nonexistent title** — expect "No transactions match your filters."
- [ ] **9. Filter with no matches** — e.g. Type=Income + Category=Food → empty state.
- [ ] **10. API unavailable** — DevTools → Network → Offline, refresh → rates fallback message, tracker still works. Back online → rates return.

**Screenshots (take real ones, do not stage):** dashboard with data, modal open, mobile width, rates panel. Save under `screenshots/` and list them here with dates.

*(Until ticked above, these tests are NOT claimed as passed.)*
