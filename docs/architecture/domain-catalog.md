# كتالوج المجالات

| المجال | المسؤولية | المالك | التصنيف |
|---|---|---|---|
| Identity | Accounts, sessions, OTP, employee identity | A1 | RESTRICTED |
| Vehicles | Vehicle and driver master data | A2 | CONFIDENTIAL |
| Routes | Route versions, stops and segments | A2 | INTERNAL |
| Stations/Queue | Station authority and ordered queue entries | A2 | CONFIDENTIAL |
| Location | GPS observations and geofence decisions | A2 | RESTRICTED |
| Booking | Seat holds, bookings and taxi dispatch state | A2 | CONFIDENTIAL |
| Trips | Trip operational state and fare snapshot reference | A2 | CONFIDENTIAL |
| Pricing | Versioned tariffs and price snapshots | A3 | CONFIDENTIAL |
| Wallet | Append-only balanced financial ledger | A3 | RESTRICTED |
| Complaints | Complaint cases and appeal links | A1 | RESTRICTED |
| Compliance | Compliance cases and sanctions | A1 | RESTRICTED |
| Investigation | Evidence/custody and investigation cases | A1 | RESTRICTED |
| Platform Management | Employee activity indicators | A3 | RESTRICTED |
| Tasks | Assignments and completion state | A3 | INTERNAL |
| Notifications | Delivery records and read state | A3 | CONFIDENTIAL |
| Audit | Sensitive action records | A7 | RESTRICTED |

الملكية منطقية؛ لا تثبت جداول أو ORM قبل S03. المجالات السبعة المركزية هي Location وBooking وCompliance وComplaints وInvestigation وPlatform Management وWallet. التطبيقات تستهلك عقودًا عامة فقط.