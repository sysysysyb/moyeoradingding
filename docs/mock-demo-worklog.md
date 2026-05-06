# Portfolio Mock Demo Worklog

## Context

This fork is a portfolio mock-demo version of the original team project. The production backend is no longer running, so MSW is used to make the frontend demo work without a live backend.

The first priority is a stable, reviewer-friendly deployed demo. The goal is not full feature parity with the original production service.

## Demo Scope

### Included in first demo

- Demo login
- Search
- Idol detail
- Schedules
- Bookmarks
- My page

### Excluded from first demo

- Chat/WebSocket
- Real OAuth
- Admin detail routes
- Real file upload
- External production services
- Next.js migration

## Progress Summary

| Step | Status | Summary | Key files | Verification |
| --- | --- | --- | --- | --- |
| 1. `AGENTS.md` setup | Done | Added repo-specific rules for MSW, demo scope, deployment, TypeScript, verification, and commits. | `AGENTS.md` | Not separately verified in current context. |
| 2. Project/API inspection | Done | Confirmed Vite React SPA, routing, API modules, auth flow, and backend-dependent pages. | `src/App.tsx`, `src/api/*`, `src/mocks/*` | Inspection only. |
| 3. Demo scope definition | Done | Chose the fan flow as the first demo path and deferred risky/nonessential features. | Planning only | No command verification needed. |
| 4. MSW readiness inspection | Done | Confirmed MSW is installed and worker exists; startup was commented out and handlers had path mismatches. | `package.json`, `public/mockServiceWorker.js`, `src/main.tsx`, `src/mocks/browser.ts` | Inspection only. |
| 5. MSW env startup | Done | Enabled MSW only when `VITE_ENABLE_MSW=true`, using Vite env access and existing browser worker. | `src/main.tsx`, `src/vite-env.d.ts`, `.env.example` | Verified together with auth step. |
| 6. Demo auth mock | Done | Added demo login user and auth handlers for login, mypage profile fetch, and logout. | `src/mocks/data/auth.ts`, `src/mocks/handlers/auth.ts`, `src/mocks/handlers.ts` | Build passed; targeted ESLint passed; login verified. |
| 7. Search page mock support | Incomplete / needs verification | Current repo state does not confirm wildcard handlers for `/idols/`, `/bookmarks/idols/`, or `/bookmarks/groups/`. `/search` may still hit the backend. | `src/pages/idolSearch/*`, `src/api/idolApi.ts`, `src/api/bookmarkIdolApi.ts`, `src/mocks/handlers.ts` | Not fully verified in current context. |

## Current Verified Status

- `npm run build` passed after auth mock step.
- Targeted ESLint passed for auth-related changed files.
- Demo login succeeded with `test@test.com` / `test123!`.
- No terminal or browser console errors were found during login test.
- Full lint still has unrelated existing issues.
- `/search` MSW flow is not fully verified in the current context.

## Remaining Risks

- Missing or unverified `/search` handlers may still allow backend requests.
- Existing old mock paths may not match current API paths.
- `onUnhandledRequest: 'bypass'` can hide missing mocks.
- Chat uses WebSocket and remains excluded.

## Next Step

Verify or complete `/search` MSW support before moving to idol detail and schedule mocks.
