# كتالوج الاستعلامات

الاستعلامات لا تعدل الحالة، وتطبق scope وpagination وsorting آمنًا؛ لا تعرض حقولًا RESTRICTED دون غرض وصلاحية.

| Query ID | العملية | المجال | الفاعل | القيود | المرجع |
|---|---|---|---|---|---|
| QRY-listNotifications | listNotifications | Notifications | فاعل مخول بالنطاق | pagination/sorting allowlist | FR-NTF-006 |
| QRY-queryAuditLog | queryAuditLog | Audit | فاعل مخول بالنطاق | pagination/sorting allowlist | FR-AUD-001 |