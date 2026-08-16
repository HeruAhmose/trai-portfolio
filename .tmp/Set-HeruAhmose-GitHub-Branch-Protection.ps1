#requires -Version 7.0
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$Owner = 'HeruAhmose',

    [ValidateNotNullOrEmpty()]
    [string[]]$Repositories = @(
        'QueenCalifia-CyberAI',
        'techbridge-collective',
        'tamerian-materials',
        'peoples-portfolio',
        'blue-gold-daily',
        'trai-portfolio'
    ),

    [ValidateRange(0, 6)]
    [int]$Approvals = 0,

    [switch]$Apply,
    [switch]$SkipRequiredChecks,
    [string]$EvidenceRoot = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$ApiRoot = 'https://api.github.com'
$ApiVersion = '2026-03-10'
$GoodConclusions = @('success', 'neutral', 'skipped')
$ExcludedChecks = '(?i)(^CodeQL$|dependabot|deploy|deployment|pages|vercel|netlify|cloudflare|preview|argocd|refresh|update[-_ ]?pip|publish|release|artifact)'

if ([string]::IsNullOrWhiteSpace($EvidenceRoot)) {
    $EvidenceRoot = Join-Path (Join-Path $HOME 'Downloads') ("github-branch-protection-{0}" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
}
New-Item -ItemType Directory -Path $EvidenceRoot -Force | Out-Null

function ConvertTo-PlainText {
    param([Parameter(Mandatory)][Security.SecureString]$SecureString)
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

function Get-Token {
    if (-not [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) {
        return $env:GITHUB_TOKEN.Trim()
    }

    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if ($null -ne $gh) {
        $candidate = (& $gh.Source auth token 2>$null | Select-Object -First 1)
        if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace([string]$candidate)) {
            return ([string]$candidate).Trim()
        }
    }

    Write-Host 'A GitHub token with Administration: write is required.' -ForegroundColor Yellow
    $secure = Read-Host 'GitHub token (hidden)' -AsSecureString
    $token = ConvertTo-PlainText $secure
    if ([string]::IsNullOrWhiteSpace($token)) { throw 'GitHub token was empty.' }
    return $token.Trim()
}

$Token = Get-Token
$Headers = @{
    Accept = 'application/vnd.github+json'
    Authorization = "Bearer $Token"
    'X-GitHub-Api-Version' = $ApiVersion
    'User-Agent' = 'HeruAhmose-Branch-Protection-Control-Plane/1.0'
}

function Invoke-GH {
    param(
        [Parameter(Mandatory)][ValidateSet('GET', 'PUT', 'DELETE')][string]$Method,
        [Parameter(Mandatory)][string]$Path,
        [AllowNull()][object]$Body = $null,
        [int[]]$AllowStatus = @()
    )

    $request = @{
        Uri = "$ApiRoot/$($Path.TrimStart('/'))"
        Method = $Method
        Headers = $Headers
        SkipHttpErrorCheck = $true
        ErrorAction = 'Stop'
    }
    if ($null -ne $Body) {
        $request.Body = $Body | ConvertTo-Json -Depth 50 -Compress
        $request.ContentType = 'application/json'
    }

    $response = Invoke-WebRequest @request
    $status = [int]$response.StatusCode
    if (($status -lt 200 -or $status -ge 300) -and $AllowStatus -notcontains $status) {
        $text = [string]$response.Content
        if ($text.Length -gt 1000) { $text = $text.Substring(0, 1000) + '...' }
        throw "GitHub API $Method $Path failed with HTTP $status. $text"
    }

    $data = $null
    if (-not [string]::IsNullOrWhiteSpace([string]$response.Content)) {
        $data = $response.Content | ConvertFrom-Json -Depth 100
    }
    [pscustomobject]@{ StatusCode = $status; Data = $data }
}

function Save-Json {
    param([Parameter(Mandatory)][string]$Path, [AllowNull()][object]$Value)
    if ($null -eq $Value) {
        Set-Content -LiteralPath $Path -Value 'null' -Encoding utf8NoBOM
    } else {
        $Value | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $Path -Encoding utf8NoBOM
    }
}

function Enabled {
    param([AllowNull()][object]$Value)
    if ($null -eq $Value) { return $false }
    if ($Value.PSObject.Properties.Name -contains 'enabled') { return [bool]$Value.enabled }
    return [bool]$Value
}

function Get-Contexts {
    param([AllowNull()][object]$Protection)
    if ($null -eq $Protection -or $null -eq $Protection.required_status_checks) { return @() }

    $names = @()
    $status = $Protection.required_status_checks
    if ($status.PSObject.Properties.Name -contains 'contexts' -and $null -ne $status.contexts) {
        $names += @($status.contexts | ForEach-Object { [string]$_ })
    }
    if ($status.PSObject.Properties.Name -contains 'checks' -and $null -ne $status.checks) {
        $names += @($status.checks | ForEach-Object { [string]$_.context })
    }
    @($names | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
}

function Get-HealthyChecks {
    param([Parameter(Mandatory)][string]$Repo, [Parameter(Mandatory)][string]$Sha)
    $runs = @((Invoke-GH GET "repos/$Owner/$Repo/commits/$Sha/check-runs?per_page=100").Data.check_runs)
    @(
        $runs |
            Where-Object {
                $_.status -eq 'completed' -and
                $GoodConclusions -contains [string]$_.conclusion -and
                [string]$_.name -notmatch $ExcludedChecks
            } |
            ForEach-Object {
                [pscustomobject]@{
                    Name = [string]$_.name
                    AppId = if ($null -ne $_.app) { [int64]$_.app.id } else { [int64]-1 }
                }
            } |
            Sort-Object Name, AppId -Unique
    )
}

function Get-LatestMergedPR {
    param([Parameter(Mandatory)][string]$Repo, [Parameter(Mandatory)][string]$Branch)
    $base = [Uri]::EscapeDataString($Branch)
    $prs = @((Invoke-GH GET "repos/$Owner/$Repo/pulls?state=closed&base=$base&sort=updated&direction=desc&per_page=30").Data)
    $match = @($prs | Where-Object { $null -ne $_.merged_at } | Select-Object -First 1)
    if ($match.Count -eq 0) { return $null }
    $match[0]
}

function Get-StableChecks {
    param(
        [Parameter(Mandatory)][string]$Repo,
        [Parameter(Mandatory)][string]$MainSha,
        [Parameter(Mandatory)][object]$MergedPR
    )

    $main = @(Get-HealthyChecks $Repo $MainSha)
    $pr = @(Get-HealthyChecks $Repo ([string]$MergedPR.head.sha))
    $index = @{}
    foreach ($check in $main) { $index["$($check.Name)|$($check.AppId)"] = $check }

    $stable = @()
    foreach ($check in $pr) {
        $key = "$($check.Name)|$($check.AppId)"
        if ($index.ContainsKey($key)) { $stable += $index[$key] }
    }
    @($stable | Sort-Object Name, AppId -Unique)
}

function To-RestoreBody {
    param([AllowNull()][object]$Protection)
    if ($null -eq $Protection) { return $null }

    $checks = $null
    if ($null -ne $Protection.required_status_checks) {
        $checks = [ordered]@{
            strict = [bool]$Protection.required_status_checks.strict
            contexts = @(Get-Contexts $Protection)
        }
    }

    $reviews = $null
    if ($null -ne $Protection.required_pull_request_reviews) {
        $reviews = [ordered]@{
            dismiss_stale_reviews = [bool]$Protection.required_pull_request_reviews.dismiss_stale_reviews
            require_code_owner_reviews = [bool]$Protection.required_pull_request_reviews.require_code_owner_reviews
            required_approving_review_count = [int]$Protection.required_pull_request_reviews.required_approving_review_count
            require_last_push_approval = [bool]$Protection.required_pull_request_reviews.require_last_push_approval
        }
    }

    [ordered]@{
        required_status_checks = $checks
        enforce_admins = Enabled $Protection.enforce_admins
        required_pull_request_reviews = $reviews
        restrictions = $null
        required_linear_history = Enabled $Protection.required_linear_history
        allow_force_pushes = Enabled $Protection.allow_force_pushes
        allow_deletions = Enabled $Protection.allow_deletions
        block_creations = Enabled $Protection.block_creations
        required_conversation_resolution = Enabled $Protection.required_conversation_resolution
        lock_branch = Enabled $Protection.lock_branch
        allow_fork_syncing = Enabled $Protection.allow_fork_syncing
    }
}

function New-TargetBody {
    param(
        [AllowNull()][object]$Existing,
        [Parameter(Mandatory)][string[]]$Contexts,
        [Parameter(Mandatory)][int]$MinimumApprovals
    )

    $oldCount = 0
    $codeOwners = $false
    $lastPush = $false
    if ($null -ne $Existing -and $null -ne $Existing.required_pull_request_reviews) {
        $oldCount = [int]$Existing.required_pull_request_reviews.required_approving_review_count
        $codeOwners = [bool]$Existing.required_pull_request_reviews.require_code_owner_reviews
        $lastPush = [bool]$Existing.required_pull_request_reviews.require_last_push_approval
    }

    $reviews = [ordered]@{
        dismiss_stale_reviews = $true
        require_code_owner_reviews = $codeOwners
        required_approving_review_count = [Math]::Max($oldCount, $MinimumApprovals)
        require_last_push_approval = $lastPush
    }

    $checks = $null
    if ($Contexts.Count -gt 0) {
        $checks = [ordered]@{ strict = $true; contexts = @($Contexts | Sort-Object -Unique) }
    }

    [ordered]@{
        required_status_checks = $checks
        enforce_admins = $true
        required_pull_request_reviews = $reviews
        restrictions = $null
        required_linear_history = if ($null -ne $Existing) { Enabled $Existing.required_linear_history } else { $false }
        allow_force_pushes = $false
        allow_deletions = $false
        block_creations = if ($null -ne $Existing) { Enabled $Existing.block_creations } else { $false }
        required_conversation_resolution = $true
        lock_branch = if ($null -ne $Existing) { Enabled $Existing.lock_branch } else { $false }
        allow_fork_syncing = if ($null -ne $Existing) { Enabled $Existing.allow_fork_syncing } else { $false }
    }
}

function Verify-Protection {
    param(
        [Parameter(Mandatory)][object]$Protection,
        [Parameter(Mandatory)][string[]]$ExpectedContexts,
        [Parameter(Mandatory)][int]$MinimumApprovals
    )

    $errors = @()
    if (-not (Enabled $Protection.enforce_admins)) { $errors += 'administrators are not enforced' }
    if ($null -eq $Protection.required_pull_request_reviews) {
        $errors += 'pull requests are not required'
    } else {
        if ([int]$Protection.required_pull_request_reviews.required_approving_review_count -lt $MinimumApprovals) {
            $errors += "approval count is below $MinimumApprovals"
        }
        if (-not [bool]$Protection.required_pull_request_reviews.dismiss_stale_reviews) {
            $errors += 'stale approvals are not dismissed'
        }
    }
    if (Enabled $Protection.allow_force_pushes) { $errors += 'force pushes are allowed' }
    if (Enabled $Protection.allow_deletions) { $errors += 'branch deletion is allowed' }
    if (-not (Enabled $Protection.required_conversation_resolution)) { $errors += 'conversation resolution is not required' }

    if ($ExpectedContexts.Count -gt 0) {
        if ($null -eq $Protection.required_status_checks) {
            $errors += 'required status checks are disabled'
        } else {
            if (-not [bool]$Protection.required_status_checks.strict) { $errors += 'status checks are not strict' }
            $actual = @(Get-Contexts $Protection)
            foreach ($name in $ExpectedContexts) {
                if ($actual -notcontains $name) { $errors += "missing required check: $name" }
            }
        }
    }
    @($errors)
}

$identity = (Invoke-GH GET 'user').Data.login
Write-Host "Authenticated as $identity" -ForegroundColor Cyan
Write-Host "Evidence: $EvidenceRoot" -ForegroundColor Cyan

$plans = @()
foreach ($repo in $Repositories) {
    Write-Host "`n=== PLAN $Owner/$repo ===" -ForegroundColor Cyan
    $meta = (Invoke-GH GET "repos/$Owner/$repo").Data
    if ([string]$meta.owner.type -ne 'User') {
        throw "$Owner/$repo is not user-owned; this script intentionally refuses organization restriction semantics."
    }
    if (-not [bool]$meta.permissions.admin) { throw "Admin permission is required for $Owner/$repo." }

    $branch = [string]$meta.default_branch
    $encoded = [Uri]::EscapeDataString($branch)
    $branchData = (Invoke-GH GET "repos/$Owner/$repo/branches/$encoded").Data
    $mainSha = [string]$branchData.commit.sha
    $wasProtected = [bool]$branchData.protected

    $protectionResponse = Invoke-GH GET "repos/$Owner/$repo/branches/$encoded/protection" $null @(404)
    $existing = if ($protectionResponse.StatusCode -eq 200) { $protectionResponse.Data } else { $null }
    if ($wasProtected -and $null -eq $existing) {
        throw "$Owner/$repo reports protected=true but its full protection object could not be read."
    }

    Save-Json (Join-Path $EvidenceRoot "$repo-before.json") $existing

    $latestPR = Get-LatestMergedPR $repo $branch
    if ($null -eq $latestPR) { throw "No merged PR found for $Owner/$repo; refusing blind check selection." }

    $stable = @(Get-StableChecks $repo $mainSha $latestPR)
    $stableNames = @($stable | ForEach-Object { $_.Name } | Sort-Object -Unique)
    $existingNames = @(Get-Contexts $existing)
    $contexts = @($existingNames)
    if (-not $SkipRequiredChecks) {
        $contexts = @(($existingNames + $stableNames) | Sort-Object -Unique)
        if ($contexts.Count -eq 0) { throw "No stable CI checks found for $Owner/$repo." }
    }

    $target = New-TargetBody $existing $contexts $Approvals
    $plans += [pscustomobject]@{
        Repo = $repo
        Branch = $branch
        MainSha = $mainSha
        WasProtected = $wasProtected
        LatestPR = [int]$latestPR.number
        LatestPRHead = [string]$latestPR.head.sha
        StableChecks = $stable
        Contexts = $contexts
        Target = $target
        Restore = To-RestoreBody $existing
    }

    Write-Host "main SHA: $mainSha"
    Write-Host "protected before: $wasProtected"
    Write-Host "check discovery PR: #$([int]$latestPR.number)"
    foreach ($name in $contexts) { Write-Host "required check: $name" }
}

$planEvidence = @($plans | ForEach-Object {
    [ordered]@{
        repository = "$Owner/$($_.Repo)"
        branch = $_.Branch
        main_sha = $_.MainSha
        protected_before = $_.WasProtected
        latest_merged_pr = $_.LatestPR
        latest_merged_pr_head = $_.LatestPRHead
        stable_checks = $_.StableChecks
        required_contexts = $_.Contexts
        target = $_.Target
    }
})
Save-Json (Join-Path $EvidenceRoot 'plan.json') $planEvidence

$plans | Select-Object @{N='Repository';E={"$Owner/$($_.Repo)"}}, Branch, @{N='ProtectedBefore';E={$_.WasProtected}}, @{N='Checks';E={$_.Contexts.Count}}, @{N='Approvals';E={[int]$_.Target.required_pull_request_reviews.required_approving_review_count}} | Format-Table -AutoSize

if (-not $Apply) {
    Write-Host "`nPLAN ONLY — no settings changed. Re-run with -Apply to execute." -ForegroundColor Green
    return
}

$applied = @()
try {
    foreach ($plan in $plans) {
        Write-Host "`n=== APPLY $Owner/$($plan.Repo) ===" -ForegroundColor Cyan
        $encoded = [Uri]::EscapeDataString($plan.Branch)
        $fresh = (Invoke-GH GET "repos/$Owner/$($plan.Repo)/branches/$encoded").Data
        if ([string]$fresh.commit.sha -ne [string]$plan.MainSha) {
            throw "Race guard: $Owner/$($plan.Repo) advanced from $($plan.MainSha) to $($fresh.commit.sha). Re-run to rebuild the plan."
        }

        [void](Invoke-GH PUT "repos/$Owner/$($plan.Repo)/branches/$encoded/protection" $plan.Target)
        $after = (Invoke-GH GET "repos/$Owner/$($plan.Repo)/branches/$encoded/protection").Data
        $targetApprovals = [int]$plan.Target.required_pull_request_reviews.required_approving_review_count
        $problems = @(Verify-Protection $after $plan.Contexts $targetApprovals)
        if ($problems.Count -gt 0) { throw "Verification failed: $($problems -join '; ')" }

        $branchAfter = (Invoke-GH GET "repos/$Owner/$($plan.Repo)/branches/$encoded").Data
        if (-not [bool]$branchAfter.protected) { throw 'Branch still reports protected=false.' }

        $applied += $plan
        Save-Json (Join-Path $EvidenceRoot "$($plan.Repo)-after.json") $after
        Write-Host 'APPLIED AND VERIFIED' -ForegroundColor Green
    }
}
catch {
    $original = $_
    Write-Host "`nAPPLY FAILED — rolling back settings changed in this run." -ForegroundColor Red
    $rollback = @($applied)
    [array]::Reverse($rollback)
    foreach ($plan in $rollback) {
        try {
            $encoded = [Uri]::EscapeDataString($plan.Branch)
            if ($plan.WasProtected) {
                [void](Invoke-GH PUT "repos/$Owner/$($plan.Repo)/branches/$encoded/protection" $plan.Restore)
            } else {
                [void](Invoke-GH DELETE "repos/$Owner/$($plan.Repo)/branches/$encoded/protection" $null @(404))
            }
            Write-Host "Rolled back $Owner/$($plan.Repo)" -ForegroundColor Yellow
        }
        catch {
            Write-Host "ROLLBACK WARNING $Owner/$($plan.Repo): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    throw "Protection transaction failed. Original error: $($original.Exception.Message)"
}

$final = @()
foreach ($plan in $plans) {
    $encoded = [Uri]::EscapeDataString($plan.Branch)
    $branch = (Invoke-GH GET "repos/$Owner/$($plan.Repo)/branches/$encoded").Data
    $protection = (Invoke-GH GET "repos/$Owner/$($plan.Repo)/branches/$encoded/protection").Data
    $targetApprovals = [int]$plan.Target.required_pull_request_reviews.required_approving_review_count
    $problems = @(Verify-Protection $protection $plan.Contexts $targetApprovals)

    $final += [pscustomobject]@{
        Repository = "$Owner/$($plan.Repo)"
        Protected = [bool]$branch.protected
        Checks = @(Get-Contexts $protection).Count
        EnforceAdmins = Enabled $protection.enforce_admins
        Approvals = [int]$protection.required_pull_request_reviews.required_approving_review_count
        Conversations = Enabled $protection.required_conversation_resolution
        ForcePushes = Enabled $protection.allow_force_pushes
        Deletions = Enabled $protection.allow_deletions
        Result = if ($problems.Count -eq 0 -and [bool]$branch.protected) { 'PASS' } else { $problems -join '; ' }
    }
}

Save-Json (Join-Path $EvidenceRoot 'final.json') $final
Write-Host "`n=== FINAL ===" -ForegroundColor Cyan
$final | Format-Table -AutoSize

$failed = @($final | Where-Object { $_.Result -ne 'PASS' })
if ($failed.Count -gt 0) { throw "Final verification failed: $($failed.Repository -join ', ')" }
Write-Host "`nALL SIX REPOSITORIES ARE PROTECTED AND VERIFIED." -ForegroundColor Green
