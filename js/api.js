// ============================================================
// api.js
// ------------------------------------------------------------
// Responsibility: fetch live exchange rates (Open ER-API).
// - Uses fetch() with async/await
// - Checks response.ok for HTTP errors
// - Checks the API result field for API-level errors
// - Returns the 3 rates we display, or throws so main.js
//   can show a fallback message
//
// Never touches transactions or localStorage.
// If the API fails, the tracker still works.
// ============================================================

// Free public API, no key needed. Returns rates for 1 USD.
const API_URL = "https://open.er-api.com/v6/latest/USD";

// Fetch exchange rates for USD -> NGN, GBP, EUR.
// Returns { NGN, GBP, EUR, updated } on success.
// Throws an Error on HTTP failure, network failure,
// or an unexpected API response.
export async function fetchExchangeRates() {
  // fetch() sends the request. If there is no internet,
  // this line throws and main.js catches it.
  const response = await fetch(API_URL);

  // HTTP error check (e.g. 404, 500). fetch() does NOT throw
  // for these, so we must check response.ok ourselves.
  if (response.ok === false) {
    throw new Error("HTTP error: " + response.status);
  }

  // Turn the response body into a JavaScript object.
  const data = await response.json();

  // API-level check: the API reports "success" or "error".
  if (data.result !== "success") {
    throw new Error("Exchange rate API returned an error.");
  }

  // Pick only the 3 currencies our panel displays.
  const rates = {
    NGN: data.rates.NGN,
    GBP: data.rates.GBP,
    EUR: data.rates.EUR,
    updated: data.time_last_update_utc,
  };
  return rates;
}
