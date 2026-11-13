$ErrorActionPreference = "Stop"

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command,

        [string[]]$Arguments = @()
    )

    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Command $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

$repoRoot = $PSScriptRoot
$sharedDir = Join-Path $repoRoot "tweeter-shared"
$serverDir = Join-Path $repoRoot "tweeter-server"

Push-Location $sharedDir
try {
    Invoke-CheckedCommand -Command "npm" -Arguments @("install")
    Invoke-CheckedCommand -Command "npm" -Arguments @("run", "build")
}
finally {
    Pop-Location
}

Push-Location $serverDir
try {
    Invoke-CheckedCommand -Command "npm" -Arguments @("install")
    Invoke-CheckedCommand -Command "npm" -Arguments @("run", "build")

    # Copy ordinary dependencies, but omit tweeter-shared: npm installs this
    # file: dependency as a link to the sibling workspace, which is not part
    # of the Lambda layer artifact.
    $nodeModules = Join-Path $serverDir "node_modules"
    $layerNodeJs = Join-Path $serverDir "layer\nodejs"
    $layerModules = Join-Path $layerNodeJs "node_modules"

    if (Test-Path -LiteralPath $layerModules) {
        Remove-Item -LiteralPath $layerModules -Recurse -Force
    }
    New-Item -Path $layerModules -ItemType Directory -Force | Out-Null

    Get-ChildItem -LiteralPath $nodeModules -Force |
        Where-Object { $_.Name -ne "tweeter-shared" } |
        ForEach-Object {
            Copy-Item -LiteralPath $_.FullName -Destination $layerModules -Recurse -Force
        }

    # Install the shared package as real files so Node can resolve it from
    # /opt/nodejs/node_modules/tweeter-shared in the Lambda runtime.
    $sharedPackage = Join-Path $layerModules "tweeter-shared"
    $sharedDist = Join-Path $sharedDir "dist"
    if (-not (Test-Path -LiteralPath (Join-Path $sharedDist "index.js"))) {
        throw "Built tweeter-shared package is missing: $sharedDist\index.js"
    }

    New-Item -Path $sharedPackage -ItemType Directory -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $sharedDir "package.json") -Destination $sharedPackage
    Copy-Item -LiteralPath $sharedDist -Destination (Join-Path $sharedPackage "dist") -Recurse -Force

    $awsSamDir = Join-Path $serverDir ".aws-sam"
    if (Test-Path -LiteralPath $awsSamDir) {
        Remove-Item -LiteralPath $awsSamDir -Recurse -Force
    }

    # Keep the existing stack in place during deployment; deleting it first
    # creates downtime and can remove stack-managed resources.
    Invoke-CheckedCommand -Command "sam" -Arguments @("build")
    Invoke-CheckedCommand -Command "sam" -Arguments @(
        "deploy",
        "--no-confirm-changeset",
        "--no-fail-on-empty-changeset"
    )
}
finally {
    Pop-Location
}
