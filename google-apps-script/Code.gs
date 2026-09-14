/**
 * Strategic Brief intake — receives submissions from /strategic-session/
 * and appends one row per submission to this spreadsheet.
 *
 * Deployment: see README.md in this folder.
 */

var SHEET_NAME = "Strategic Brief"; // rename here if your tab uses a different name
var HEADERS = [
  "Date / Time", "Name", "Email", "Company / Brand", "Role", "What They Do",
  "Website", "Instagram", "LinkedIn", "Other Links",
  "Context", "Strategic Request", "Language"
];

// Per-email cooldown so an accidental double-click (or a very fast bot)
// can't create duplicate rows. Not a real rate limiter, just cheap
// insurance — pairs with the client-side honeypot + timing check.
var RATE_LIMIT_SECONDS = 60;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Honeypot: a real visitor never fills this hidden field. Reply "ok"
    // so the bot doesn't learn anything, but write nothing.
    if (data.hp) {
      return jsonResponse({ status: "ok" });
    }

    var cache = CacheService.getScriptCache();
    var rateKey = "ss_rl_" + (data.email || "anon");
    if (cache.get(rateKey)) {
      return jsonResponse({ status: "ok" });
    }
    cache.put(rateKey, "1", RATE_LIMIT_SECONDS);

    var sheet = getSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.company || "",
      data.role || "",
      data.about || "",
      data.website || "",
      data.instagram || "",
      data.linkedin || "",
      data.otherLinks || "",
      data.context || "",
      data.request || "",
      (data.lang || "").toUpperCase()
    ]);

    return jsonResponse({ status: "ok" });
  } catch (err) {
    return jsonResponse({ status: "error", message: String(err) });
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
