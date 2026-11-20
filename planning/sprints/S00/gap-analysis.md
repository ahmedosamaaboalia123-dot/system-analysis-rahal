# S00 Gap and Conflict Analysis

This register distinguishes a missing business decision from a documentation-derived engineering detail. No approved [A] rule was changed.

| Gap ID | Title | Type | Severity | Source | Affected Sprint | Status | Blocking scope | Proposed resolution / authority |
|---|---|---|---|---|---|---|---|---|
| GAP-001 | Overlapping discount/fee ordering is undecided | Decision gap | HIGH | OPEN-01 | S14, S16, S17 | OPEN | Commercial pricing activation | Versioned policy engine rejects conflicting configuration; Product/business owner approves order |
| GAP-002 | Numeric fees, durations, and limits are absent | Decision gap | HIGH | OPEN-02 | S10, S15-S17 | OPEN | Activated commercial flows | Versioned configuration and labelled fixtures; business owner approves values |
| GAP-003 | Microbus trip closure is not approved | State-machine gap | HIGH | OPEN-03 | S11 | OPEN | Microbus trip completion activation | Extensible state model only; business owner approves terminal flow |
| GAP-004 | Boarding, alighting, and no-show effects are undecided | Policy gap | HIGH | OPEN-04 | S10-S11 | OPEN | Financial/operational effects | Record events only; no automatic financial effect without approval |
| GAP-005 | Background PWA GPS reliability is unvalidated | Validation gap | MEDIUM | OPEN-05; NFR-X05 | S06, S12 | OPEN | Claims of continuous background tracking | Field test on target devices; technical owner records evidence |
| GAP-006 | Payment, OTP, and maps providers are unselected | External integration gap | HIGH | OPEN-06 | S04, S16-S17 | OPEN | Real external activation | Isolated adapters and mocks; business/procurement approval |
| GAP-007 | Retention/privacy legal policy is incomplete | Legal/security gap | CRITICAL | OPEN-07; NFR-X10 | S19, S23 | OPEN | Real sensitive-data operation / commercial launch | Legal review and approved retention/access policy |
| GAP-008 | Government integration has no agreement/authorization | External/legal gap | HIGH | OPEN-08 | S19, S23 | OPEN | Any government connection claim | Disabled integration boundary until formal authorization |
| GAP-009 | Pilot load limits are not approved | Capacity gap | MEDIUM | OPEN-09 | S22-S23 | OPEN | Pilot capacity commitment | Measure load test, then obtain operating approval |
| GAP-010 | Domain-level actor/dependency fields are unevenly explicit | Traceability gap | MEDIUM | RTM fields / SRS domain sections | S01 | OPEN | Contract and threat-model completeness, not S00 extraction | Resolve using S01 contract/use-case review; retain UNRESOLVED meanwhile |

No direct contradiction between an approved SRS rule and V5 was found in the S00 reading. Repeated requirements in the appendix are documentation traceability, not conflicting implementations. V1/V2 boundaries are consistent: V2 rooms and fleet management remain excluded.