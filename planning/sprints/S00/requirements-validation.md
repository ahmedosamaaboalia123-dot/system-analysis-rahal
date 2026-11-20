# Requirements Validation

The reproducible extractor is generate-s00.ps1; the verifier is alidate-s00.ps1.

## Method

1. Read the SRS as UTF-8 text.
2. Find the boundary before # الجزء الثامن (the traceability appendix).
3. Match only canonical lines of the form **FR-GROUP-###** — title in the canonical body.
4. Require exactly 253 unique IDs and 253 RTM rows.
5. Require a non-empty source file, source line, title, type, status, and verification status for every RTM record.

## Result

- Canonical FR definitions: **253**.
- Unique canonical IDs: **253**.
- Duplicate canonical IDs: **0**.
- RTM records: **253**.
- RTM rows with empty primary source fields: **0**.
- Appendix references: excluded by design; they are not canonical definitions.

Limit: semantic ownership, actor, and dependency fields that lack an explicit source statement remain UNRESOLVED; this preserves traceability and prevents invented business decisions.