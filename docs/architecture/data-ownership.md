# ملكية البيانات

| الكيان | المالك | الكاتب المخول | نمط الاتساق |
|---|---|---|---|
| GPS Observation | Location | Location workflow | quality/timestamp + audit |
| Booking/Hold | Booking | Booking workflow | atomic capacity/idempotency |
| Queue Entry | Stations/Queue | authorized station workflow | ordered state/version |
| Ledger/Balance | Wallet | Wallet workflow | append-only double entry |
| Vehicle | Vehicles | authorized vehicle workflow | history/audit |
| Evidence | Investigation | assigned investigator | hash/custody/access audit |

القارئ يستخدم عقدًا عامًا؛ لا ORM مشترك ولا repository داخلي.