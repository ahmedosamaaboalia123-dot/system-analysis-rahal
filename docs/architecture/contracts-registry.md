# سجل العقود

| Contract ID | Name | Type | Provider | Agent | SRS | File | Version | Status |
|---|---|---|---|---|---|---|---|---|
| API-IAM-01 | issueOtp | API | Identity | A1 | FR-IDN-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-IAM-02 | verifyOtp | API | Identity | A1 | FR-IDN-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-ADM-01 | createEmployee | API | Identity | A1 | FR-IDN-008 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-VEH-01 | registerVehicle | API | Vehicles | A2 | FR-VEH-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-RTE-01 | createRouteVersion | API | Routes | A2 | FR-RTE-002 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-STA-01 | queueCheckIn | API | Stations/Queue | A2 | FR-STA-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-STA-02 | queueLeave | API | Stations/Queue | A2 | FR-STA-010 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-LOC-01 | recordGpsObservation | API | Location | A2 | FR-LOC-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-BKG-01 | holdSeat | API | Booking | A2 | FR-BKG-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-BKG-02 | confirmBooking | API | Booking | A2 | FR-BKG-005 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-BKG-03 | cancelBooking | API | Booking | A2 | FR-BKG-009 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-TAX-01 | acceptTaxiOffer | API | Booking | A2 | FR-BKG-013 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-TAX-02 | activateStreetQr | API | Booking | A2 | FR-BKG-014 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-TAX-03 | finishTaxiTrip | API | Trips | A2 | FR-BKG-016 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-PRC-01 | publishPriceVersion | API | Pricing | A3 | FR-PRC-002 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-WLT-01 | walletPayment | API | Wallet | A3 | FR-WLT-007 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-WLT-02 | requestWithdrawal | API | Wallet | A3 | FR-WLT-008 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-WLT-03 | approveWithdrawal | API | Wallet | A3 | FR-WLT-009 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-COM-01 | submitComplaint | API | Complaints | A1 | FR-COM-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-CMP-01 | recordComplianceDecision | API | Compliance | A1 | FR-CMP-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-INV-01 | registerEvidence | API | Investigation | A1 | FR-INV-002 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-PLT-01 | recordEmployeeSignal | API | Platform Management | A3 | FR-PLT-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-TSK-01 | completeTask | API | Tasks | A3 | FR-TSK-005 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-NTF-01 | listNotifications | API | Notifications | A3 | FR-NTF-006 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |
| API-AUD-01 | queryAuditLog | API | Audit | A7 | FR-AUD-001 | openapi/v1.openapi.json | 1.0.0-proposed | SPECIFIED |

Events use vents/domain-event-envelope.schema.json; provider is the domain named in event type; status SPECIFIED. Consumers are authorized by explicit subscription contract. No contract is IMPLEMENTED.