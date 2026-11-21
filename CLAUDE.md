# itcha_website

Website + committee dashboard for ITCHA (IT Corridor Hostels Association, Telangana) at itcha.org. Built and maintained by the Kamer team for ITCHA; not part of the Kamer product. Read README.md first.

- Next.js 15 App Router, JavaScript (no TypeScript), plain CSS in `app/globals.css` (tokens on `:root`; brand navy/teal/gold from the logo).
- Two environments: branch `dev` -> Vercel Preview -> https://dev.itcha.org (non-prod Neon DB, red DEV banner, noindex); branch `main` -> Production -> https://itcha.org (prod DB, set by the user in the Vercel dashboard only). Work on `dev`, verify on dev.itcha.org, then promote with a `dev` -> `main` PR. Merge to `main` only when the user asks.
- Each DB gets its schema + first super admin from the build (`scripts/migrate.mjs`), so the first deploy after pointing an env at a new DB sets it up.
- All DB access is raw SQL through `db()` in `lib/db.js` (Neon tagged templates; always parameterise, never interpolate strings into SQL). Schema lives only in `scripts/migrate.mjs`, which must stay idempotent (`IF NOT EXISTS`, additive changes) because it runs on every build.
- Every server action in `app/admin/actions.js` must start with `requireAdmin()` (middleware is only a first gate). Log state changes with `audit()`.
- Committee data: `lib/central-committee.js` (central committee, sub-committees, EC members by area; from ITCHA's handwritten Telugu list) and `lib/area-committees.js` (15 locality committees, generated from ITCHA's delegate-card spreadsheet). Never publish members' phone numbers. Rendered at `/committee`.
- Association facts belong in `lib/site.js`. Never invent committee names, fees, registration numbers or stats: leave them empty (the block hides) until ITCHA confirms them.
- Public pages must render without a database (`lib/public-data.js` falls back to empty lists).
