# كتالوج الأحداث

جميع الأحداث تحمل eventId/correlationId/causationId عند توفره ووقت الحدوث وaggregate. التسليم at-least-once عبر transactional outbox؛ المستهلك يمنع التكرار ولا تحتوي الحمولة أسراراً أو OTP/tokens.

| ID | الحدث | المنتج | المستهلكون | الضمان |
|---|---|---|---|---|
| EVT-identity-account-verified-v1 | identity.account.verified.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-queue-entry-checked-in-v1 | queue.entry.checked-in.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-booking-hold-created-v1 | booking.hold.created.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-booking-confirmed-v1 | booking.confirmed.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-taxi-trip-completed-v1 | taxi.trip.completed.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-wallet-ledger-posted-v1 | wallet.ledger.posted.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-withdrawal-requested-v1 | withdrawal.requested.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-complaint-submitted-v1 | complaint.submitted.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-evidence-registered-v1 | evidence.registered.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-task-completed-v1 | task.completed.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |
| EVT-notification-created-v1 | notification.created.v1 | المجال المنتج بحسب البادئة | مستهلكون مخولون عبر contract | at-least-once; dedupe eventId |