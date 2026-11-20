# S02 GitHub Actions evidence

Observed through the public GitHub Actions API on 2026-11-20.

## Foundation run

- Workflow: `S02 Foundation`
- Run: `44739501941`
- Head: `2fce4008b04409bf97001e92d31d42f811644e40`
- Event: `push`
- Status: `completed`
- Conclusion: `success`
- Started: `2026-11-20T12:53:05Z`
- Completed: `2026-11-20T12:56:08Z`
- URL: <https://github.com/ahmedosamaaboalia123-dot/system-analysis-rahal/actions/runs/44739501941>

All 18 Ubuntu/Windows matrix jobs succeeded. The separate `ownership` and `browser` jobs
succeeded. The browser job ran Chromium and the controlled negative suite. The aggregate
`S02_FOUNDATION_QUALITY` job succeeded.

## Contract run

- Workflow run: `44739501942`
- Head: `2fce4008b04409bf97001e92d31d42f811644e40`
- Status: `completed`
- Conclusion: `failure`
- URL: <https://github.com/ahmedosamaaboalia123-dot/system-analysis-rahal/actions/runs/44739501942>

This separate S01 contract result is outside S02 acceptance. Redocly `1.34.5` returned exit 1
for the existing S01 contract with 2 security-definition errors and 5 warnings.

## Repository protection

The public branch API reported `protected: false` for `main` at commit
`5acd415916f4d67dd0f2c724e82fd745228d8f56`. Remote CI execution is verified, while
protected-base PR enforcement remains an owner bootstrap action.
