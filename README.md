# PrintNepal

Production-ready Next.js print shop website for PrintNepal, backed by Supabase Postgres, Supabase Storage, and Supabase Auth.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Storage
- Supabase Auth
- Zod validation
- Vercel deployment

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://turruypcjtdavkpiiafc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client components or any `NEXT_PUBLIC_` variable.

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Database

Schema lives in:

```text
supabase/migrations/202605070001_printnepal_schema.sql
supabase/migrations/202605070002_seed_printnepal_catalog.sql
```

Push migrations:

```bash
npx supabase link --project-ref turruypcjtdavkpiiafc
npx supabase db push
```

If CLI migration push is unavailable, paste `supabase/schema.sql` into Supabase SQL Editor.

## Storage

Uploaded customer design files use the private Supabase Storage bucket:

```text
design-files
```

The server action creates the bucket automatically if it does not exist. Admins view files through a protected API route that creates a short-lived signed URL.

## Admin Setup

Admin login uses the configured PrintNepal admin credentials:

```env
ADMIN_EMAIL=printshopnepal@gmail.com
ADMIN_PASSWORD=printshopadmin@123
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
```

Admin API routes accept the signed PrintNepal admin session token. Supabase Auth admin sessions with `profiles.role = 'admin'` are still supported as a fallback.

`SUPABASE_SERVICE_ROLE_KEY` is still required on the server because admin routes use it for database and storage operations.

## Main Routes

- `/`
- `/services`
- `/services/[slug]`
- `/search`
- `/order`
- `/order/confirmation`
- `/track-order`
- `/admin/login`
- `/admin/dashboard`
- `/admin/orders`
- `/admin/services`
- `/admin/materials`

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Add environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy.

Before production launch, rotate any secret keys that were shared during setup.
