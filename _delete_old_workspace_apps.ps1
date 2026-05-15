$ErrorActionPreference = 'Stop'
$apps = 'C:\Users\mush1\.cursor\projects\C-Users-mush1-AppData-Local-Temp-e1510882-f0ae-4050-8288-7f56988be64c\apps'
$appsLong = '\\?\' + $apps
if (-not (Test-Path -LiteralPath $apps)) {
  'apps_missing_already' | Out-File 'C:\GOODNIGHT_PLANET\_APPS_DELETE_RESULT.txt' -Encoding utf8
  exit 0
}
Remove-Item -LiteralPath $appsLong -Recurse -Force
'apps_removed_ok' | Out-File 'C:\GOODNIGHT_PLANET\_APPS_DELETE_RESULT.txt' -Encoding utf8
