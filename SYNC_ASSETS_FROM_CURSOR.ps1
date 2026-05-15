# Copies Expo default assets from the Cursor workspace into this repo.
# Edit $CursorWorkspace if your path differs.

$ErrorActionPreference = "Stop"
$CursorWorkspace = "C:\Users\mush1\.cursor\projects\C-Users-mush1-AppData-Local-Temp-e1510882-f0ae-4050-8288-7f56988be64c"
$Here = $PSScriptRoot
$SrcAssets = Join-Path $CursorWorkspace "apps\mobile\assets"
$DstAssets = Join-Path $Here "apps\mobile\assets"

if (-not (Test-Path $SrcAssets)) {
  Write-Host "Source assets not found: $SrcAssets"
  Write-Host "Update `$CursorWorkspace in this script, or copy apps/mobile/assets manually from your Expo project."
  exit 1
}

New-Item -ItemType Directory -Force -Path $DstAssets | Out-Null
robocopy $SrcAssets $DstAssets /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
Write-Host "Assets synced to $DstAssets"
