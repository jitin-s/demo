# NexusHub — Supabase + Next.js + Vercel Demo Site

A modern, full-stack web application designed for collecting community feedback, guestbook entries, or early-access waitlist submissions. Powered by **Next.js (App Router)**, **Supabase PostgreSQL** with Row Level Security (RLS), **Tailwind CSS**, and zero-config deployment to **Vercel** via **GitHub**.

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## ✨ Features

- **Supabase Cloud Database**: PostgreSQL with Row Level Security (RLS) policies allowing public read, insert, and upvote actions.
- **Next.js App Router & React 19**: Lightning-fast Server Components, dynamic API endpoints (`/api/entries`, `/api/status`), and client hydration.
- **Graceful Fallback Mode**: Functions immediately in **Demo Preview Mode** with pre-loaded mock entries if Supabase credentials are not yet configured.
- **Interactive UI**:
  - Live entry submission with multi-role tags (Developer, Designer, Founder, DevOps, Student, Other).
  - 1-to-5 star rating selector.
  - Confetti burst celebration on successful entry submission.
  - Search by name or message and filter by community role.
  - Sorting by newest, oldest, highest rated, and most upvoted.
  - Heart upvote / like counter with optimistic client updates.
- **Integrated Setup Guide Modal**: Embedded step-by-step instructions with 1-click SQL copy inside the web UI.
- **Production Ready for Vercel**: Pre-configured for automatic GitHub CI/CD deployments.

---

## 📁 Project Structure

```
├── DEPLOYMENT.md             # Complete step-by-step deployment guide
├── supabase/
│   └── schema.sql            # Ready-to-run PostgreSQL table, RLS & seed data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── entries/      # API route for GET and POST entries
│   │   │   └── status/       # API route for database health & masked URL
│   │   ├── globals.css       # Tailwind CSS styles
│   │   ├── layout.tsx        # Root HTML layout and metadata
│   │   └── page.tsx          # Main interactive dashboard page
│   ├── components/
│   │   ├── Header.tsx        # Top navigation with live database indicator
│   │   ├── StatsBar.tsx      # Overview metrics (total entries, ratings)
│   │   ├── EntryForm.tsx     # Submission form with validation & confetti
│   │   ├── EntryCard.tsx     # Interactive entry card with upvotes
│   │   ├── FilterControls.tsx# Search, role filter pills, and sorting
│   │   └── SetupGuideModal.tsx # 1-click guide with copyable SQL
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client & database query helpers
│   │   └── mockData.ts       # Starter sample data for local preview
│   └── types/
│       └── database.ts       # TypeScript interfaces for entries & roles
├── .env.example              # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for instant preview)
Copy the example environment file:
```bash
cp .env.example .env.local
```
Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(If omitted, the app will run in Demo Preview Mode with full interactive capabilities).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🗄️ Setting Up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** &gt; **New Query**.
3. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
4. Retrieve your **Project URL** and **anon public key** from **Settings** &gt; **API**.

---

## 🚢 Deploying to Vercel via GitHub

Read the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md) for full details:

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete supabase demo site"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
2. In [Vercel](https://vercel.com/new), import your GitHub repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build and host your site with automatic updates on every git push!

---

## 📄 License
MIT
