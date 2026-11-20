# دليل التحقق المحلي

التاريخ: 2026-11-19 (Africa/Cairo)

الأمر: `pwsh -NoProfile -File planning\\sprints\\S01\\validate-s01.ps1`

النتيجة الفعلية: CONTRACT-01, CONTRACT-02, CONTRACT-03, CONTRACT-04, COMPAT-01, COMPAT-02, COMPAT-03, SEC-01 = PASS.

الأداة: PowerShell (`pwsh`) و`ConvertFrom-Json`. يثبت هذا سلامة JSON والـmetadata وmutation التوافقي داخل الذاكرة فقط، ولا يثبت التوافق مع عميل حقيقي أو تطبيق إنتاجي.
