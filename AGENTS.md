# AGENTS.md

## Goal

This fork is a portfolio mock-demo version of the original team project.

The production backend is no longer running, so the main goal is to make the frontend demo work without a live backend by using MSW.

Prioritize a stable deployed demo over large refactors.

## Workflow Rules

- Do not edit code immediately.
- Inspect relevant files first.
- Propose a short plan before making changes.
- Keep changes small and reviewable.
- Preserve the existing project structure unless there is a clear reason to change it.
- Explain why before replacing existing working logic.
- For broad or risky tasks, split the work into smaller steps.

## MSW Rules

- Use MSW for API mocking.
- Group handlers by domain.
- Keep mock data separate from handlers.
- Do not hardcode mock data inside UI components.
- Make mock data match the existing API contract and TypeScript types.
- Mock the main portfolio demo flow first.
- Include success, empty, loading, and error cases when useful.

## Portfolio Demo Rules

- The deployed demo must work without a real backend.
- Do not require unavailable services such as real OAuth, payment, or file storage.
- If authentication is needed, provide a demo login flow.
- Avoid broken links, blank screens, and console errors.
- Add fallback UI for loading, empty, and error states.
- Clearly document that this is a mock demo version.
- Do not invent metrics or document unverified results.

## Deployment Rules

- Control MSW demo mode with an environment variable when possible.
- Avoid changes that require paid infrastructure.
- Do not commit secrets or real production credentials.
- If this is a Vite SPA, check refresh behavior on nested routes before deployment.

## Framework Rules

- Do not migrate this project to Next.js unless explicitly requested.
- Treat Next.js migration as a separate experimental task.
- Stabilize the existing frontend project first.

## TypeScript Rules

- Preserve existing API response types where possible.
- Avoid `any` unless there is a clear reason.
- Do not weaken type safety just to make mock data pass.
- Reuse existing types instead of duplicating new ones.

## Verification Rules

After changes, suggest or run the most relevant checks:

- type check
- lint
- build
- local preview

Do not claim something works unless it was verified or the limitation is clearly stated.

## Commit Rules

- Use Conventional Commits with Gitmoji.
- Keep one logical change per commit.
- Keep commit titles concise.

Example:

```txt
✨ Feat: MSW mock 환경 구성 (#1)