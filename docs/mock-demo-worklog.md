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
| 8. Search MSW handlers | Implemented / needs browser verification | Added in-memory idol bookmark state and MSW handlers for `/search` idol list/search and idol bookmark add/remove. Mocked endpoints: `GET */idols/`, `GET */bookmarks/idols/`, `GET */bookmarks/groups/`, `POST */bookmarks/idols/`, `DELETE */bookmarks/idols/:bookmarkId/`. | `src/mocks/data/bookmarks.ts`, `src/mocks/handlers/bookmarks.ts`, `src/mocks/handlers/idols.ts`, `src/mocks/handlers.ts` | Build passed; targeted ESLint passed. Browser/network verification still needed. |
| 9. UX/routing inspection | Planned | Inspected demo login UX, root route behavior, `/search` bookmark removal, and idol detail blank/back behavior before implementation. | `src/pages/Login.tsx`, `src/App.tsx`, `src/pages/idolSearch/useIdolSearch.ts`, `src/pages/main/fan/*` | Inspection only. |
| 10. UX stabilization | Implemented / needs browser verification | Added demo login button, root redirect for logged-in fan users, stable favorite cards on `/search`, and idol detail loading/error fallback UI. | `src/pages/Login.tsx`, `src/App.tsx`, `src/pages/idolSearch/useIdolSearch.ts`, `src/pages/main/fan/*` | Build passed; targeted ESLint passed. Browser verification still needed. |
| 11. Fan detail crash guard | Implemented / needs browser verification | Hardened fan detail data mapping so missing or malformed bookmark/schedule API data does not throw before fallback UI can render. | `src/pages/main/fan/hooks/useFanMainData.ts`, `src/pages/main/fan/FanMainPage.tsx` | Build passed; targeted ESLint passed. Browser verification still needed. |

## Current Verified Status

- `npm run build` passed after auth mock step.
- Targeted ESLint passed for auth-related changed files.
- Demo login succeeded with `test@test.com` / `test123!`.
- No terminal or browser console errors were found during login test.
- Full lint still has unrelated existing issues.
- Search mock TypeScript files passed targeted ESLint.
- UX stabilization changed files passed targeted ESLint.
- Fan detail crash guard changed files passed targeted ESLint.
- `/search` MSW browser/network flow is not fully verified in the current context.
- UX stabilization browser behavior is not fully verified in the current context.
- Fan detail crash guard browser behavior is not fully verified in the current context.

## Remaining Risks

- `/search` browser/network behavior still needs verification.
- Existing old mock paths may not match current API paths.
- `onUnhandledRequest: 'bypass'` can hide missing mocks.
- Chat uses WebSocket and remains excluded.
- Idol detail and schedule MSW handlers are still not implemented.

## Next Step

Verify the UX stabilization in browser, then prepare idol detail and schedule MSW mocks.
