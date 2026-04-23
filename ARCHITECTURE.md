# Architecture Note

## Overview

Ajaia Docs is a lightweight collaborative document editor built with Next.js, TipTap, and Supabase. The architecture prioritizes a usable editing experience, working persistence, and a functional sharing model within a tight timebox.

## Key Decisions

### 1. TipTap for Rich Text Editing

TipTap was chosen over alternatives (Draft.js, Slate, Quill) for three reasons: it has the best React integration, its extension system makes it easy to add formatting capabilities incrementally, and it stores content as structured HTML that persists cleanly. The StarterKit extension provides bold, italic, headings, and lists out of the box. Underline was added as a separate extension.

**Tradeoff:** TipTap adds bundle weight, but the editing experience is significantly better than building a custom contenteditable implementation.

### 2. Supabase for Persistence

Supabase provides hosted PostgreSQL with a generous free tier. This avoids the deployment complexity of running a separate database and gives us relational integrity (foreign keys between users, documents, and shares) without infrastructure management.

**Tradeoff:** Requires external account setup. Mitigated by including the full SQL schema and clear setup instructions.

### 3. Simulated Authentication

Rather than implementing a full auth system (which would consume significant time without adding product value for this assessment), the app uses seeded user accounts with click-to-login. Current user is stored in localStorage.

**Tradeoff:** No security. Acceptable for a demo but would need real auth (Supabase Auth or similar) for production.

### 4. Auto-Save with Debounce

Documents auto-save 1.5 seconds after the user stops typing. This provides a Google Docs-like experience without requiring a manual save button. Save status is displayed in the header.

### 5. File Upload as Document Import

Uploaded .txt and .md files are converted to HTML and created as new documents. Markdown headings are converted to their HTML equivalents. This was chosen over an "attachment" model because creating editable documents from uploaded content is more product-useful.

## What I Prioritized

1. **Editing experience** — The editor should feel good to use. Formatting toolbar, auto-save, and clean styling were prioritized over feature breadth.
2. **Sharing model** — Owner/shared distinction is visible in the UI, sharing is functional end-to-end, and the data model supports it correctly.
3. **Persistence** — Documents survive refresh, formatting is preserved, shares are durable.
4. **Code clarity** — Components are separated by concern, API routes follow RESTful conventions, and the codebase is readable.

## What I Deprioritized

1. **Real authentication** — Simulated with seeded users and localStorage.
2. **Real-time collaboration** — Documents are single-editor. No WebSocket sync.
3. **Rich markdown parsing** — Upload converts headings and paragraphs but not bold, italic, links, or nested lists.
4. **Comprehensive error handling** — Happy path is solid; edge cases have basic handling.
5. **Mobile responsiveness** — Desktop-first layout.

## What I Would Build Next (2-4 Hours)

1. **Revoke sharing** — Add ability to remove a user's access from the share modal.
2. **Document version history** — Store snapshots on save, display a version timeline.
3. **Export to Markdown/PDF** — Convert TipTap HTML content back to downloadable formats.
4. **Real auth with Supabase Auth** — Replace localStorage user selection with email/password login.
5. **Richer file import** — Support .docx via a library like mammoth.js.

## Data Model

```
users
├── id (UUID, PK)
├── name (TEXT)
├── email (TEXT, UNIQUE)
└── created_at (TIMESTAMPTZ)

documents
├── id (UUID, PK)
├── title (TEXT)
├── content (TEXT, HTML)
├── owner_id (UUID, FK → users.id)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

shares
├── id (UUID, PK)
├── document_id (UUID, FK → documents.id, CASCADE DELETE)
├── user_id (UUID, FK → users.id)
├── created_at (TIMESTAMPTZ)
└── UNIQUE(document_id, user_id)
```
