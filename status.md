# Workflow Status

> Updated: 2026-09-30 21:15 KST

## Current state

* Status: review
* Stage: Pull Request #14 open; awaiting review

## Active work

* Issue: [#7](https://github.com/sysysysyb/moyeoradingding/issues/7)
* Branch: `fix/7-msw-http-demo`
* Pull Request: [#14](https://github.com/sysysysyb/moyeoradingding/pull/14)
* Plan: [Approved Spec #4](https://github.com/sysysysyb/moyeoradingding/issues/4)
* Design: None

## Current checkpoint

* Last completed: Pushed the Issue #7 branch and opened Pull Request #14
* Latest verification: default development, explicit opt-out, production build, and production-preview role flows — passed

## Review focus

* `src/main.tsx::enableMocking` — MSW defaults on and only explicit `false` disables it
* `src/mocks/handlers/schedules.ts::scheduleHandlers` — exact API paths cover IDOL and NORMAL schedule flows
* `src/mocks/handlers.ts::handlers` — root module contains composition only

## Remaining risk

* `npm audit --omit=dev` reports 9 advisories; observed static-demo paths do not expose the known attack inputs, so dependency refresh is deferred.

## Blockers

* None

## Next action

* Owner: User
* Action: Review Pull Request #14.
