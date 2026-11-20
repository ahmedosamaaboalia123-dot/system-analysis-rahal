# سياسة Idempotency

النطاق هو actor+operation+Idempotency-Key، مع fingerprint للطلب. نفس المفتاح/نفس payload يعيد النتيجة المحفوظة؛ نفس المفتاح/payload مختلف=409؛ in-progress يمنع الأثر المكرر؛ failure يسجل outcome قابلًا للمراجعة. التخزين عند المجال المالك، والاحتفاظ configurable بلا مدة مخترعة. تنطبق على booking، queue، trip، ledger/payment/refund، withdrawal، وconsumer events.