# Strategic Brief → Google Sheets

Connects the Strategic Brief form on `/strategic-session/` to the Google
Sheet at:
https://docs.google.com/spreadsheets/d/1joKdtGfWsHeTO71q5SD2DTPxzxHT2OvcpT3WmEgOHf0/edit

One submission = one new row. Nothing is ever overwritten.

## Deploy (do this once, in your Google account)

1. Open the Sheet above.
2. **Extensions → Apps Script.**
3. Delete any placeholder code in the editor, then paste in the contents
   of `Code.gs` from this folder.
4. If your sheet tab isn't named "Strategic Brief", either rename the tab
   to that, or change `SHEET_NAME` at the top of the script to match.
5. **Deploy → New deployment.**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**. Google will show an "unverified app" warning — that's
   expected for your own script. Click **Advanced → Go to (project name),
   unsafe** to authorize it (it only needs permission to edit this one
   spreadsheet).
7. Copy the URL ending in `/exec`. Send it back so it can be pasted into
   `js/strategic-session.js` (the `SHEETS_ENDPOINT` constant near the top
   of the file) — or paste it in yourself.

That URL is not a secret: it only accepts writes (there's no `doGet`, so
it can't be used to read the sheet's contents back).

## When you change the script later

Apps Script doesn't auto-update a deployment when you edit the code. After
any change: **Deploy → Manage deployments → (pencil icon) → New version →
Deploy.**

## Columns written

Date / Time, Name, Email, Company / Brand, Role, What They Do, Website,
Instagram, LinkedIn, Other Links, Context, Strategic Request, Language.

The header row is created automatically on the first submission if the
sheet is empty.

## Spam handling

- A hidden honeypot field: real visitors never fill it; if it arrives
  filled, the script replies "ok" but writes nothing.
- A 60-second per-email cooldown (via `CacheService`) absorbs accidental
  double-submits or a rapid retry loop.
