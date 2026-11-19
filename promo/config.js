/*
  NUBARA PROMOTIONS CONFIG
  ------------------------------------------------------------
  One file controls the giveaway page (/giveaway), the official
  rules (/giveaway/rules.html) and the homepage banner.

  To run the next giveaway (Christmas, New Year's, ...):
    1. Change the fields below (id must be new, e.g. "christmas-2026").
    2. Pick a theme: "thanksgiving", "christmas", "newyear" or "standard".
    3. Keep the same "endpoint" (one Google Sheet stores every campaign;
       each entry is tagged with its campaign id).
  Times are US Eastern. Entries are only accepted between start and end.
*/
window.NUBARA_PROMO = {
  id: "thanksgiving-2026",
  theme: "thanksgiving",
  name: "NUBARA Thanksgiving Giveaway",
  eyebrow: "Thanksgiving Giveaway",
  headline: "Win $75 This Thanksgiving",
  intro: "We're thankful for every business owner and neighbor who supports NUBARA. To say thanks, we're giving one lucky winner a $75 holiday prize. Free to enter, no purchase and no social media required.",
  prizeTotal: "$75",
  prizes: [
    { amount: "$50", label: "Cash App" },
    { amount: "$25", label: "Amazon gift card" }
  ],
  prizeRulesText: "$50 sent via Cash App and one (1) $25 Amazon.com eGift Card",
  winners: 1,
  start: "2026-11-20T00:00:00-05:00",
  end: "2026-11-25T23:59:59-05:00",
  announce: "2026-11-26",
  startLabel: "November 20, 2026 at 12:00 AM ET",
  endLabel: "November 25, 2026 at 11:59 PM ET",
  announceLabel: "November 26, 2026",
  bannerText: "Thanksgiving Giveaway: win $75. Enter by Nov 25.",
  bannerUntil: "2026-11-27T00:00:00-05:00",
  /* Google Apps Script web app URL (see promo/apps-script.gs). */
  endpoint: ""
};
