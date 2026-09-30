# Workflow Status

> Updated: 2026-09-30 14:24 KST

## Current state

* Status: review
* Stage: Pull Request #13 open; awaiting review

## Active work

* Issue: [#6](https://github.com/sysysysyb/moyeoradingding/issues/6)
* Branch: `refactor/6-api-base-url`
* Pull Request: [#13](https://github.com/sysysysyb/moyeoradingding/pull/13)
* Plan: [Approved Spec #4](https://github.com/sysysysyb/moyeoradingding/issues/4)
* Design: None

## Current checkpoint

* Last completed: Pushed Issue #6 and opened Pull Request #13
* Latest verification: changed-file ESLint, `npm run lint`, MSW-enabled `npm run build`, and production-preview browser flow — passed

## Review focus

* `src/api/config.ts::API_BASE_URL` — single default and trailing-slash normalization
* `src/api/axiosInstance.ts::axiosInstance` — shared request base path and refresh request
* `src/utils/toAbsolute.ts::toAbsolute` — media URL origin derived from the API base path

## Remaining risk

* `npm audit --omit=dev` reports 9 advisories; observed static-demo paths do not expose the known attack inputs, so dependency refresh is deferred.

## Blockers

* None

## Next action

* Owner: User
* Action: Review Pull Request #13.
