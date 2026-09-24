# Deployment Guide: Next.js + Supabase + GitHub + Vercel

This step-by-step guide will walk you through deploying your **Nexus Entry Hub** application from your local machine to **GitHub** and **Vercel**, backed by **Supabase PostgreSQL**.

---

## 🛠 Prerequisites

Before starting, make sure you have free accounts on:
1. [GitHub](https://github.com) (for code hosting & CI/CD trigger)
2. [Vercel](https://vercel.com) (for production hosting)
3. [Supabase](https://supabase.com) (for PostgreSQL database)

---

## Step 1: Set Up Supabase Backend

1. **Create Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard).
   - Click **New Project**, select an organization, name your project (e.g., `nexus-hub`), set a database password, and choose your preferred region.

2. **Execute Database Schema**:
   - In your Supabase project, navigate to the **SQL Editor** tab (left sidebar).
   - Click **New Query**.
   - Copy and paste the entire contents of [`supabase/schema.sql`](file:///d:/demo/supabase/schema.sql) into the editor.
   - Click **Run** (or `Ctrl+Enter`).
   - You will see the `entries` table created with Row Level Security (RLS) policies and starter data.

3. **Retrieve API Keys**:
   - In Supabase, go to **Project Settings** (gear icon) &gt; **API**.
   - Copy:
     - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
     - **Project API Keys &gt; `anon` `public`** key

---

## Step 2: Local Verification (Optional)

1. Create a local environment file in the project root:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and paste your actual credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000). The header status badge will switch to **● Supabase Live**, and submissions will save directly to your cloud PostgreSQL database.

---

## Step 3: Push Code to GitHub

1. **Create a GitHub Repository**:
   - Go to [GitHub: Create New Repository](https://github.com/new).
   - Repository name: `nexus-entry-hub` (or your preferred name).
   - Choose **Public** or **Private**.
   - Do **NOT** check "Initialize with README", `.gitignore`, or license (we already have them).
   - Click **Create repository**.

2. **Commit and Push Your Local Code**:
   In your terminal / PowerShell in `d:\demo`:
   ```bash
   git add .
   git commit -m "feat: complete demo site with supabase backend and vercel deployment readiness"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```
   *(Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPO_NAME>` with your actual GitHub username and repository name).*

---

## Step 4: Deploy to Vercel via GitHub

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** &gt; **Project**.
   - Under **Import Git Repository**, find your `nexus-entry-hub` repository and click **Import**.

2. **Configure Project Settings**:
   - **Framework Preset**: Next.js (detected automatically).
   - **Root Directory**: `./` (leave default).

3. **Add Environment Variables**:
   Expand the **Environment Variables** section and add both keys:
   - **Key 1**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: Your Supabase project URL (`https://your-project-id.supabase.co`)
   - **Key 2**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value**: Your Supabase anon public key

4. **Click Deploy**:
   - Click the blue **Deploy** button.
   - Vercel will clone your GitHub repository, install packages, run `next build`, and deploy to its global Edge network in under a minute!

---

## 🚀 Continuous Deployment (CI/CD)

Whenever you push new commits to your `main` branch on GitHub:
```bash
git add .
git commit -m "feat: your new feature"
git push
```
Vercel will **automatically trigger a new production build** and deploy your updates with zero downtime. Pull requests will also automatically receive live preview deployments!
