# MADAR Agent Operating Guide

## Authority and precedence

The SRS V1.2 is the product/business authority. V5 is the execution and ownership authority. `[A]` prevails; `[D]` is engineering detail; `[C]` remains configurable without invented values; `[V]` requires validation; `[V2]` is out of V1. Conflicts require a documented gap/ADR, not a silent resolution.

## Boundaries

- Work only within the path ownership in `planning/component-ownership.md` and V5.
- A7 alone changes shared contracts, migrations, root configuration, CI, or infrastructure.
- No cross-schema writes: Location owns GPS, Booking bookings, Wallet balances/ledger, Queue queue order.
- Admin-only employee creation; authorized station owner-only queue check-in with geofence; no direct wallet balance edit; no unsupported P2P.

## Execution protocol

Before work: read SRS/V5 and the relevant RTM rows; inspect status and existing files; state REQ IDs, dependencies, owner, paths, and test plan. Contract first: A0 proposes, domain owner reviews, A7 publishes, A6 verifies. Use one worktree/branch per agent. Do not edit another owner’s paths without handoff and ADR.

## Quality, security, evidence

For every task record POS, NEG, BND, SEC, CON, IDE, FAIL, AUD, CTR, UI, and PERF applicability. Do not mark PASS without executed evidence. Use DB-level concurrency tests for capacity/financial invariants. Require authentication, authorization/scope, correlation IDs, idempotency, state versioning where applicable, audit records, and secret/PII-safe logs. Open decisions block activation, not necessarily mocks or independent development.

## Definition of done and handoff

A change needs REQ/BR references, permitted diff, tests/evidence, security and failure notes, migration/rollback assessment, changelog, and successor handoff. Stop and escalate for an `[A]` conflict, missing business approval, legal/provider dependency, path conflict, or a critical/high unresolved security issue on an enabled flow.

## Forbidden operations

Do not alter the authoritative SRS/V5 without explicit user approval. Do not invent policy values, activation claims, production-provider success, government authorization, HA, or continuous PWA background GPS. Do not force-push, reset/clean destructively, delete user files, bypass reviews, or begin a dependent sprint before its gate.

## S02 repository workflow

- Startup checklist. Check the active branch, worktree and diff. Read the sprint ticket, applicable
  requirements and `ownership.json`. Match the reviewed GitHub task grant to the intended scope.
- Create one sibling worktree per agent with `node tools/worktrees.mjs add PATH a7/sprint-id`.
  Use `list` and `report` to inspect active branches, dirty paths and conflicts. Removal requires
  a clean linked worktree and explicit `--approved-clean`. A branch name is a local convention.
- A7 integrates shared packages, tooling, CI and central configuration. A0 owns planning. A6 owns
  QA tests and signs off independently. Domain and app agents use their assigned paths and obtain
  a reviewed handoff before changes to another agent's paths.
- Match `.node-version` and `packageManager`. Run `pnpm install --frozen-lockfile`,
  `pnpm exec playwright install chromium`, then `pnpm verify:s02`. Use recursive workspace scripts
  and local package filters from this root. CI checks formatting with `pnpm format:check`.
- Attach command, commit SHA, exit code, artifact, positive and negative tests, and rollback or
  handoff context. Require independent A6 evidence on the integrated revision. Separate the S02
  foundation status from the S01 contract status.
- Failure escalation. Keep a failing or skipped mandatory gate visible. Escalate policy changes
  and missing permissions to the repository owner. Preserve the base revision's ownership policy
  when assessing a PR. Bootstrap branch protection requires owner review.
- V5 dependencies are S00 → S01 and S00 → S02. S01 + S02 → S03 requires both acceptance gates.
- OPEN decisions retain their recorded status until the authorized decision owner approves them.
