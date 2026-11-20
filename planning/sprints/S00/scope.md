# MADAR V1 Scope Freeze

## In scope

The seven central systems (Location, Booking, Compliance, Complaints, Investigation & Evidence, Platform Management, Wallet); supporting Identity, Organization, Vehicles, Routes, Stations/Queue, Trips, Pricing, Tasks, Notifications, and Audit capabilities; Passenger PWA, unified Driver application with taxi and microbus experiences, Station ERP, Madar Admin ERP; and a one-area pilot. Security, auditability, contract, recovery, and quality gates are part of V1.

## Out of scope (V2)

City/Markaz administrative rooms, governorate rooms, Egypt central rooms, fleet-owner application, and fleet-management operations. Architecture may preserve extensibility; it must not ship these V2 functions as V1.

## Conditional scope

Payment/OTP/maps provider activation, government integrations, data-retention policy, continuous PWA background GPS, numerical commercial limits/fees, and pilot capacity are conditional on OPEN-01..OPEN-09 evidence. Mocks/adapters and labelled fixtures may be built; commercial activation and unsupported claims may not.

## Boundary by component

| Component | V1 boundary | Readiness / restriction |
|---|---|---|
| Location | GPS observation, quality and geofence verification | Client GPS alone is not proof; background reliability requires field validation |
| Booking/Queue | Segment-safe booking and station queue state | Booking and Queue remain distinct sources of truth; no overbooking |
| Wallet/Pricing | Append-only double-entry ledger and versioned policy mechanisms | No invented fees, P2P, or direct balance edits |
| Governance systems | Separate complaints, compliance, investigation, and platform management | A complaint is not automatically criminal evidence or a final decision |
| Apps/ERP | Interfaces consume authorized contracts | Client UI cannot override server authorization/business rules |