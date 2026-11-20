# itcha_website

Website + committee dashboard for ITCHA (IT Corridor Hostels Association, Telangana) at itcha.org. Built and maintained by the Kamer team for ITCHA; not part of the Kamer product. Read README.md first.

- Next.js 15 App Router, JavaScript (no TypeScript), plain CSS in `app/globals.css` (tokens on `:root`; brand navy/teal/gold from the logo).
- Develop and push directly on `main` (no dev/stage chain); Vercel deploys `main`.
- All DB access is raw SQL through `db()` in `lib/db.js` (Neon tagged templates; always parameterise, never interpolate strings into SQL). Schema lives only in `scripts/migrate.mjs`, which must stay idempotent (`IF NOT EXISTS`, additive changes) because it runs on every build.
- Every server action in `app/admin/actions.js` must start with `requireAdmin()` (middleware is only a first gate). Log state changes with `audit()`.
- Association facts belong in `lib/site.js`. Never invent committee names, fees, registration numbers or stats: leave them empty (the block hides) until ITCHA confirms them.
- Public pages must render without a database (`lib/public-data.js` falls back to empty lists).
