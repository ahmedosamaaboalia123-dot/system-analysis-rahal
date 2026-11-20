# S00 Documentation Test Results

Run command (executed): `pwsh -NoProfile -File planning/sprints/S00/validate-s00.ps1`.

| Test IDs | Result | Actual | Evidence |
|---|---|---|---|
| DOC-01 | PASS | Both authoritative files exist | validator output |
| DOC-02 | PASS | SRS read successfully: 7,753 lines | validator output |
| DOC-03–05 | PASS | 253 canonical IDs extracted, 253 unique, 0 duplicates | validator output |
| DOC-06–07 | PASS | 253 RTM rows and 0 blank primary references | validator output |
| DOC-08–09 | PASS | all rows classified; 0 V2 implementation rows | validator output |
| DOC-10–11 | PASS | all 9 OPEN IDs present; none silently approved | validator output |
| DOC-12 | PASS | ownership proposal has a single listed owner per allowed path and an escalation rule | manual review: `ownership-proposal.md` |
| DOC-13 | PASS | source-of-truth matrix covers core truth domains and cross-domain restrictions | manual review: `source-of-truth-matrix.md` |
| DOC-14 | PASS | S00 handoff declares S01/S02 as successors only | manual review: `ticket.md`, `handoff.md` |
| DOC-15 | PASS | 14 required S00 deliverables exist | validator output |
| DOC-16 | PASS | Markdown documents use headings/tables and are readable as UTF-8 | manual review |
| DOC-17 | PASS | `RTM.csv` imports as UTF-8 CSV with 253 rows | validator output |
| DOC-18 | PASS | only new `planning/` material, `AGENTS.md`, and S00 validation scripts were created; source docs remain outside changed paths | repository inventory and file review |
| DOC-19 | PASS | AGENTS.md exists and preserves authority/ownership/escalation constraints | validator output and manual review |
| DOC-20 | PASS | handoff exists for S01 and S02 | validator output |
| Product POS/NEG/BND/SEC/CON/IDE/FAIL/AUD/CTR/UI/PERF | N/A | No product code exists; no product test was claimed | repository inventory |

Totals: **20 PASS, 0 FAIL, 0 BLOCKED, 0 NOT_RUN, 1 N/A product-test group**. The DOC-01/02/03/04/05/06/07/08/09/10/11/15/17/19/20 results are mechanically verified by the executed script; the remaining documentation checks are explicit manual reviews recorded above.
