# itcha.org

Website and committee dashboard for **ITCHA, IT Corridor Hostels Association (Telangana)**.

- **Public site:** Home, About, Membership (with application form), Events, Notices, Contact.
- **Dashboard (`/admin`):** approve/reject membership applications, member register (search, renew, suspend, edit, CSV export, add offline members), post notices to the website and send them to members by email/WhatsApp, manage events, read contact-form enquiries, manage committee logins. Every action is written to an audit log.

Stack: Next.js 15 (App Router, server actions) on Vercel, Postgres on Neon (`@neondatabase/serverless`), plain CSS. No CMS.

## Editing site content

All association facts (committee, registration number, fees, contact details, stats, areas) live in **`lib/site.js`**. Blocks whose data is empty are hidden instead of showing placeholders, so fill them in as ITCHA confirms them. Committee photos go in `public/committee/` and are referenced as `/committee/<file>.jpg`.

Events and notices are managed from the dashboard, not code.

## Setup

1. **Database:** create a Neon Postgres database (in Vercel: Storage -> Neon, which sets `DATABASE_URL` automatically).
2. **Environment variables** (see `.env.example`): `DATABASE_URL`, `SESSION_SECRET` (`openssl rand -base64 48`), and for the first deploy `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` / `BOOTSTRAP_ADMIN_NAME`.
3. **Deploy.** `npm run build` runs `scripts/migrate.mjs` first: it creates/updates the tables (idempotent) and creates the first super admin if there is none. Remove the `BOOTSTRAP_*` variables after that and change the password under *My account*.
4. **Domain:** add `itcha.org` and `www.itcha.org` in Vercel -> Settings -> Domains and point DNS as Vercel instructs. Set `SITE_URL=https://itcha.org`.

Extra admins: dashboard -> Committee logins (super admin), or `DATABASE_URL=... npm run create-admin -- <email> <password> "<name>" [super_admin|committee]`.

### Notification channels (optional)

The website notice board always works. Email and WhatsApp switch on when their variables are set (the dashboard overview shows which are active):

- **Email (ZeptoMail):** `ZEPTO_API_KEY`, `EMAIL_FROM_ADDRESS` (a verified sender domain, e.g. `noreply@itcha.org`), `EMAIL_FROM_NAME`. Also used for welcome emails on approval and to alert `ADMIN_NOTIFY_EMAIL` about new applications/enquiries.
- **WhatsApp (Interakt):** `INTERAKT_API_KEY`, `INTERAKT_NOTICE_TEMPLATE` (approved template; body `{{1}}` = member name, `{{2}}` = notice title), `INTERAKT_TEMPLATE_LANG`.

Notices go to *active* members only (approved and not lapsed), optionally filtered by area. Each send is logged with sent/failed counts.

## Roles

- **Super admin:** everything, plus committee logins and permanently deleting member records.
- **Committee:** approvals, members, notices, events, enquiries.

## Local development

```
npm install
cp .env.example .env.local   # fill DATABASE_URL (a Neon dev branch) and SESSION_SECRET
npm run migrate
npm run dev
```

`NEON_FETCH_ENDPOINT` (optional) points the Neon driver at a Neon-HTTP-compatible proxy for fully offline testing.

## Membership numbers

Assigned on approval as `ITCHA-0001`, `ITCHA-0002`, ... (from the row id). Annual members get `valid_until` = approval date + 1 year; *Renew 1 year* extends from the later of today and the current expiry. Lifetime members have no expiry.
