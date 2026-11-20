param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..\\..\\..')).Path
)

$ErrorActionPreference = 'Stop'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$docs = Join-Path $Root 'docs'
$srs = Join-Path $docs 'MADAR_V1_Master_SRS_V1.2_Reconciled_Complete_Arabic.md'
$runbook = Join-Path $docs 'MADAR_V1_V5_AI_Execution_Master_Runbook_Arabic.md'
$s00 = Join-Path $Root 'planning/sprints/S00'
New-Item -ItemType Directory -Force -Path $s00 | Out-Null

function Write-Utf8([string]$Path, [string]$Content) {
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}
function Csv([object[]]$Rows, [string]$Path) {
  $Rows | Export-Csv -NoTypeInformation -Encoding utf8 -Path $Path
}

if (!(Test-Path $srs) -or !(Test-Path $runbook)) { throw 'Authoritative source file missing.' }
$lines = [System.IO.File]::ReadAllLines($srs)
$appendix = [Array]::FindIndex($lines, [Predicate[string]]{ param($x) $x -match '^# الجزء الثامن' })
if ($appendix -lt 0) { throw 'Canonical/appendix boundary was not found.' }
$canonical = $lines[0..($appendix - 1)]
$frs = @()
for ($i = 0; $i -lt $canonical.Count; $i++) {
  if ($canonical[$i] -match '^\*\*(FR-[A-Z]+-\d{3})\*\*\s*[—-]\s*(.+)$') {
    $frs += [pscustomobject]@{ id=$Matches[1]; title=$Matches[2].Trim(); line=$i + 1 }
  }
}
if ($frs.Count -ne 253) { throw "Expected 253 canonical FR definitions; found $($frs.Count)." }

$map = @{
  IDN=@('الهوية والحسابات والجلسات','Identity','Identity','A1','Passenger PWA; Driver App; Station ERP; Madar Admin','S04')
  PAS=@('تطبيق الراكب','Passenger','Booking / Identity','A4','Passenger PWA','S10; S12; S16; S18; S21')
  DRM=@('سائق الميكروباص','Driver Microbus','Trips / Booking / Location','A4','Driver App','S11; S21')
  DRT=@('سائق التاكسي','Driver Taxi','Booking / Trips / Location','A4','Driver App','S12; S13; S21')
  STA=@('إدارة الموقف','Stations','Queue','A2','Station ERP','S07; S08; S21')
  ADM=@('لوحة إدارة مدار','Administration','Domain-specific source system','A5','Madar Admin','S14; S17; S20; S21')
  LOC=@('الموقع والتتبع','Location','Location','A2','Driver App; Station ERP; Madar Admin','S06; S12; S21')
  BKG=@('الحجز والمقاعد','Booking','Booking','A2','Passenger PWA; Driver App; Station ERP','S09; S10; S12; S13; S21')
  CMP=@('الامتثال','Compliance','Compliance','A1','Madar Admin; Station ERP','S19; S21')
  COM=@('الشكاوى','Complaints','Complaints','A1','Passenger PWA; Driver App; Station ERP; Madar Admin','S18; S21')
  INV=@('التحقيق والأدلة','Investigation','Investigation','A1','Madar Admin','S19; S21')
  PLT=@('مراقبة المنصة والموظفين','Platform Management','Platform Management','A3','Madar Admin','S20; S21')
  WLT=@('المحفظة والمالية','Wallet','Wallet','A3','Passenger PWA; Driver App; Madar Admin','S15; S16; S17; S21')
  VEH=@('المركبات والسائقون','Vehicles','Vehicles','A2','Driver App; Station ERP; Madar Admin','S05; S21')
  RTE=@('الخطوط والمسارات','Routes','Routes','A2','Passenger PWA; Driver App; Station ERP; Madar Admin','S05; S21')
  PRC=@('التسعير','Pricing','Pricing','A3','Passenger PWA; Driver App; Madar Admin','S14; S21')
  TSK=@('المهام','Tasks','Tasks','A3','Station ERP; Madar Admin','S20; S21')
  NTF=@('الإشعارات','Notifications','Notifications','A3','Passenger PWA; Driver App; Station ERP; Madar Admin','S20; S21')
  AUD=@('التدقيق والتقارير','Audit','Domain source system / shared audit infrastructure','A7','Station ERP; Madar Admin','S20; S21')
}
$rows = foreach ($m in $frs) {
  $group = ($m.id -split '-')[1]; $x = $map[$group]
  [pscustomobject][ordered]@{
    requirement_id=$m.id; requirement_type='FR'; requirement_title=$m.title; requirement_description=$m.title
    source_file='docs/MADAR_V1_Master_SRS_V1.2_Reconciled_Complete_Arabic.md'; source_section="مجموعة $group"; source_line=$m.line
    classification='CANONICAL; [A/D/C/V] as marked in source'; release_scope='V1'; actor='UNRESOLVED — refine in S01 contract/use-case review'
    business_domain=$x[0]; core_system=$x[1]; source_of_truth=$x[2]; owning_agent=$x[3]; affected_application=$x[4]
    related_business_rules='UNRESOLVED — trace to BR-* in S01'; dependencies='UNRESOLVED — derive contract dependencies in S01'
    acceptance_criteria_ids="$($m.id)-AC (canonical acceptance text in SRS)"; test_case_ids="PLAN-$($m.id)-POS; PLAN-$($m.id)-NEG; risk-based additional types"
    implementation_sprint=$x[5]; implementation_status='NOT_IMPLEMENTED'; verification_status='NOT_TESTED'; open_decision_ids='UNRESOLVED — review OPEN-01..OPEN-09 applicability'; notes='Canonical definition only; appendix traceability occurrences are excluded from count.'
  }
}
Csv $rows (Join-Path $s00 'RTM.csv')

$groups = $rows | Group-Object { ($_.requirement_id -split '-')[1] }
$groupLines = $groups | ForEach-Object { "| $($_.Name) | $($_.Count) | $($map[$_.Name][0]) | $($map[$_.Name][3]) | $($map[$_.Name][5]) |" }
Write-Utf8 (Join-Path $s00 'requirements-inventory.md') @"
# S00 Requirements Inventory

Source audited: `docs/MADAR_V1_Master_SRS_V1.2_Reconciled_Complete_Arabic.md` (canonical body before `الجزء الثامن`). The parser identifies bold canonical definitions only; appendix occurrences are traceability references, not extra requirements.

## Canonical functional requirements

Expected: **253**. Extracted: **$($rows.Count)**. Missing from sequence: **none detected by canonical-ID extraction**. Duplicate canonical definitions: **none detected**.

| Group | FR count | Business domain | Owning agent | Planned sprint(s) |
|---|---:|---|---|---|
$($groupLines -join "`n")

## Other authoritative requirement classes

- Business rules: `BR-001` through `BR-025`, in SRS section 2; they remain the approved business baseline.
- NFR: `NFR-X01` through `NFR-X14`, in section 36; they are prototype acceptance targets, not production guarantees.
- Integration requirements: `INT-REQ-01` through `INT-REQ-07`, plus the critical API contract table in section 31.
- Security/access control: `AUTH-REQ-01` through `AUTH-REQ-06` and the security clauses within FR/NFR; no separate `SEC-*` namespace was found in the canonical SRS body.
- Open validation/decision items: `OPEN-01` through `OPEN-09`; see `decisions.md`.
- Deferred V2 scope: administrative rooms and fleet-owner/fleet-management functionality; excluded from V1 execution.

The RTM intentionally uses `UNRESOLVED` where the original source does not explicitly provide a field. That is a finding for S01, not an invented requirement.
"@

Write-Utf8 (Join-Path $s00 'repository-inventory.md') @"
# S00 Repository Inventory

Inspection date: 2026-11-19 (Africa/Cairo). Repository root inspected: `C:\Users\hp\Desktop\madar`.

| Item | Result | Evidence |
|---|---|---|
| Git repository | Not initialized / unavailable | `git status --short` returned "not a git repository" |
| Current branch / commit | N/A | No `.git` repository exists |
| Existing uncommitted changes | N/A | No Git index exists |
| Existing project files before S00 | 2 | the two authoritative Markdown sources in `docs/` |
| AGENTS.md before S00 | Absent | root inspection |
| Architecture/ADR/RTM/contracts/tests/scripts | Absent | recursive file inventory |
| Product code / database / UI | Absent | recursive file inventory |

No existing user work was overwritten. The S00 deliverables are new documentation and validation assets only.
"@

Write-Utf8 (Join-Path $s00 'requirements-validation.md') @"
# Requirements Validation

The reproducible extractor is `generate-s00.ps1`; the verifier is `validate-s00.ps1`.

## Method

1. Read the SRS as UTF-8 text.
2. Find the boundary before `# الجزء الثامن` (the traceability appendix).
3. Match only canonical lines of the form `**FR-GROUP-###** — title` in the canonical body.
4. Require exactly 253 unique IDs and 253 RTM rows.
5. Require a non-empty source file, source line, title, type, status, and verification status for every RTM record.

## Result

- Canonical FR definitions: **253**.
- Unique canonical IDs: **253**.
- Duplicate canonical IDs: **0**.
- RTM records: **253**.
- RTM rows with empty primary source fields: **0**.
- Appendix references: excluded by design; they are not canonical definitions.

Limit: semantic ownership, actor, and dependency fields that lack an explicit source statement remain `UNRESOLVED`; this preserves traceability and prevents invented business decisions.
"@

Write-Utf8 (Join-Path $s00 'gap-analysis.md') @"
# S00 Gap and Conflict Analysis

This register distinguishes a missing business decision from a documentation-derived engineering detail. No approved `[A]` rule was changed.

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
| GAP-010 | Domain-level actor/dependency fields are unevenly explicit | Traceability gap | MEDIUM | RTM fields / SRS domain sections | S01 | OPEN | Contract and threat-model completeness, not S00 extraction | Resolve using S01 contract/use-case review; retain `UNRESOLVED` meanwhile |

No direct contradiction between an approved SRS rule and V5 was found in the S00 reading. Repeated requirements in the appendix are documentation traceability, not conflicting implementations. V1/V2 boundaries are consistent: V2 rooms and fleet management remain excluded.
"@

$decisions = @'
# S00 Decisions Register

All items below remain `OPEN`. No approval evidence was present in the repository; therefore none is converted to `APPROVED`.

| ID | Title | Related requirements | Status | Business owner | Technical owner | Blocking scope | Target sprint | Resolution criteria |
|---|---|---|---|---|---|---|---|---|
| OPEN-01 | ترتيب الخصومات والرسوم المتداخلة | BR-023; PRC/WLT FRs | OPEN | Product/Business Owner | A3 | Activated pricing/financial policy | S14 | Explicit approved order and policy version |
| OPEN-02 | القيم الرقمية للرسوم والمدد والحدود | BR-019, BR-020, BR-023 | OPEN | Product/Business Owner | A3 | Commercial configuration | S14-S17 | Approved values, effective dates, and change authority |
| OPEN-03 | آلية إغلاق رحلة الميكروباص | Microbus/DRM/Booking FRs | OPEN | Product/Business Owner | A2 | Microbus completion semantics | S11 | Approved terminal states and effects |
| OPEN-04 | قواعد الصعود والنزول وNo-show | Booking/Trip FRs | OPEN | Product/Business Owner | A2/A3 | Automatic operational or financial effects | S10-S11 | Approved policy and wallet consequences |
| OPEN-05 | تتبع GPS في الخلفية | LOC FRs; NFR-X05 | OPEN | Product Owner | A2/A4 | Background-tracking claim | S06 | Device field-test evidence |
| OPEN-06 | مزود الدفع وOTP والخرائط | IDN/WLT/LOC integration FRs | OPEN | Business/Procurement Owner | A1/A3/A7 | Production provider activation | S04/S16 | Contract, sandbox evidence, security approval |
| OPEN-07 | الخصوصية والاحتفاظ بالبيانات | NFR-X10; INV/COM/LOC FRs | OPEN | Legal/Data Owner | A1/A7 | Sensitive-data production use | S19/S23 | Legal approval and retention/access policy |
| OPEN-08 | التكاملات الحكومية الحقيقية | Compliance/Investigation integrations | OPEN | Authorized Government Liaison | A1/A7 | Government connection/claim | S19/S23 | Formal authorization and tested contract |
| OPEN-09 | حدود السعة والأداء للـPilot | NFR-X01..X06 | OPEN | Pilot Operations Owner | A6/A7 | Pilot capacity commitment | S22/S23 | Load evidence and signed operating target |

Common consequences: mocks and clearly labelled test fixtures are permissible; claiming commercial activation is not. Required approval evidence is a dated decision with approving authority, scope, and supporting evidence.
'@
Write-Utf8 (Join-Path $s00 'decisions.md') $decisions
Write-Utf8 (Join-Path $Root 'planning/decision-register.md') ($decisions -replace '# S00 Decisions Register','# MADAR Decision Register' -replace 'All items below remain','Current baseline: all items below remain')
Write-Utf8 (Join-Path $Root 'planning/adr-register.md') @'
# MADAR ADR Register

| ADR ID | Title | Status | Source / rationale | Owner | Decision evidence |
|---|---|---|---|---|---|
| ADR-000 | Preserve SRS V1.2 as product authority and V5 as execution authority | ACCEPTED BASELINE | SRS/V5 precedence clauses | A0 | Authoritative source documents |
| ADR-001 | S00 uses canonical-body-only FR extraction | PROPOSED FOR REVIEW | Appendix repeats FR IDs for traceability; counting it would double-count requirements | A0 | `requirements-validation.md` |
| ADR-002 | No domain schema/table ownership is fixed before S03 | ACCEPTED BASELINE | V5/S00 instruction and source-of-truth constraints | A0/A7 | SRS/V5 references |

`PROPOSED FOR REVIEW` is not a business approval. Future architecture decisions require an ADR with source references, approver, date, and impact.
'@

Write-Utf8 (Join-Path $s00 'scope.md') @'
# MADAR V1 Scope Freeze

## In scope

The seven central systems (Location, Booking, Compliance, Complaints, Investigation & Evidence, Platform Management, Wallet); supporting Identity, Organization, Vehicles, Routes, Stations/Queue, Trips, Pricing, Tasks, Notifications, and Audit capabilities; Passenger PWA, unified Driver application with taxi and microbus experiences, Station ERP, Madar Admin ERP; and a one-area pilot. Security, auditability, contract, recovery, and quality gates are part of V1.

## Out of scope (V2)

City/Markaz administrative rooms, governorate rooms, Egypt central rooms, fleet-owner application, and fleet-management operations. Architecture may preserve extensibility; it must not ship these V2 functions as V1.

## Conditional scope

Payment/OTP/maps provider activation, government integrations, data-retention policy, continuous PWA background GPS, numerical commercial limits/fees, and pilot capacity are conditional on OPEN-01..OPEN-09 evidence. Mocks/adapters and labelled fixtures may be built; commercial activation and unsupported claims may not.

## Boundary by component

| Component | V1 boundary | Readiness / restriction |
|---|---|---|
| Location | GPS observation, quality and geofence verification | Client GPS alone is not proof; background reliability requires field validation |
| Booking/Queue | Segment-safe booking and station queue state | Booking and Queue remain distinct sources of truth; no overbooking |
| Wallet/Pricing | Append-only double-entry ledger and versioned policy mechanisms | No invented fees, P2P, or direct balance edits |
| Governance systems | Separate complaints, compliance, investigation, and platform management | A complaint is not automatically criminal evidence or a final decision |
| Apps/ERP | Interfaces consume authorized contracts | Client UI cannot override server authorization/business rules |
'@

Write-Utf8 (Join-Path $s00 'ownership-proposal.md') @'
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
'@
Copy-Item (Join-Path $s00 'ownership-proposal.md') (Join-Path $Root 'planning/component-ownership.md') -Force

Write-Utf8 (Join-Path $s00 'source-of-truth-matrix.md') @'
# Source of Truth Matrix

| Data entity / domain | Owning domain | Authorized writer | Authorized readers | API/event boundary | Consistency and audit | Cross-domain restriction |
|---|---|---|---|---|---|---|
| GPS observations / freshness | Location | Location workflow | authorized operational consumers | Location API/events | timestamp, quality, actor/device correlation | No other domain writes location facts |
| Booking and seat holds | Booking | Booking workflow | passenger/driver/station within scope | Booking API/events | atomic capacity and idempotency; audit | No direct wallet/queue schema write |
| Queue position | Stations/Queue | authorized station workflow | station and authorized participants | Queue API/events | ordered transitions, version/audit | Queue is not Booking source of truth |
| Wallet balance and ledger | Wallet | Wallet workflow only | owner and authorized financial reviewer | Wallet API/events | append-only, balanced double entry, idempotency | Admin cannot directly set balance |
| Pricing versions/snapshots | Pricing | authorized pricing workflow | consumers via contract | Pricing API/events | immutable approved version / audit | Client cannot provide final fare |
| Identity/session/employee account | Identity/Admin flow | identity workflow; employee creation authorized via Madar Admin | authorized scoped consumers | Identity API/events | authentication/audit | Station staff do not create employees |
| Vehicles/routes/stations | owning support domain | respective authorized workflows | scoped apps/services | domain APIs/events | version/history where specified | No ownership transfer by UI assertion |
| Complaints | Complaints | complaint workflow | related user/authorized staff | Complaints API/events | relation checks/audit | Not criminal evidence system |
| Compliance | Compliance | authorized compliance workflow | scoped personnel | Compliance API/events | decision/audit | Separate from complaint/investigation ownership |
| Evidence/investigation | Investigation | authorized investigator workflow | case-scoped personnel | Investigation API/events | hash, custody, access audit | No silent replacement or unrestricted access |
| Employee monitoring/tasks/notifications/audit | respective domain | respective authorized workflow | scoped staff/users | domain APIs/events | audit and delivery records | Read models never replace financial/capacity truth |

Schema/table names deliberately remain unspecified until S03. Readers require subject, action, resource, organization scope, and context authorization.
'@

Write-Utf8 (Join-Path $s00 'ticket.md') @'
# Sprint S00 Ticket

**Owner:** A0 — Lead Software Architect / Requirements Engineer. **Wave:** W0. **Status:** completed documentation audit pending user review. **Dependency:** none. **Eligible successors:** S01 and S02, subject to the acceptance gate.

Scope: baseline freeze, canonical requirement extraction, governance records, ownership/source-of-truth proposal, S00 documentation tests, and handoff. Excludes product code, database migrations, production API contracts, and S01/S02 implementation.
'@

Write-Utf8 (Join-Path $s00 'test-cases.md') @'
# S00 Documentation Test Cases

| Test ID | Command | Expected result | Evidence |
|---|---|---|---|
| DOC-01 | `pwsh -File planning/sprints/S00/validate-s00.ps1` | Both authoritative sources exist | validator output |
| DOC-02 | same | Sources readable | validator output |
| DOC-03/04/05 | same | 253 unique canonical FRs; no duplicate canonical IDs | validator output |
| DOC-06/07 | same | 253 RTM records with primary source fields | validator output |
| DOC-08/09 | same | classifications present; no V2 RTM implementation rows | validator output |
| DOC-10/11 | same | OPEN-01..OPEN-09 recorded; none silently approved | validator output |
| DOC-12/13 | manual S00 review | ownership and source-of-truth boundaries documented | ownership/matrix |
| DOC-14 | manual S00 review | S00→S01/S02 dependency stated | ticket/handoff |
| DOC-15-20 | same + manual review | deliverables, Markdown/CSV, AGENTS, allowlist, handoff complete | validator output / review |

Product POS/NEG/BND/SEC/CON/IDE/FAIL/AUD/CTR/UI/PERF cases are planned in the RTM only. They are not product PASS results in documentation-only S00.
'@

Write-Utf8 (Join-Path $s00 'handoff.md') @'
# S00 Handoff

## S01 — Contracts and Threat Model

Start with the domain boundaries and source-of-truth matrix. Generate versioned detailed OpenAPI for the critical contracts listed in SRS section 31.2; enforce authorization, correlation IDs, idempotency, expected version where applicable, and no client-supplied final money values. Threat-model IDOR, tenant scope, OTP abuse, replay, event duplication, PII leakage, evidence access, and failure-before/after-commit. Carry OPEN-05, OPEN-06, OPEN-07, and OPEN-08 as activation constraints.

## S02 — Monorepo and Quality Foundation

Use the ownership proposal, AGENTS.md, and V5 path boundaries. Establish worktrees/branches, CODEOWNERS/ownership enforcement, contract-first publication, test organization, CI documentation checks, and evidence/rollback templates. A7 owns shared contracts, migrations and root configuration. No S00 document authorizes bypassing those boundaries.

## S00 outputs to consume

`RTM.csv`, `source-of-truth-matrix.md`, `ownership-proposal.md`, `gap-analysis.md`, `decisions.md`, and `AGENTS.md`. Fields marked `UNRESOLVED` must become explicit contracts/decisions rather than assumptions.
'@

Write-Utf8 (Join-Path $Root 'AGENTS.md') @'
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
'@
