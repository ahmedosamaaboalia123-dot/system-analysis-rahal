# ثوابت التزامن

لا Overbooking، لا Double Spend، لا queue entry مزدوج، لا QR/finish/payment callback مكرر. الحماية: transaction محلية، unique constraints، state preconditions/expectedVersion، row locks عند السعة/الرصيد، ledger balance invariants، and idempotency records. اختبارات DB الحقيقية مؤجلة لـS03 وما بعده.