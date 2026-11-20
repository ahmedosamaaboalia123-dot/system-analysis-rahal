# S02 implementation report

## Scope

V5 S02 implements the shared engineering foundation. SRS DEP-005, NFR-X11, and NFR-X14
motivate reproducible quality checks and public contract boundaries. S00 is the entry gate.
S01 contract findings remain visible through their separate gate. A0 provided planning
artifacts in `282dba0`. A6 authored fixture tests in `5343aaf`.

## Local commands

1. Select Node from `.node-version` and pnpm from `package.json`.
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm exec playwright install --only-shell chromium`.
4. Run `pnpm verify:s02`. This runs workspace, scripts, ownership, security, TypeScript, lint,
   formatting, unit tests, build, Chromium, and controlled negative tests.
5. Run `pnpm check:contracts` separately. Its Redocly result and the outstanding S01 gate are
   distinct from S02 foundation checks.
6. Run `pwsh -NoProfile -File tools/run-s02-evidence.ps1` for logs and machine-readable results
   under `artifacts/s02/local/`. Use `-Profile fresh-clone` after installing Chromium in a fresh clone.

The test fixture serves only `127.0.0.1:4173` in its browser mode. Unit tests allocate an ephemeral
loopback port. Build output and test artifacts are ignored. Public contract fixtures tested by the
boundary checker live in disposable repositories.

The pinned Windows installer encountered concurrent directory renames with both hard links and
copy imports in the isolated linker. S02 uses pnpm's hoisted linker while keeping declared
workspace dependencies and explicit source boundaries.

## Worktrees and PR trust

Run `node tools/worktrees.mjs list` and `node tools/worktrees.mjs report` to inspect active worktrees
and overlapping modifications. Use `node tools/worktrees.mjs add ../madar-a7-s02 a7/s02` for a new
worktree. To remove an explicitly approved clean linked worktree use
`node tools/worktrees.mjs remove ../madar-a7-s02 --approved-clean`.

The PR ownership job executes checker code and reads task grants from the trusted base commit.
It evaluates the Git merge-base diff against the approved scope, including both sides of renames.
Policy changes require the repository owner's approval at the reviewed head. The initial base
branch lacks the checker, so its bootstrap needs repository-owner review.

## Initial protection

In GitHub Settings → Rules → Rulesets, create an active branch ruleset for `main`. Require PR
review and code-owner review where available, dismiss stale approvals, require
`S02_FOUNDATION_QUALITY`, and block force pushes. Select the GitHub Actions check source.
Enable the required ownership check once the trusted base contains the checker. Keep the
separate `S01_CONTRACT_QUALITY` visible for S01 closure and downstream contract integration.
Verify the active rules and status-check identity on an actual non-merged PR after bootstrap.

## Rollback

The implementation is on the S02 development branch. Revert the scoped S02 commits through a
reviewed PR if needed. Worktree removal is optional and requires approval and a clean status.
