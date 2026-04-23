# Ajaia Docs

A lightweight collaborative document editor built as part of the Ajaia Technical Program Manager assessment.

## Live Demo

**URL:** https://ajaia-docs-khaki.vercel.app

### Test Accounts

The app uses seeded users (no passwords required). Click any user to log in:

| Name | Email |
|------|-------|
| Alice Chen | alice@ajaia.com |
| Bob Martinez | bob@ajaia.com |
| Carol Wright | carol@ajaia.com |

### Testing the Sharing Flow

1. Log in as **Alice**
2. Create a document and add some content
3. Click **Share** and share with Bob
4. Click **Switch User**, log in as **Bob**
5. The document appears under "Shared with Me"
6. Bob can open and edit the shared document

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TipTap rich text editor, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Local Setup

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account

### Steps

1. **Clone the repo**
   ```bash
   git clone https://github.com/countingaces/ajaia-docs.git
   cd ajaia-docs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to **SQL Editor** and run the contents of `supabase-setup.sql`
   - Go to **Settings → API** and copy your Project URL and anon/public key

4. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials.

5. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

6. **Run tests**
   ```bash
   npm test
   ```

## Supported File Uploads

- `.txt` files (converted to HTML paragraphs)
- `.md` files (headings and paragraphs converted to HTML)

## Deliberate Scope Decisions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details on what was prioritized, what was deprioritized, and why.
