# كتالوج الأوامر

كل أمر يحتاج مصادقة وصلاحية ونطاقاً تنظيمياً وسجل تدقيق، ومعاملة ذرية/Outbox حيث ينتج حدثًا. الحدود المالية والحجز تستخدم قيد DB والتزامن في S03.

| Command ID | العملية | المجال | الفاعل | الحماية | المرجع |
|---|---|---|---|---|---|
| CMD-issueOtp | issueOtp | Identity | API principal within authorized scope | Idempotency-Key; state/version checks | FR-IDN-001 |
| CMD-verifyOtp | verifyOtp | Identity | API principal within authorized scope | Idempotency-Key; state/version checks | FR-IDN-001 |
| CMD-createEmployee | createEmployee | Identity | API principal within authorized scope | Idempotency-Key; state/version checks | FR-IDN-008 |
| CMD-registerVehicle | registerVehicle | Vehicles | API principal within authorized scope | Idempotency-Key; state/version checks | FR-VEH-001 |
| CMD-createRouteVersion | createRouteVersion | Routes | API principal within authorized scope | Idempotency-Key; state/version checks | FR-RTE-002 |
| CMD-queueCheckIn | queueCheckIn | Stations/Queue | API principal within authorized scope | Idempotency-Key; state/version checks | FR-STA-001 |
| CMD-queueLeave | queueLeave | Stations/Queue | API principal within authorized scope | Idempotency-Key; state/version checks | FR-STA-010 |
| CMD-recordGpsObservation | recordGpsObservation | Location | API principal within authorized scope | Idempotency-Key; state/version checks | FR-LOC-001 |
| CMD-holdSeat | holdSeat | Booking | API principal within authorized scope | Idempotency-Key; state/version checks | FR-BKG-001 |
| CMD-confirmBooking | confirmBooking | Booking | API principal within authorized scope | Idempotency-Key; state/version checks | FR-BKG-005 |
| CMD-cancelBooking | cancelBooking | Booking | API principal within authorized scope | Idempotency-Key; state/version checks | FR-BKG-009 |
| CMD-acceptTaxiOffer | acceptTaxiOffer | Booking | API principal within authorized scope | Idempotency-Key; state/version checks | FR-BKG-013 |
| CMD-activateStreetQr | activateStreetQr | Booking | API principal within authorized scope | Idempotency-Key; state/version checks | FR-BKG-014 |
| CMD-finishTaxiTrip | finishTaxiTrip | Trips | API principal within authorized scope | Idempotency-Key; state/version checks | FR-BKG-016 |
| CMD-publishPriceVersion | publishPriceVersion | Pricing | API principal within authorized scope | Idempotency-Key; state/version checks | FR-PRC-002 |
| CMD-walletPayment | walletPayment | Wallet | API principal within authorized scope | Idempotency-Key; state/version checks | FR-WLT-007 |
| CMD-requestWithdrawal | requestWithdrawal | Wallet | API principal within authorized scope | Idempotency-Key; state/version checks | FR-WLT-008 |
| CMD-approveWithdrawal | approveWithdrawal | Wallet | API principal within authorized scope | Idempotency-Key; state/version checks | FR-WLT-009 |
| CMD-submitComplaint | submitComplaint | Complaints | API principal within authorized scope | Idempotency-Key; state/version checks | FR-COM-001 |
| CMD-recordComplianceDecision | recordComplianceDecision | Compliance | API principal within authorized scope | Idempotency-Key; state/version checks | FR-CMP-001 |
| CMD-registerEvidence | registerEvidence | Investigation | API principal within authorized scope | Idempotency-Key; state/version checks | FR-INV-002 |
| CMD-recordEmployeeSignal | recordEmployeeSignal | Platform Management | API principal within authorized scope | Idempotency-Key; state/version checks | FR-PLT-001 |
| CMD-completeTask | completeTask | Tasks | API principal within authorized scope | Idempotency-Key; state/version checks | FR-TSK-005 |