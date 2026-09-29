# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- Create, read, update, label, comment on, and close issues with `gh issue`.
- Infer the repository from the configured Git remote.
- Use GitHub Issues whenever a skill says to publish or fetch a ticket.

## Writing conventions

- Write Issue and Pull Request titles and bodies in Korean. Keep proper nouns, Conventional Commit types, and code identifiers in English when that is clearer.
- Write Issue titles without emoji.
- Write Pull Request titles as `<Gitmoji> <Type>: <Korean summary>`. Match the Gitmoji and Conventional Commit type to the primary change.

## Labels

- On Issue creation, apply every currently applicable no-emoji triage label defined in `triage-labels.md`. Use `needs-triage` when maintainer review is still required, and remove labels whose state is no longer true.
- On Pull Requests, apply every applicable emoji-prefixed category label from the repository's current GitHub labels. Run `gh label list` before choosing rather than caching the label set in this document.

## Pull requests as a triage surface

**PRs as a request surface: no.**

GitHub shares one number space across issues and pull requests. Resolve an ambiguous number with `gh pr view <number>` and fall back to `gh issue view <number>`.

## Wayfinding operations

The map is one issue labelled `wayfinder:map`; its child issues are tickets.

- Link tickets with GitHub sub-issues when available.
- Otherwise, use a task list in the map and add `Part of #<map>` to each child.
- Represent blockers with native issue dependencies when available.
- Claim work by assigning the selected issue to the current user.
- Resolve work by commenting with the result, closing the child issue, and updating the map.
