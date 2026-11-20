# تصنيف الأخطاء

Envelope: code, message, correlationId, etryable, details الآمنة. VALIDATION_ERROR=422، AUTHENTICATION_REQUIRED=401، FORBIDDEN=403، NOT_FOUND=404، STATE_CONFLICT/CONCURRENCY_CONFLICT/IDEMPOTENCY_CONFLICT=409، RATE_LIMITED=429، DEPENDENCY_UNAVAILABLE=503، INTERNAL_ERROR=500. لا stack traces أو SQL أو OTP أو tokens أو secrets؛ الأخطاء الحساسة تدقق.