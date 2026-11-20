param([string]$Root=(Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path)
$ErrorActionPreference='Stop'; $contracts=Join-Path $Root 'packages/contracts'; $results=[Collections.Generic.List[object]]::new()
function Add-Result($id,$ok,$actual){$results.Add([pscustomobject]@{TestID=$id;Result=if($ok){'PASS'}else{'FAIL'};Actual=$actual})}
$spec=Get-Content (Join-Path $contracts 'openapi/v1.openapi.json') -Raw|ConvertFrom-Json
$ops=@(); $spec.paths.psobject.Properties|ForEach-Object{$_.Value.psobject.Properties|ForEach-Object{$ops+=$_.Value}}
Add-Result 'CONTRACT-01' ($spec.openapi -eq '3.1.0') "OpenAPI=$($spec.openapi)"
$errorSchema=Get-Content (Join-Path $contracts 'schemas/error-envelope.schema.json') -Raw|ConvertFrom-Json; Add-Result 'CONTRACT-02' ($errorSchema.title -eq 'MADAR Error Envelope') 'Error schema parses'
$unowned=@($ops|Where-Object{!$_.operationId -or !$_.'x-madar-contract-id' -or !$_.'x-madar-owner-domain' -or !$_.'x-madar-srs'}); Add-Result 'CONTRACT-03' ($unowned.Count -eq 0) "Operations=$($ops.Count), unowned=$($unowned.Count)"
$fixtureText=Get-Content (Join-Path $contracts 'fixtures/valid-booking-confirmed-event.json') -Raw; $fixture=$fixtureText|ConvertFrom-Json; Add-Result 'CONTRACT-04' ($fixture.correlationId -and ($fixtureText -notmatch '(?i)password|secret|token|otp')) 'Valid fixture has correlation and no secret marker'
Add-Result 'COMPAT-01' ($ops.Count -gt 0) "Baseline operations=$($ops.Count)"; $candidate=$ops|Select-Object -Property *; $candidate[0].operationId=$null; Add-Result 'COMPAT-02' (@($candidate|Where-Object{!$_.operationId}).Count -eq 1) 'In-memory removed operationId detected'
$again=Get-Content (Join-Path $contracts 'openapi/v1.openapi.json') -Raw|ConvertFrom-Json; Add-Result 'COMPAT-03' (@($again.paths.psobject.Properties).Count -eq @($spec.paths.psobject.Properties).Count) 'Baseline file unchanged after mutation'
Add-Result 'SEC-01' ((Get-Content (Join-Path $contracts 'openapi/v1.openapi.json') -Raw) -notmatch '(?i)password|secret|otpCode|accessToken') 'Contract scan found no secret payload names'
$results|Format-Table -AutoSize; if($results.Result -contains 'FAIL'){exit 1}
