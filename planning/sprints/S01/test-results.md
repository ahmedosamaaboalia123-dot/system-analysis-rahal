# نتائج اختبارات S01

الأمر المنفذ: `pwsh -NoProfile -File planning\\sprints\\S01\\validate-s01.ps1`

| Test ID | النتيجة | الفعلي | الدليل |
|---|---|---|---|
| CONTRACT-01 | PASS | OpenAPI 3.1.0 يُحلل بنجاح | `test-evidence/local-validation.md` |
| CONTRACT-02 | PASS | Error schema يُحلل بنجاح | الدليل نفسه |
| CONTRACT-03 | PASS | 25 عملية، 0 بلا مالك/معرف/مرجع SRS | الدليل نفسه |
| CONTRACT-04 | PASS | fixture صالح يحوي correlation ولا يحمل markers للأسرار | الدليل نفسه |
| COMPAT-01 | PASS | baseline يحوي 25 عملية | الدليل نفسه |
| COMPAT-02 | PASS | حذف operationId في candidate داخل الذاكرة يُكتشف ككسر | الدليل نفسه |
| COMPAT-03 | PASS | baseline يعاد قراءته دون تعديل | الدليل نفسه |
| SEC-01 | PASS | مسح العقد لم يجد password/secret/otpCode/accessToken | الدليل نفسه |
| Runtime DB/Auth/Wallet/Outbox | NOT_RUN | لا يوجد تنفيذ منتج؛ مؤجل إلى S03 وما بعده | S01 scope |
| Independent A6 review | NOT_RUN | لا تتوفر جلسة QA مستقلة | S01 entry gate |

CI: NOT_RUN — لا توجد بنية CI أو Git repository؛ الفحص محلي فقط.
