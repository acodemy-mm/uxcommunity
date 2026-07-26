# UX Community

A web app for UX professionals featuring articles, video courses, podcasts, job posts, and design challenges. Built with Next.js 16 and Supabase.

## Features

- **Articles** - UX insights and best practices
- **Video Courses** - YouTube video embeds for learning
- **Podcasts** - Episode links (Spotify, Apple, etc.)
- **Job Posts** - UX/UI design job listings
- **Challenges** - Design challenges with dates and prizes
- **Enrollment** - Multi-step student apply form with cohort management

## Roles

- **User** - Sign in (invite-only), browse content, change password in Profile
- **Admin** - Full Admin Panel: users, courses, enrollments, cohorts, and content CRUD

Accounts are **invite-only**. Public `/auth/signup` is disabled; admins create users under **Admin → Users → Create user**.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Connect Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Create `.env.local` with your project keys from **Project Settings → API**

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

`SUPABASE_SERVICE_ROLE_KEY` is required for Admin **Create user** and **Remove user**.  
**Do not** prefix it with `NEXT_PUBLIC_` — that would expose the service role key to the browser.

> **Note:** The app requires the public Supabase env vars to build and run. Add them before `npm run dev` or `npm run build`.

### 3. Run database migrations

In your Supabase project, go to **SQL Editor** and run the SQL files under `supabase/migrations/` in order (at least through the enrollment migrations you need).

### 4. Disable email confirmation (required for invite-only login)

In Supabase Dashboard:

1. **Authentication → Providers → Email** → turn **Confirm email** OFF  
2. In **SQL Editor**, confirm any existing unconfirmed users:

```sql
UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;
```

(Or run [`supabase/migrations/018_confirm_emails.sql`](supabase/migrations/018_confirm_emails.sql).)

Admin-created users already use `email_confirm: true`, but the project setting above still blocks unconfirmed accounts until you confirm them and/or disable Confirm email.

### 5. Promote an admin

For an existing Auth user (e.g. `alex@alex.com`), run in the SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'alex@alex.com';
```

(Or use [`supabase/migrations/017_promote_alex_admin.sql`](supabase/migrations/017_promote_alex_admin.sql).)

Then sign in at `/auth/login` and open `/admin`.

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth (invite-only)

1. Admin creates a user at `/admin/users/new` (email + temporary password).
2. User signs in at `/auth/login`.
3. User can change their password in **Profile** (`/profile`).

## Project Structure

```
src/
├── app/
│   ├── (main)/
│   │   ├── admin/      # Admin CRUD (users, courses, enrollments, cohorts, content)
│   │   ├── articles/
│   │   ├── auth/       # Login, invite-only signup page, callback
│   │   ├── enroll/     # Student enrollment wizard
│   │   └── ...
│   └── layout.tsx
├── components/
├── lib/
│   └── supabase/       # Browser, server, admin (service role), middleware
└── types/
```

## Admin Panel

Access at `/admin` (admin role required). Manage:

- **Users** - Create users, roles, remove, course access
- **Cohorts** - Enrollment batches (active / inactive)
- **Enrollments** - Review student applications
- **Articles** - Title, slug, excerpt, content (HTML), cover image, published
- **Videos** - Title, YouTube URL, description, duration, order, access
- **Podcasts** - Title, episode URL, description, cover, duration
- **Jobs** - Title, company, description, location, type, salary, apply URL
- **Challenges** - Title, description, rules, prize, start/end dates
