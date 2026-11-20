# Source of Truth Matrix

| Data entity / domain | Owning domain | Authorized writer | Authorized readers | API/event boundary | Consistency and audit | Cross-domain restriction |
|---|---|---|---|---|---|---|
| GPS observations / freshness | Location | Location workflow | authorized operational consumers | Location API/events | timestamp, quality, actor/device correlation | No other domain writes location facts |
| Booking and seat holds | Booking | Booking workflow | passenger/driver/station within scope | Booking API/events | atomic capacity and idempotency; audit | No direct wallet/queue schema write |
| Queue position | Stations/Queue | authorized station workflow | station and authorized participants | Queue API/events | ordered transitions, version/audit | Queue is not Booking source of truth |
| Wallet balance and ledger | Wallet | Wallet workflow only | owner and authorized financial reviewer | Wallet API/events | append-only, balanced double entry, idempotency | Admin cannot directly set balance |
| Pricing versions/snapshots | Pricing | authorized pricing workflow | consumers via contract | Pricing API/events | immutable approved version / audit | Client cannot provide final fare |
| Identity/session/employee account | Identity/Admin flow | identity workflow; employee creation authorized via Madar Admin | authorized scoped consumers | Identity API/events | authentication/audit | Station staff do not create employees |
| Vehicles/routes/stations | owning support domain | respective authorized workflows | scoped apps/services | domain APIs/events | version/history where specified | No ownership transfer by UI assertion |
| Complaints | Complaints | complaint workflow | related user/authorized staff | Complaints API/events | relation checks/audit | Not criminal evidence system |
| Compliance | Compliance | authorized compliance workflow | scoped personnel | Compliance API/events | decision/audit | Separate from complaint/investigation ownership |
| Evidence/investigation | Investigation | authorized investigator workflow | case-scoped personnel | Investigation API/events | hash, custody, access audit | No silent replacement or unrestricted access |
| Employee monitoring/tasks/notifications/audit | respective domain | respective authorized workflow | scoped staff/users | domain APIs/events | audit and delivery records | Read models never replace financial/capacity truth |

Schema/table names deliberately remain unspecified until S03. Readers require subject, action, resource, organization scope, and context authorization.