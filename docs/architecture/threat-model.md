# نموذج التهديد S01

التقييم نوعي ومبدئي؛ يعالج التصميم والعقود ولا يثبت أمن runtime. كل تهديد يحتاج اختبارًا لاحقًا من A6 والتنفيذ المسؤول.

| ID | الأصل/الحد | السيناريو (STRIDE) | الشدة | الضابط | التحقق المخطط | الخطر المتبقي | المالك |
|---|---|---|---|---|---|---|---|
| THR-001 | OTP/API | brute force أو enumeration (S/D) | HIGH | rate limit ورسائل موحدة وتدقيق | OTP abuse test | MEDIUM | A1 |
| THR-002 | session/API | hijack أو privilege escalation (S/E) | CRITICAL | جلسة آمنة، authz server-side، scope | IDOR/session tests | MEDIUM | A1 |
| THR-003 | Queue/Location | GPS spoof أو remote check-in (T) | HIGH | geofence/freshness والتحقق التشغيلي | device/negative test | MEDIUM | A2 |
| THR-004 | Booking | overlap/overbooking أو state manipulation (T) | CRITICAL | transaction, constraints, version/idempotency | DB race tests | MEDIUM | A2 |
| THR-005 | Taxi QR | replay/substitution/hijack (S/T) | HIGH | one-time stateful token and actor binding | replay tests | MEDIUM | A2 |
| THR-006 | Wallet | double spend/callback replay/balance tamper (T/R) | CRITICAL | balanced ledger, idempotency, verified callback | ledger/concurrency tests | MEDIUM | A3 |
| THR-007 | Evidence | unauthorized access/tampering/cross-case leak (I/T) | CRITICAL | case scope, hash/custody/audit | access/custody tests | MEDIUM | A1 |
| THR-008 | Admin | unauthorized employee/pricing change (E/R) | HIGH | least privilege, approval/audit | authz/audit tests | LOW | A1/A3 |
| THR-009 | APIs/events | secrets/PII in payload or logs (I) | HIGH | classifications, allowlisted schema/log review | static + runtime review | MEDIUM | A7 |
| THR-010 | Provider boundary | dependency failure/retry storm (D) | MEDIUM | timeout/circuit policy, safe 503, outbox | failure injection | MEDIUM | A7 |

OPEN-07 leaves retention/legal residual risk unresolved. No legal approval is claimed.
