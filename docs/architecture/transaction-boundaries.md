# حدود المعاملات

Booking hold/confirm، queue check-in، ledger posting، withdrawal request/approval، taxi finish تتطلب معاملة محلية ذرية + idempotency record + outbox. السعة والرصيد: unique constraints/row locks أو optimistic version وفق العملية. لا transaction موزعة؛ recovery/compensation عبر workflow موثق.