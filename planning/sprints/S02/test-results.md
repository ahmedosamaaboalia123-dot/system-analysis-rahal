# S02 test results

## Verified Windows clone

Commit `2fce4008b04409bf97001e92d31d42f811644e40`. A fresh Git clone under the Windows temporary
directory started without `node_modules`. It used the official Node `26.13.1` binary verified
against Node's SHA-256 manifest and pnpm `12.19.0` verified against registry integrity metadata.
The shared pnpm content-addressable cache was available. Playwright `1.65.1` used Chromium Headless
Shell `159.0.8154.6` from the official browser installer.

- All 18 recorded commands returned exit 0. They cover environment, frozen install, workspace,
  scripts, ownership, typecheck, ESLint, formatting, unit, build, Chromium, boundaries, security,
  the controlled fault suite, worktree listing, and governance check.
- 56 unique test cases passed. Vitest executed 10, Chromium executed 4, and the controlled
  infrastructure suite executed 42. This includes AFP-S02-01 through AFP-S02-12, BND-01 through
  BND-10, BND-POS, OWN-01 through OWN-09 and OWN-PR-CLI.
- The earlier fresh-clone run at `bfe5c83` exposed a Markdown LF/CRLF mismatch. The first Linux
  CI run at `28dad0d` exposed ANSI control characters in Redocly diagnostics. Both faults were
  corrected, and the complete suite passed at `2fce400`.
- The default isolated linker failed on the Desktop path with concurrent rename errors. The
  hoisted linker also saw this error on that path. Its frozen install succeeded in the clean
  temporary clone. The Desktop path remains an environment-specific limitation.

See [command exit codes](evidence/fresh-clone/command-results.json),
[fault results](evidence/negative-tests/case-results.json),
[Vitest output](evidence/unit/test-unit.txt), and [Chromium output](evidence/browser/test-e2e.txt).

## GitHub Actions

The S02 Foundation workflow run `44739501941` completed successfully for `2fce400`. All 18
Ubuntu/Windows matrix jobs passed, as did the separate ownership and Chromium jobs and the
aggregate `S02_FOUNDATION_QUALITY` gate. The Chromium job also executed the 42-case negative
suite. See [the recorded run](evidence/ci/github-actions.md) and the
[GitHub run](https://github.com/ahmedosamaaboalia123-dot/system-analysis-rahal/actions/runs/44739501941).

## Contract quality

Redocly `1.34.5` ran with certificate checks enabled. Its recommended rules rejected both
public OTP operations because security is undeclared. The validator returned exit 1 with
2 errors and 5 warnings. GitHub also reported failure on the separate contract validation
workflow at `2fce400`. Resolve the declarations and verify the other open S01 findings in S01.
[Redocly output](evidence/ci/redocly-1.34.5.txt).
[Contract run](https://github.com/ahmedosamaaboalia123-dot/system-analysis-rahal/actions/runs/44739501942).

The three legacy S01 scripts returned zero locally and ran on the contract job. Their
labels do not resolve the known S01 test-coverage gaps.

## Applicability

POS, NEG, BND, SEC, IDE, CON, FAIL, CTR, AUD and UI are represented by infrastructure checks.
DB concurrency, production provider failures, outbox and API authorization execution are
N/A for this foundation. PERF is N/A because there is no product workload or benchmark.
