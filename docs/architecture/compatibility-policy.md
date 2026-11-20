# سياسة التوافق

الفحص يقارن baseline مع candidate ويمنع حذف operationId أو تغيير required/type أو response/error contract دون version جديد. فحص S01 محلي فقط؛ CI integration مؤجل S02. mutation السلبي يتم في الذاكرة ثم تؤكد إعادة baseline دون تعديل ملف العقد.