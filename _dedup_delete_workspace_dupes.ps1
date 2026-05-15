$planet = "C:\GOODNIGHT_PLANET"
$workspace = "C:\Users\mush1\.cursor\projects\C-Users-mush1-AppData-Local-Temp-e1510882-f0ae-4050-8288-7f56988be64c"
$log = "C:\GOODNIGHT_PLANET\_DEDUP_DELETE_LOG.txt"
if (-not (Test-Path $planet)) { "ERROR: missing planet" | Out-File $log; exit 1 }
if (-not (Test-Path $workspace)) { "ERROR: missing workspace" | Out-File $log; exit 1 }
$deleted = 0
$errors = 0
$errList = New-Object System.Collections.Generic.List[string]
Get-ChildItem -LiteralPath $planet -Recurse -File -Force -ErrorAction SilentlyContinue | ForEach-Object {
  $rel = $_.FullName.Substring($planet.Length).TrimStart('\')
  $target = Join-Path $workspace $rel
  if (Test-Path -LiteralPath $target) {
    try {
      Remove-Item -LiteralPath $target -Force -ErrorAction Stop
      $deleted++
    } catch {
      $errors++
      $errList.Add("$target :: $($_.Exception.Message)")
    }
  }
}
Get-ChildItem -LiteralPath $workspace -Recurse -Directory -Force -ErrorAction SilentlyContinue |
  Sort-Object { $_.FullName.Length } -Descending |
  ForEach-Object {
    try {
      if ((Get-ChildItem -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0) {
        Remove-Item -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue
      }
    } catch {}
  }
@"
ended_at=$(Get-Date -Format o)
deleted_files=$deleted
errors=$errors
---
$($errList -join "`n")
"@ | Out-File -FilePath $log -Encoding utf8
