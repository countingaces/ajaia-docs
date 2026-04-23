# Submission Manifest

## Candidate

- **Name:** Ryan Gould
- **Email:** ryan.harrison.gould@gmail.com
- **Role:** Technical Program and Project Manager, AI Delivery

## Deliverables

| Item | Location | Status |
|------|----------|--------|
| Source code | This repository | Complete |
| README.md | [README.md](./README.md) | Complete |
| Architecture note | [ARCHITECTURE.md](./ARCHITECTURE.md) | Complete |
| AI workflow note | [AI_WORKFLOW.md](./AI_WORKFLOW.md) | Complete |
| Submission manifest | [SUBMISSION.md](./SUBMISSION.md) (this file) | Complete |
| Supabase schema | [supabase-setup.sql](./supabase-setup.sql) | Complete |
| Automated tests | [__tests__/api.test.js](./__tests__/api.test.js) | Complete |
| Live deployment | _(URL to be added)_ | Pending |
| Walkthrough video | _(URL to be added)_ | Pending |

## Features Implemented

- [x] Document creation and editing with rich text (bold, italic, underline, H1-H3, bullet/numbered lists)
- [x] Document rename, delete
- [x] Auto-save with debounce (1.5s) and save status indicator
- [x] File upload (.txt, .md) converted to new editable documents
- [x] Sharing model: document owner can share with other users
- [x] Visible distinction between owned and shared documents
- [x] Persistence via Supabase (documents, formatting, shares survive refresh)
- [x] Simulated auth with 3 seeded users
- [x] Basic validation and error handling
- [x] Automated tests for upload validation and content conversion

## Features Intentionally Deprioritized

- [ ] Real authentication (simulated with seeded users)
- [ ] Real-time collaboration / WebSocket sync
- [ ] Revoke sharing access
- [ ] Document version history
- [ ] Export to PDF/Markdown
- [ ] Mobile-responsive layout
- [ ] Rich markdown parsing (bold, links, nested lists in uploads)

## Test Accounts

| Name | Email | No password required |
|------|-------|---------------------|
| Alice Chen | alice@ajaia.com | Click to log in |
| Bob Martinez | bob@ajaia.com | Click to log in |
| Carol Wright | carol@ajaia.com | Click to log in |

## How to Test Sharing

1. Log in as Alice
2. Create a document, add formatted content
3. Click Share, share with Bob
4. Switch User → log in as Bob
5. Document appears under "Shared with Me"
6. Bob can open and edit the document
