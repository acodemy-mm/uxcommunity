# UX Community

A web app for UX professionals featuring articles, video courses, podcasts, job posts, and design challenges. Built with Next.js 16 and Supabase.

## Features

- **Articles** - UX insights and best practices
- **Video Courses** - YouTube video embeds for learning
- **Podcasts** - Episode links (Spotify, Apple, etc.)
- **Job Posts** - UX/UI design job listings
- **Challenges** - Design challenges with dates and prizes

## Roles

- **User** - Browse all content, sign up/sign in
- **Admin** - Full CRUD for all content types via Admin Panel

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Connect Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local`
3. Add your Supabase URL and anon key from Project Settings → API

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

> **Note:** The app requires these env vars to build and run. Add them before `npm run dev` or `npm run build`.

### 3. Run database migration

In your Supabase project, go to **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

### 4. Create an admin user

1. Sign up via the app at `/auth/signup`
2. In Supabase Dashboard → Table Editor → `profiles`
3. Find your user and set `role` to `admin`

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin CRUD (articles, videos, podcasts, jobs, challenges)
│   ├── articles/       # Public articles
│   ├── auth/           # Login, signup, callback
│   ├── challenges/     # Public challenges
│   ├── jobs/           # Public job posts
│   ├── podcasts/       # Public podcasts
│   └── videos/          # Public video courses
├── components/
├── lib/
│   └── supabase/       # Supabase client (browser, server, middleware)
└── types/
```

## Admin Panel

Access at `/admin` (admin role required). Manage:

- **Articles** - Title, slug, excerpt, content (HTML), cover image, published
- **Videos** - Title, YouTube URL, description, duration, order
- **Podcasts** - Title, episode URL, description, cover, duration
- **Jobs** - Title, company, description, location, type, salary, apply URL
- **Challenges** - Title, description, rules, prize, start/end dates
