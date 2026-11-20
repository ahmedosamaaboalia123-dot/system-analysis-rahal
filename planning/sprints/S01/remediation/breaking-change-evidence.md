# Breaking-Change Evidence

Tool: `validate-remediation.ps1`, a compatibility-aware local comparator over two structurally valid OpenAPI JSON objects. It compares path/method operation presence, success response schema reference, and authorization contract. It is not a CI run.

| Test | Candidate mutation | Expected / actual | Exit |
|---|---|---|---:|
| COMPAT-04 | Remove one existing path/method | rejected: `removed operation` / PASS | 0 |
| COMPAT-05 | Change authorization scope on an existing operation | rejected: `changed authorization` / PASS | 0 |
| COMPAT-06 | Add documentation only | compatible / PASS | 0 |
| COMPAT-07 | Reload baseline after mutations | unchanged / PASS | 0 |

The mutations occur in memory; the on-disk baseline is preserved. Response field/type, request-required-field, enum, and status-code comparisons require operation-specific response/request schemas; they are mandatory expansion work when S02 establishes the chosen OpenAPI compatibility toolchain. No false claim of CI compatibility is made.
