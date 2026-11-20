# S00 Handoff

## S01 — Contracts and Threat Model

Start with the domain boundaries and source-of-truth matrix. Generate versioned detailed OpenAPI for the critical contracts listed in SRS section 31.2; enforce authorization, correlation IDs, idempotency, expected version where applicable, and no client-supplied final money values. Threat-model IDOR, tenant scope, OTP abuse, replay, event duplication, PII leakage, evidence access, and failure-before/after-commit. Carry OPEN-05, OPEN-06, OPEN-07, and OPEN-08 as activation constraints.

## S02 — Monorepo and Quality Foundation

Use the ownership proposal, AGENTS.md, and V5 path boundaries. Establish worktrees/branches, CODEOWNERS/ownership enforcement, contract-first publication, test organization, CI documentation checks, and evidence/rollback templates. A7 owns shared contracts, migrations and root configuration. No S00 document authorizes bypassing those boundaries.

## S00 outputs to consume

`RTM.csv`, `source-of-truth-matrix.md`, `ownership-proposal.md`, `gap-analysis.md`, `decisions.md`, and `AGENTS.md`. Fields marked `UNRESOLVED` must become explicit contracts/decisions rather than assumptions.