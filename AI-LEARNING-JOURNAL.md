# AI Learning Journal — Personal Finance & Expense Tracker

> This journal honestly records how AI assistance was used during this project.
> It describes real events from the build, not invented conversations.

**Project:** Personal Finance & Expense Tracker (Craft Innovation Hub JavaScript Practical Assignment)
**Stack:** HTML5, CSS3, Vanilla JavaScript (ES Modules), localStorage, Fetch API
**Deadline context:** The assignment was due the next day, so work was staged (plan → structure → HTML → CSS → JS → docs) with a test after each stage.

---

## 1. What AI helped me understand

- **Why ES Modules need a local server.** I learned that browsers block `import` from `file://` for security, which is why the app must run via Live Server / `python -m http.server`. This explained a confusing "module not loading" situation and is now in the README.
- **The HTML ↔ JavaScript contract via `id` attributes.** AI helped me see that every `id` in HTML is a promise: JavaScript must use exactly that name with `getElementById()`. We listed all 42 ids and kept them consistent across files.
- **Flexbox vs CSS Grid.** I learned when to use each: Flexbox for 1-D rows/columns (sidebar + main, filter bar), Grid for 2-D cards. The 7-card grid uses `repeat(auto-fit, minmax(200px, 1fr))` so it reshapes itself.
- **Why `fetch()` needs two error checks.** I learned that `fetch()` does *not* throw on HTTP 500 (it resolves with `response.ok === false`), but *does* throw on network failure. Both cases must be handled differently.
- **Pure functions.** I learned that keeping `calculations.js` free of DOM/storage makes the maths testable in Node.js without a browser — which is how the edge-case tests worked.

## 2. What features AI helped me implement

- **Stage 1 plan:** mandatory-features checklist, data model (`{ id, title, amount, type, category, date, notes }`), module responsibilities, API choice, and testing strategy.
- **Stage 3 HTML:** full dashboard skeleton (sidebar, 7 cards, filter bar, table, rates panel, modal) with accessible labels.
- **Stage 4 CSS:** complete stylesheet with variables, Flexbox/Grid layout, modal/table styling, and tablet/mobile media queries.
- **Stage 5 JavaScript:** all 8 modules — data, calculations (7 functions), storage, validation, transactions (CRUD + sort + filter), UI rendering, and `main.js` event wiring including event delegation for Edit/Delete buttons.
- **Stage 10 API:** `api.js` with `async/await`, `response.ok` check, and `try/catch` fallback in `main.js`.
- **Documentation:** README tag explanations, this journal, and the presentation guide.

## 3. JavaScript concepts I learned

- Objects and arrays; storing amounts as positive numbers with `type` deciding +/−.
- Array methods: `forEach`, `find`, `findIndex`, `filter`, `slice`, `sort`, `includes`, `splice`.
- Functions with parameters and return values; pure functions that take an array and return a number.
- DOM: `getElementById`, `createElement`, `textContent` (safe rendering), `hidden`, `dataset`.
- Events: `click`, `submit`, `input` (live search), `change` (dropdowns), and event delegation.
- ES Modules: `import`/`export`, and why only `main.js` is loaded by HTML.
- localStorage with `JSON.stringify` / `JSON.parse`, plus `try/catch` for corrupted data.
- `fetch()` with `async`/`await`, `response.ok`, and `response.json()`.
- Date handling: `YYYY-MM-DD` strings sort and compare correctly with `<` / `>`.

## 4. Problems that occurred and how they were resolved

### Problem 1: Duplicate transaction ids (found by testing)
**What happened:** My first Stage 5 logic test failed — editing "Groceries" changed the wrong record and expenses showed 60000 instead of 35000.
**Cause:** New ids used `Date.now()` alone. Three items added in the same millisecond got the same id, so `find()` returned the first one.
**Fix:** Append a random suffix: `Date.now().toString() + Math.random().toString(36).slice(2)`. All tests re-run and passed.
**Lesson:** Tests catch bugs that "look fine" in code. I can now explain why ids need uniqueness and how `find()` behaves with duplicates.

### Problem 2: Frankfurter API no longer returns NGN
**What happened:** The plan chose Frankfurter, but live verification showed it only returns EUR/GBP.
**Fix:** Switched to Open ER-API (`https://open.er-api.com/v6/latest/USD`), which is free, needs no key, and includes NGN (1367.64 per USD at verification time). The plan and HTML note were updated to record the change honestly.
**Lesson:** Always verify an API's live response instead of trusting documentation or memory. Response shapes change over time.

### Problem 3: Sandbox network blocked the API domain
**What happened:** Direct `curl` to the API failed in the build environment (only certain hosts are reachable there).
**Fix:** Tested `api.js` with a mocked `fetch()` returning the exact live response shape (success, HTTP 500, network failure, API error). The browser test for live rates remains a manual step for the student.
**Lesson:** Logic can be proven without network access by mocking. But mocked tests are not the same as live browser tests — both are needed, and the difference is recorded in `TESTING.md`.

### Problem 4: Corrupted localStorage data
**What happened:** If stored JSON is broken, `JSON.parse()` throws and could crash the app on load.
**Fix:** `loadTransactions()` wraps parsing in `try/catch`, validates the result is an array, and falls back to an empty list. Verified with broken JSON and non-array JSON tests.
**Lesson:** Storage is untrusted input. Defensive checks (`Array.isArray`, `try/catch`) are part of correct code, not over-engineering.

## 5. What I learned from debugging

- **Write the test first, read the numbers.** The id bug was invisible until the test printed `60000` vs expected `35000`. Comparing actual vs expected values pinpoints the fault faster than reading code.
- **Edge cases are where apps break.** Empty lists (divide-by-zero), income-only data, decimals, and corrupted storage were all tested explicitly. The average function returning `0` for no expenses is a deliberate decision, not an accident.
- **Display rounding ≠ storage rounding.** Amounts are stored as raw numbers; only the display rounds to 2 decimals with thousand separators. This avoids accumulating rounding errors.
- **Honest documentation matters.** `TESTING.md` records only performed tests, including the failure-then-fix. Claiming unperformed tests would be bluffing and would fail under instructor questioning.

## 6. What I can now explain independently

- The data model and why amount is always positive with `type` deciding direction.
- How add/edit/delete flows through validation → transactions → storage → calculations → UI.
- How each of the 7 calculation functions works and why they return `0` for empty expense lists.
- How search/filter combines 6 conditions with `filter()` and early returns.
- How localStorage save/load works and how corrupted data is handled.
- How `fetch()` + `async/await` + `try/catch` loads rates with a fallback.
- Every HTML tag in `index.html` and the main CSS layout techniques (see README).

## 7. What I still need to improve

- **Browser testing discipline:** Logic tests passed, but the full 10-scenario browser pass (including offline API test and screenshots) still needs to be performed and recorded by hand.
- **More complex DOM patterns:** Event delegation is understood at a basic level; I need more practice with larger UIs.
- **Date handling:** String comparison works for `YYYY-MM-DD`, but I should learn proper `Date` object handling for future projects.
- **CSS depth:** I can explain Flexbox/Grid/media queries, but advanced topics (animations, CSS nesting, custom properties in depth) are still new.
- **Git workflow:** Committing and pushing the finished project, and taking real screenshots for submission, remain to be done.

---

*AI assistance was used for planning, code generation, debugging, and documentation. All test results in `TESTING.md` reflect tests actually run during the build. Manual browser tests and screenshots must be completed by the student before submission — they have not been faked.*
