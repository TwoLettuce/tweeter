$ErrorActionPreference = "Stop"

function Invoke-ProjectScript {
    param (
        [string]$Project,
        [string]$Script
    )

    Push-Location -LiteralPath (Join-Path $PSScriptRoot $Project)
    try {
        Write-Host "Running npm run $Script in $Project..."
        & npm.cmd run $Script
        if ($LASTEXITCODE -ne 0) {
            throw "npm run $Script failed in $Project (exit code $LASTEXITCODE)."
        }
    }
    finally {
        Pop-Location
    }
}

Invoke-ProjectScript -Project "tweeter-shared" -Script "build"
Invoke-ProjectScript -Project "tweeter-web" -Script "build"
Invoke-ProjectScript -Project "tweeter-web" -Script "start"
