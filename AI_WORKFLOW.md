# AI-Native Workflow Note

## Tools Used

- **Claude (Anthropic)** — Primary AI assistant for code generation, architecture decisions, and documentation drafting.
- **Manual review and editing** — All AI-generated output was reviewed, tested, and modified before inclusion.

## Where AI Materially Sped Up Work

1. **Project scaffolding:** AI generated the initial project structure, package.json, and configuration files (Next.js, Tailwind, PostCSS), saving approximately 30 minutes of boilerplate setup.

2. **API route generation:** The CRUD routes for documents, sharing, and file upload were drafted by AI and then reviewed for correctness. The relational logic (joins between documents, shares, and users) required manual adjustment to match Supabase's query syntax.

3. **TipTap integration:** AI provided the editor component structure and toolbar wiring. The extension configuration and menu button pattern were generated and then refined for UX quality (using onMouseDown instead of onClick to prevent editor blur).

4. **SQL schema:** The database schema including foreign keys, unique constraints, and seed data was generated in one pass and required only minor adjustments (adding CASCADE delete on shares).

5. **Documentation:** Architecture notes, README, and this workflow document were drafted with AI assistance and edited for accuracy and tone.

## What I Changed or Rejected

1. **Initial auth approach:** AI suggested implementing Supabase Auth with email/password. I rejected this in favor of simulated auth (click-to-select user) because real auth would consume significant time without demonstrating product judgment. The scope cut was a deliberate prioritization decision.

2. **File upload strategy:** AI initially generated an attachment-based upload model (files stored as blobs associated with documents). I redirected toward a document-import model (uploaded files become new editable documents) because it's more product-useful and demonstrates better judgment about what users actually want.

3. **Database queries:** AI-generated Supabase queries for the shared documents view needed restructuring. The initial approach used a subquery pattern that Supabase's JS client doesn't support well. I restructured it into two sequential queries (fetch share IDs, then fetch documents by IDs).

4. **CSS and styling:** AI-generated Tailwind classes were mostly correct but needed adjustment for visual hierarchy, spacing, and the TipTap editor's content rendering (prose styles for headings, lists, etc.).

5. **Error messages:** AI-generated generic error messages were replaced with specific, user-facing messages (e.g., "Only .txt and .md files are supported" instead of "Invalid file type").

## How I Verified Correctness

1. **Manual testing:** Each feature was tested end-to-end in the browser: document creation, editing, rename, delete, sharing between users, file upload, and persistence across refresh.

2. **Automated tests:** Unit tests validate file upload type checking and markdown-to-HTML conversion logic.

3. **Cross-user verification:** Logged in as each seeded user to verify that owned and shared documents display correctly and that sharing permissions work as expected.

4. **Edge cases checked:** Empty documents, very long titles, uploading unsupported file types, sharing with a user who already has access (unique constraint handling).

## Principle

AI was used as an accelerator, not a replacement for judgment. Every architectural decision (auth model, file upload behavior, auto-save timing, scope cuts) was made deliberately. AI generated the implementation; I owned the product decisions.
