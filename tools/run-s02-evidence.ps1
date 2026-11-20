param(
  [string]$Pnpm = 'pnpm',
  [ValidateSet('local', 'fresh-clone')]
  [string]$Profile = 'local'
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$output = Join-Path $repo "artifacts/s02/$Profile"
New-Item -ItemType Directory -Force -Path $output | Out-Null
$results = [System.Collections.Generic.List[object]]::new()

function Invoke-Evidence([string]$Group, [string]$Name, [string]$Command, [string[]]$Arguments) {
  $directory = Join-Path $output $Group
  New-Item -ItemType Directory -Force -Path $directory | Out-Null
  $log = Join-Path $directory "$Name.log"
  Write-Host "$Group/$Name $Command $($Arguments -join ' ')"
  $global:LASTEXITCODE = 0
  & $Command @Arguments 2>&1 | Tee-Object -FilePath $log | Out-Host
  $code = $LASTEXITCODE
  $results.Add([pscustomobject]@{
    group = $Group; name = $Name; command = "$Command $($Arguments -join ' ')"
    exitCode = $code; result = $(if ($code -eq 0) { 'PASS' } else { 'FAIL' })
    log = "$Group/$Name.log"
  })
}

Push-Location $repo
try {
  Invoke-Evidence 'environment' 'head' 'git' @('-c', "safe.directory=$($repo.Replace('\','/'))", 'rev-parse', 'HEAD')
  Invoke-Evidence 'environment' 'node' 'node' @('--version')
  Invoke-Evidence 'environment' 'pnpm' $Pnpm @('--version')
  Invoke-Evidence 'installation' 'frozen' $Pnpm @('install', '--frozen-lockfile')
  $tasks = @(
    @('workspace', 'check:workspace'),
    @('workspace', 'check:scripts'),
    @('ownership', 'check:ownership'),
    @('typescript', 'typecheck'),
    @('lint', 'lint'),
    @('format', 'format:check'),
    @('unit', 'test:unit'),
    @('workspace', 'build'),
    @('browser', 'test:e2e'),
    @('boundaries', 'check:boundaries'),
    @('security', 'check:security'),
    @('negative-tests', 'test:negative')
  )
  foreach ($task in $tasks) {
    Invoke-Evidence $task[0] ($task[1].Replace(':', '-')) $Pnpm @('run', $task[1])
  }
  Invoke-Evidence 'worktrees' 'listing' 'node' @('tools/worktrees.mjs', 'list')
  Invoke-Evidence 'workspace' 'governance' 'node' @('tools/verify-governance.mjs')
} finally {
  $results | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $output 'results.json') -Encoding utf8
  Pop-Location
}
if ($results.Where({ $_.exitCode -ne 0 }).Count) { exit 1 }
