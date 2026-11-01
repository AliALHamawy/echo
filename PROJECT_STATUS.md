# Echo Project Status

## Overview

Echo is a Next.js 16 App Router application using React 19, TypeScript,
Tailwind CSS, Redux Toolkit, and Supabase Auth/Postgres.

The project is at the MVP feature-integration stage. The app shell, major
routes, authentication, profiles, feed, messaging, and settings are present
and connected to the Supabase-backed data layer.

## Implemented application areas

### Application shell and navigation

- Root layout and global styling
- Main authenticated layout
- Terms and privacy layout
- Responsive desktop/mobile navigation
- Header, logo, theme synchronization, and mobile search entry points
- Dark/light theme preference support

### Authentication

- Sign-in with Supabase email/password authentication
- Account registration with `supabase.auth.signUp`
- Username generation and full-name metadata
- Automatic profile creation through the `auth.users` database trigger
- Profile upsert when signup immediately returns a session
- Forgot-password and reset-password flows
- Google/GitHub OAuth entry points
- Auth guard and Supabase cookie/session refresh middleware
- Authentication alerts and form validation

### Profiles and account settings

- Own profile page
- Other-user profile route
- Profile post list
- Follower/following counts
- Follow/unfollow actions
- Account summary card
- Edit profile form
- General, appearance, notification, and security settings
- Account deletion flow

### Feed and posts

- Quick post composer
- Post cards
- Author identity and avatar rendering
- Edit and delete own posts
- Comments list, creation, and deletion
- Like and repost interactions
- Comments-enabled post setting
- Visibility selection in the composer
- Feed loading from Supabase-backed data

### Search and discovery

- Search page
- Mobile search page
- Search bar and search popup
- User result cards
- Post result cards
- Trending topics/card
- Search topics UI

### Messaging and notifications

- Inbox/conversation list
- Single conversation route
- User selection for starting conversations
- Message creation and thread loading
- Read/unread message tracking
- Conversation summaries and timestamps
- Notifications page and notification settings UI

### Shared UI

The reusable component library includes cards, buttons, inputs, avatars,
checkboxes, dropdowns, alerts, sheets, badges, message components, animated
theme controls, blur/fade effects, and Echo-specific components under
`components/myComponents/`.

## Backend architecture

- Browser Supabase client: `lib/supabase.ts`
- Server Supabase client with App Router cookies: `lib/supabase-server.ts`
- Middleware session refresh: `lib/supabase-middleware.ts`
- Next.js proxy entry point: `proxy.ts`
- Supabase compatibility/data adapter: `lib/backend.ts`
- Post and message domain helpers: `lib/posts.ts`, `lib/messages.ts`
- SQL migration: `supabase/migrations/20261101000000_initial_schema.sql`

PocketBase has been removed from the application:

- `lib/pocketbase.ts` is deleted.
- There are no PocketBase dependencies, imports, or `RecordModel` references.
- Existing UI data calls now use the Supabase-backed `backend` adapter.

The adapter preserves the existing component-facing API while translating
legacy field names to the normalized Supabase schema. It also hydrates related
author profiles for posts and comments.

## Database schema

The migration creates:

- `profiles`, linked to `auth.users`
- `posts`, linked to `profiles`
- `likes`, with unique `(user_id, post_id)`
- `comments`, linked to authors and posts
- `follows`, with unique `(follower_id, following_id)`
- `messages`, for sender/recipient conversations
- `post_interactions`, for likes/reposts used by the current UI

It also creates indexes, enables RLS, defines ownership/access policies, and
creates an `auth.users` trigger that inserts a profile on signup.

Run the complete migration from the Supabase dashboard SQL Editor:

1. Open **SQL Editor** in the project.
2. Create a new query.
3. Paste `supabase/migrations/20261101000000_initial_schema.sql`.
4. Run the query.

The policy section is safe to rerun because it drops the named policies before
recreating them. If an earlier version of this schema was already deployed,
apply the migration against a backup or use a separate ALTER migration to add
new columns rather than deleting existing data.

## Configuration

Set these values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Only the browser-safe publishable/anon key belongs in this file. Never expose a
service-role key in client code or `NEXT_PUBLIC_*` variables.

## Validation

Verified:

- `pnpm build` passes.
- The development route `/auth` returned HTTP 200 after Supabase environment
  configuration was corrected.
- `git diff --check` passes.
- No PocketBase references remain in application source.

## Remaining operational work

1. Run the migration in the target Supabase project.
2. Confirm email confirmation and OAuth redirect URLs in Supabase Auth.
3. Create/configure the `media` Storage bucket if avatar/cover uploads are
   enabled in deployment.
4. Test signup, login, profile editing, feed posting, comments, follows, and
   two-user messaging against the deployed Supabase project.
5. Add production integration tests and deployment configuration.
