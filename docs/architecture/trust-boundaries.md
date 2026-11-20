# حدود الثقة

العميل غير موثوق؛ API boundary يفرض authz. Provider callbacks غير موثوقة حتى تحقق signature/replay policy. التطبيق ← API ← domain ← outbox/consumer حدود منفصلة. GPS العميل إشارة لا دليل قاطع. evidence وwallet وidentity مناطق RESTRICTED.