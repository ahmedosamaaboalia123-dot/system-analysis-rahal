# S00 Ownership Proposal

The proposal mirrors V5 and is a file-write boundary, not a change to business authority.

| Agent | Responsibility | Allowed paths | Forbidden boundary |
|---|---|---|---|
| A0 | Architecture, requirements, governance | `docs/specs/`, `docs/architecture/`, `planning/` | Production code and migrations |
| A1 | Identity, organization, compliance, complaints, investigation | specified V5 A1 backend paths | Wallet, Queue, shared contracts |
| A2 | Vehicles, routes, stations, trips, location, booking | specified V5 A2 backend paths | Wallet, migrations, UI |
| A3 | Wallet, platform management, pricing, tasks, notifications | specified V5 A3 backend paths | Booking tables, UI |
| A4 | Passenger and driver UX | `apps/passenger-pwa/`, `apps/driver-pwa/` | Backend and contracts |
| A5 | Station/Admin UX | V5 A5 app paths | Backend and contracts |
| A6 | QA and security | `tests/`, `qa/`, `security/reports/` | Production code |
| A7 | Contracts, DB, infrastructure and root configuration | V5 A7 paths | Domain business logic |

## Coordination rules

- One agent per branch/worktree; no shared write path.
- A0 proposes contracts; domain owner reviews; A7 publishes; A6 writes contract tests; provider and consumer follow.
- A7 alone integrates shared contracts, migrations, and root configuration.
- Every PR identifies REQ IDs, allowed paths, evidence, rollback impact, security notes, changelog, and handoff.
- A path overlap or ownership change requires an ADR and explicit handoff; never silent editing.