# سياسة الإصدارات

API تحت /v1; إضافة حقل اختياري أو operation جديدة non-breaking. إزالة operation/required field أو تغيير type/enum بصورة تقيد مستهلكًا breaking ويستلزم major version/مسار توافق. الأحداث تحمل suffix .v1 وschemaVersion. لا حذف قبل deprecation وإثبات توافق.