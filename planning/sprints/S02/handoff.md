# S02 A0 Handoff

## To A7

Use this planning baseline while implementing foundation-only infrastructure. Preserve SRS/V5 and existing S01 contracts. Provide executed evidence for each S02-T01..T12, exact versions, lockfile, negative-test outcomes, CI workflow contents, and source hashes.

## To A6

Independently rerun acceptance gates after A7 integration, including fresh-clone, forbidden import, unauthorized diff and anti-false-pass checks. Do not accept local A7 assertions as evidence.
Use `pwsh -NoProfile -File tools/run-s02-evidence.ps1 -Profile fresh-clone` in a reviewer-owned
environment that permits temporary Git repository writes and local loopback connections.

## To S03

Not eligible. S03 opens only when S01 contract gate and S02 quality foundation gate both meet their documented acceptance conditions.

## Owner bootstrap

Review the initial S02 pull request with the A0 scope review and A6 evidence. Install the branch
rules described in [the implementation report](implementation-report.md#initial-protection).
The public GitHub API returned `protected: false` for `main`. The first PR requires an owner
bootstrap because its base does not contain the trusted ownership files.

GitHub run `44739501941` passed all S02 foundation jobs and the aggregate gate at `2fce400`.
Configure a `main` ruleset requiring code-owner review and the `S02_FOUNDATION_QUALITY` check,
then exercise the trusted PR path against that protected base.

After bootstrap, verify the required PR ownership job with a reviewed authorized change and
a disposable unauthorized diff. Keep S03 gated while S01 Redocly findings, contract semantics
and final QA evidence remain unresolved.
