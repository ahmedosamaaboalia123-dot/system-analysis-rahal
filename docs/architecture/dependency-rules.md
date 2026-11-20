# قواعد الاعتماد

ممنوع: domain→internal domain service/repository/ORM entity، frontend→backend internals، shared utility containing domain logic. مسموح: versioned contracts، public ports، events، shared technical utilities. اختبار S01 مصطنع/تمثيلي لأن monorepo غير موجود؛ S02 يدمجه في lint/CI.