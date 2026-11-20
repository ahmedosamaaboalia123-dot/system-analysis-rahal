# S00 Requirements Inventory

Source audited: docs/MADAR_V1_Master_SRS_V1.2_Reconciled_Complete_Arabic.md (canonical body before الجزء الثامن). The parser identifies bold canonical definitions only; appendix occurrences are traceability references, not extra requirements.

## Canonical functional requirements

Expected: **253**. Extracted: **253**. Missing from sequence: **none detected by canonical-ID extraction**. Duplicate canonical definitions: **none detected**.

| Group | FR count | Business domain | Owning agent | Planned sprint(s) |
|---|---:|---|---|---|
| ADM | 25 | لوحة إدارة مدار | A5 | S14; S17; S20; S21 |
| AUD | 8 | التدقيق والتقارير | A7 | S20; S21 |
| BKG | 18 | الحجز والمقاعد | A2 | S09; S10; S12; S13; S21 |
| CMP | 10 | الامتثال | A1 | S19; S21 |
| COM | 12 | الشكاوى | A1 | S18; S21 |
| DRM | 16 | سائق الميكروباص | A4 | S11; S21 |
| DRT | 16 | سائق التاكسي | A4 | S12; S13; S21 |
| IDN | 12 | الهوية والحسابات والجلسات | A1 | S04 |
| INV | 10 | التحقيق والأدلة | A1 | S19; S21 |
| LOC | 12 | الموقع والتتبع | A2 | S06; S12; S21 |
| NTF | 8 | الإشعارات | A3 | S20; S21 |
| PAS | 22 | تطبيق الراكب | A4 | S10; S12; S16; S18; S21 |
| PLT | 11 | مراقبة المنصة والموظفين | A3 | S20; S21 |
| PRC | 10 | التسعير | A3 | S14; S21 |
| RTE | 8 | الخطوط والمسارات | A2 | S05; S21 |
| STA | 18 | إدارة الموقف | A2 | S07; S08; S21 |
| TSK | 10 | المهام | A3 | S20; S21 |
| VEH | 9 | المركبات والسائقون | A2 | S05; S21 |
| WLT | 18 | المحفظة والمالية | A3 | S15; S16; S17; S21 |

## Other authoritative requirement classes

- Business rules: BR-001 through BR-025, in SRS section 2; they remain the approved business baseline.
- NFR: NFR-X01 through NFR-X14, in section 36; they are prototype acceptance targets, not production guarantees.
- Integration requirements: INT-REQ-01 through INT-REQ-07, plus the critical API contract table in section 31.
- Security/access control: AUTH-REQ-01 through AUTH-REQ-06 and the security clauses within FR/NFR; no separate SEC-* namespace was found in the canonical SRS body.
- Open validation/decision items: OPEN-01 through OPEN-09; see decisions.md.
- Deferred V2 scope: administrative rooms and fleet-owner/fleet-management functionality; excluded from V1 execution.

The RTM intentionally uses UNRESOLVED where the original source does not explicitly provide a field. That is a finding for S01, not an invented requirement.