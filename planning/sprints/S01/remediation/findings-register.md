# Findings Register

| ID | Severity | Finding | Status | Fix/evidence |
|---|---|---|---|---|
| F-01 | HIGH | Prior compatibility test mutated an invalid contract shape only | FIXED | compatibility script now compares valid candidate mutations |
| F-02 | HIGH | Requirements-to-contract traceability was aggregate only | FIXED | 253-row coverage CSV |
| F-03 | MEDIUM | Secret check was narrow | FIXED | synthetic secret/error negative tests and evidence |
| F-04 | MEDIUM | A6 independent review unavailable | OPEN | self-review only; independent A6 pending |
| F-05 | MEDIUM | CI absent | OPEN | local scripts prepared; CI integration belongs to S02 |