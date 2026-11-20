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