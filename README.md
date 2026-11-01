# Echo

Echo is a Next.js App Router application backed by Supabase Auth and Postgres.

## Supabase setup

1. Create or select a Supabase project.
2. Open **SQL Editor**, create a new query, paste the contents of
   [`supabase/migrations/20261101000000_initial_schema.sql`](./supabase/migrations/20261101000000_initial_schema.sql),
   and run it.
3. Copy the project URL and publishable/anon key into `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```

4. Restart the Next.js development server after changing environment variables.

The migration creates the application tables, foreign keys, indexes, RLS
policies, and an `auth.users` trigger that creates a profile automatically.
The registration form also upserts the profile when a session is immediately
available. If email confirmation is enabled, the trigger creates the profile
before the user confirms their email.

The browser client is in [`lib/supabase.ts`](./lib/supabase.ts), and the
cookie-aware server client is in
[`lib/supabase-server.ts`](./lib/supabase-server.ts).

Profile avatar and cover uploads use the public `media` Storage bucket. Files
are stored under `<user-id>/avatar-<uuid>.<extension>` or
`<user-id>/cover-<uuid>.<extension>`, and the resulting URLs are saved in
`profiles.avatar_url` and `profiles.cover_url`. The migration creates the
bucket and user-scoped Storage policies.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
