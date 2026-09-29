# AGENTS.md

## Source of truth

Use the following sources in order when determining the authorized scope and intended result:

1. The currently approved GitHub Issue
2. An approved Spec
3. Relevant ADRs and `CONTEXT.md`
4. Current code and repository configuration
5. Historical project documents

This order does not authorize silently resolving contradictions. Report the conflicting sources, the current observable state, and the decision required from the user before continuing.

## Repository references

### Issue and pull request work

GitHub Issues authorize and track repository work. Read `docs/agents/issue-tracker.md` before creating, updating, implementing, or closing an Issue, or creating or updating a Pull Request.

### Triage

Use the canonical triage roles in `docs/agents/triage-labels.md` when triaging incoming requests.

### Domain language and decisions

Read `CONTEXT.md` and relevant files under `docs/adr/` before changing domain language or an established technical boundary. Follow `docs/agents/domain.md`.

### Resumed work

At the beginning of a resumed session, read `status.md` and verify it against the current branch, working tree, active Issue, and approved artifacts. Treat `status.md` as a current-state snapshot, not a history.

## Project invariants

This repository is a portfolio mock demo of the original team project.

The production backend is no longer a runtime dependency. Prioritize a stable reviewer-facing demo over production feature parity and large refactors.

Keep the existing Vite React SPA. A framework migration is separate work and requires an explicitly approved Issue.

Use npm and the tracked `package-lock.json`. Treat a package-manager change as separate approved work.

## Work selection and approval

### Trivial changes

A low-risk, single-purpose copy or configuration change with an obvious verification method does not require a full planning flow. Inspect the affected source, state the scope and verification method, make the smallest change, and verify it.

### Single-session work

For work that fits in one session, agree with the user on the scope and verification method before implementation.

### Multi-session work

For work that requires multiple sessions, recommend the appropriate user-invoked flow, normally:

`/grill-with-docs` → `/to-spec` → `/to-tickets`

Skills marked for user invocation are never started automatically. Recommend the next skill and wait for the user to invoke it.

### Issue boundaries

Split work into independently verifiable vertical slices, not files, layers, or technical components.

Present proposed Issue boundaries before creating them. Create or implement them only after user approval.

Work on one approved Issue at a time. Start implementation only when the user explicitly requests that Issue, and use a fresh agent session for each implementation Issue.

Do not automatically start the next Issue after completing the current one.

## Demo runtime boundaries

Core demo flows must remain usable without the retired production backend.

Use MSW for HTTP APIs in the demo. Enable demo mode through `VITE_ENABLE_MSW`.

An explicitly approved WebSocket feature may use a narrowly scoped demo server when MSW cannot provide the required transport. The supporting service must be isolated so its outage does not prevent use of the core demo.

Optional external services must fail independently from the core demo.

Group MSW handlers by domain. Keep mock data separate from handlers, and keep the root handler module limited to composition.

Keep mock responses aligned with the existing API contract and TypeScript types. Reuse existing types where practical instead of weakening type safety or duplicating contracts.

Provide loading, empty, error, and unavailable-service states where they are observable in an approved user flow.

Prefer free infrastructure. Obtain approval before introducing a paid service or a cost-bearing runtime dependency.

Never commit secrets, production credentials, or real user data.

Do not publish unverified performance, usage, or reliability claims.

## Code rules

Preserve the existing project structure unless the approved Issue requires a change.

Keep changes scoped to the active Issue and avoid unrelated cleanup.

Reuse existing types and utilities before adding new ones.

Avoid `any` unless the boundary cannot be typed more precisely and the reason is documented.

Do not replace working behavior without explaining the affected invariant and verifying the replacement.

## Verification

Read `package.json` before choosing commands. Use only scripts and tools that exist in the repository.

### Build and TypeScript

Run `npm run build` when TypeScript or production bundling can be affected.

`npm run build` runs `tsc -b && vite build`; report it as combined TypeScript and production build verification. There is no standalone `typecheck` script.

### ESLint

Run the repository-local ESLint against changed source files when possible:

`npx --no-install eslint [changed-files...]`

Use `npm run lint` for the full repository. Report existing full-lint failures separately from failures introduced by the changed files.

### Automated tests

The repository currently has no test script or configured test runner. Report automated tests as unavailable rather than claiming they passed.

Before adding test tooling, agree with the user on the behavior boundary the tests must protect.

### Browser verification

Verify every user-visible flow changed by the active Issue.

Record:

- the route and scenario checked
- loading, empty, error, and fallback behavior when relevant
- browser console errors
- unexpected network requests
- nested-route refresh behavior when routing or deployment changes
- behavior when an optional external service is unavailable

If a check cannot run, report the check, reason, and remaining risk.

Never claim a result that was not observed in the current work or preserved in an approved artifact.

## Completion and approval

After implementing an Issue, report:

- completed outcome and mapped requirements
- the most important changed files and their responsibilities
- build, TypeScript, changed-file ESLint, and full-lint results
- automated tests run or why they were unavailable
- browser verification results
- commit status
- remaining risks and deferred findings

Then stop and wait for user approval.

Do not push, create a Pull Request, merge, close an Issue, or start another Issue without explicit user approval.

## Commit rules

Use Conventional Commits with an appropriate Gitmoji.

Keep one logical change per commit and keep commit titles concise.
