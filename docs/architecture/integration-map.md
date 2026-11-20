# خريطة التكامل

Provider boundaries: Identity للـOTP adapter، Wallet لمزود الدفع، Location للخرائط/GPS، Compliance/Investigation للجهات الحكومية. OPEN-06 وOPEN-08 تمنع التفعيل الحقيقي؛ تستخدم adapters/mocks فقط. لا exactly-once؛ outbox + idempotent consumer.