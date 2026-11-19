/**
 * NUBARA GIVEAWAY ENTRIES (Google Apps Script, free)
 * Stores website giveaway entries in this Google Sheet, blocks duplicates,
 * and picks a random winner. Paste into Extensions > Apps Script of a
 * private Google Sheet, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). Put the web app URL into
 * promo/config.js -> endpoint.
 *
 * Add each new giveaway to CAMPAIGNS (same id as promo/config.js).
 */
var CAMPAIGNS = {
  'thanksgiving-2026': { start: '2026-11-19T16:20:00-05:00', end: '2026-11-25T23:59:59-05:00' }
};
var SHEET = 'Entries';
var STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function clean_(v, max) {
  v = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v; // block spreadsheet formulas
}
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(['Submitted (ET)', 'Campaign', 'Full name', 'Email', 'State', 'Age 18+', 'Agreed to rules']);
  return sh;
}

function doGet() { return reply_({ ok: true, service: 'nubara-giveaway' }); }

function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return reply_({ ok: false, code: 'invalid', message: 'Bad request' }); }
  if (d.website) return reply_({ ok: true }); // bot trap: silently ignore
  var c = CAMPAIGNS[d.campaign];
  if (!c) return reply_({ ok: false, code: 'invalid', message: 'Unknown giveaway' });
  var now = new Date();
  if (now < new Date(c.start) || now > new Date(c.end)) return reply_({ ok: false, code: 'closed' });
  var name = clean_(d.name, 80), email = clean_(d.email, 120).toLowerCase(), state = String(d.state || '');
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || STATES.indexOf(state) === -1 || d.age !== true || d.rules !== true) {
    return reply_({ ok: false, code: 'invalid', message: 'Please complete every field.' });
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_(), last = sh.getLastRow();
    if (last > 1) {
      var rows = sh.getRange(2, 2, last - 1, 3).getValues(); // campaign, name, email
      for (var i = 0; i < rows.length; i++) {
        if (rows[i][0] === d.campaign && String(rows[i][2]).toLowerCase() === email) return reply_({ ok: false, code: 'duplicate' });
      }
    }
    sh.appendRow([Utilities.formatDate(now, 'America/New_York', 'yyyy-MM-dd HH:mm:ss'), d.campaign, name, email, state, 'Yes', 'Yes']);
  } finally { lock.releaseLock(); }
  return reply_({ ok: true });
}

/* Menu in the Sheet: NUBARA Giveaway > Pick a random winner */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('NUBARA Giveaway').addItem('Pick a random winner', 'pickWinner').addToUi();
}
function pickWinner() {
  var ui = SpreadsheetApp.getUi();
  var id = ui.prompt('Campaign id to draw from (e.g. thanksgiving-2026):').getResponseText().trim();
  var sh = sheet_(), last = sh.getLastRow();
  var rows = last > 1 ? sh.getRange(2, 1, last - 1, 5).getValues().filter(function (r) { return r[1] === id; }) : [];
  if (!rows.length) { ui.alert('No entries found for ' + id); return; }
  var w = rows[Math.floor(Math.random() * rows.length)];
  var log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Winners') || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Winners');
  if (log.getLastRow() === 0) log.appendRow(['Drawn (ET)', 'Campaign', 'Entries in draw', 'Winner name', 'Email', 'State']);
  log.appendRow([Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm:ss'), id, rows.length, w[2], w[3], w[4]]);
  ui.alert('Winner (from ' + rows.length + ' entries): ' + w[2] + ' (' + w[3] + ', ' + w[4] + '). Saved to the Winners tab.');
}
