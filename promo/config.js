/*
  NUBARA PROMOTIONS CONFIG
  ------------------------------------------------------------
  One file controls the giveaway page (/giveaway), the official
  rules (/giveaway/rules.html) and the homepage banner.

  To run the next giveaway (Christmas, New Year's, ...):
    1. Change the giveaway fields below (id must be new, e.g. "christmas-2026").
    2. Pick a theme: "thanksgiving", "christmas", "newyear" or "standard",
       and swap heroImage / bannerImage / communityImage for seasonal photos.
    3. Add the same id + dates to CAMPAIGNS in promo/apps-script.gs.
    4. Leave "leads" and "social" as they are (they carry over).
  Times are US Eastern. Entries are only accepted between start and end.
*/
window.NUBARA_PROMO = {
  /* ---------- Section 1: the giveaway ---------- */
  id: "thanksgiving-2026",
  theme: "thanksgiving",
  name: "NUBARA Thanksgiving Giveaway",
  eyebrow: "Giving Thanks. Giving Back.",
  headline: "Win $75 This Thanksgiving",
  intro: "This Thanksgiving, NUBARA Group is celebrating small business owners, entrepreneurs and individuals nationwide. To say thanks, one lucky winner gets a $75 holiday prize. Free to enter. No purchase necessary.",
  prizeTotal: "$75",
  prizes: [
    { amount: "$50", label: "Cash App" },
    { amount: "$25", label: "Amazon gift card" }
  ],
  prizeRulesText: "$50 sent via Cash App and one (1) $25 Amazon.com eGift Card",
  winners: 1,
  start: "2026-11-19T16:20:00-05:00",
  end: "2026-11-25T23:59:59-05:00",
  announce: "2026-11-26",
  startLabel: "November 19, 2026 at 4:20 PM ET",
  endLabel: "November 25, 2026 at 11:59 PM ET",
  announceLabel: "November 26, 2026",

  /* Photos */
  heroImage: "../promo/thanksgiving-hero.jpg",
  prizeImage: "../promo/thanksgiving-prize.jpg",
  communityImage: "../promo/thanksgiving-banner.jpg",
  bannerImage: "promo/thanksgiving-banner.jpg",

  /* Homepage banner */
  bannerText: "Win $75 this Thanksgiving. Enter by Nov 25.",
  bannerUntil: "2026-11-27T00:00:00-05:00",

  /* Where giveaway entries go: Google Apps Script web app URL (promo/apps-script.gs).
     Entries are stored in a private Google Sheet with duplicate blocking.
     If left empty, entries are emailed to info@nubaragroup.com instead (backup). */
  endpoint: "",

  /* ---------- Section 2: business leads (separate from the giveaway) ---------- */
  leads: {
    /* HubSpot: Portal ID and Form ID from HubSpot > Marketing > Forms > (form) > Share > Embed code.
       Leave empty to email leads to info@nubaragroup.com instead. */
    hubspotPortalId: "",
    hubspotFormId: "",
    /* HubSpot contact property that stores the service picked (must be on the HubSpot form). */
    serviceField: "message",
    services: ["Marketing", "Content Creation", "AI Business Solutions", "Website Development", "Not sure yet"]
  },

  /* Backup email delivery (Web3Forms, same free key as the homepage form). */
  emailKey: "8284ff2a-1e39-4fea-b496-b6483963de7b",

  /* ---------- Section 3: community ---------- */
  social: {
    facebook: "https://www.facebook.com/share/1UodZsdjBU/",
    instagram: "https://www.instagram.com/nubaraofficial"
  }
};
