# S01 Handoff

## S02
Create pnpm structure preserving packages/contracts; run alidate-s01.ps1 in CI; enforce dependency rules and ownership; use strict TypeScript/JSON formatting; never alter proposed contracts without compatibility check.

## S03
Implement logical schemas by owner, local transactions/outbox/idempotency records, unique constraints/row locks/version checks from transaction/concurrency docs. A7 owns migrations. No retention/provider/fee assumptions.

## Frontends
Consume v1 OpenAPI only, fixtures, ErrorEnvelope, correlation IDs and safe pagination; never backend internals.