# Sanjeevani 2.0 Deployment Verification Script for Windows
# This script helps verify the deployment of Sanjeevani 2.0

# Text colors
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

Write-Host "=== Sanjeevani 2.0 Deployment Verification Script ===" -ForegroundColor $Blue
Write-Host "This script will help you verify the deployment of Sanjeevani 2.0." -ForegroundColor $Yellow
Write-Host ""

# Function to check if a URL is accessible
function Test-Url {
    param (
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "Checking $Description at $Url..." -ForegroundColor $Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $Description is accessible." -ForegroundColor $Green
            return $true
        } else {
            Write-Host "❌ $Description returned status code $($response.StatusCode)." -ForegroundColor $Red
            return $false
        }
    } catch {
        Write-Host "❌ $Description is not accessible: $_" -ForegroundColor $Red
        return $false
    }
}

# Get deployment URLs
$FrontendUrl = Read-Host "Enter frontend URL (e.g., https://sanjeevani-health.netlify.app)"
$BackendUrl = Read-Host "Enter backend URL (e.g., https://sanjeevani-api.onrender.com)"

# Verify frontend deployment
$frontendSuccess = Test-Url -Url $FrontendUrl -Description "Frontend"

# Verify backend deployment
$backendSuccess = Test-Url -Url "$BackendUrl/api/v1" -Description "Backend API"

# Verify backend health check
$healthCheckSuccess = Test-Url -Url "$BackendUrl/health" -Description "Backend health check"

# Verify GitHub repository
$GitHubUsername = Read-Host "Enter your GitHub username"
$RepoName = Read-Host "Enter repository name (default: sanjeevani-2.0)"
if ([string]::IsNullOrEmpty($RepoName)) {
    $RepoName = "sanjeevani-2.0"
}

$repoUrl = "https://github.com/$GitHubUsername/$RepoName"
$repoSuccess = Test-Url -Url $repoUrl -Description "GitHub repository"

# Verify GitHub Actions workflows
$workflowsUrl = "https://github.com/$GitHubUsername/$RepoName/actions"
$workflowsSuccess = Test-Url -Url $workflowsUrl -Description "GitHub Actions workflows"

# Summary
Write-Host ""
Write-Host "Deployment Verification Summary:" -ForegroundColor $Blue
Write-Host "Frontend: $(if ($frontendSuccess) { "✅ Accessible" } else { "❌ Not accessible" })" -ForegroundColor $(if ($frontendSuccess) { $Green } else { $Red })
Write-Host "Backend API: $(if ($backendSuccess) { "✅ Accessible" } else { "❌ Not accessible" })" -ForegroundColor $(if ($backendSuccess) { $Green } else { $Red })
Write-Host "Backend Health Check: $(if ($healthCheckSuccess) { "✅ Accessible" } else { "❌ Not accessible" })" -ForegroundColor $(if ($healthCheckSuccess) { $Green } else { $Red })
Write-Host "GitHub Repository: $(if ($repoSuccess) { "✅ Accessible" } else { "❌ Not accessible" })" -ForegroundColor $(if ($repoSuccess) { $Green } else { $Red })
Write-Host "GitHub Actions Workflows: $(if ($workflowsSuccess) { "✅ Accessible" } else { "❌ Not accessible" })" -ForegroundColor $(if ($workflowsSuccess) { $Green } else { $Red })

# Overall status
$overallSuccess = $frontendSuccess -and $backendSuccess -and $healthCheckSuccess -and $repoSuccess -and $workflowsSuccess
Write-Host ""
if ($overallSuccess) {
    Write-Host "✅ Deployment verification successful! All components are accessible." -ForegroundColor $Green
} else {
    Write-Host "❌ Deployment verification failed. Some components are not accessible." -ForegroundColor $Red
    
    # Provide troubleshooting guidance
    Write-Host ""
    Write-Host "Troubleshooting Guidance:" -ForegroundColor $Yellow
    
    if (-not $frontendSuccess) {
        Write-Host "Frontend Issues:" -ForegroundColor $Yellow
        Write-Host "1. Check Netlify deployment status" -ForegroundColor $Blue
        Write-Host "2. Verify build settings in Netlify" -ForegroundColor $Blue
        Write-Host "3. Check for build errors in Netlify logs" -ForegroundColor $Blue
        Write-Host "4. Ensure environment variables are set correctly" -ForegroundColor $Blue
    }
    
    if (-not $backendSuccess -or -not $healthCheckSuccess) {
        Write-Host "Backend Issues:" -ForegroundColor $Yellow
        Write-Host "1. Check Render deployment status" -ForegroundColor $Blue
        Write-Host "2. Verify build settings in Render" -ForegroundColor $Blue
        Write-Host "3. Check for build errors in Render logs" -ForegroundColor $Blue
        Write-Host "4. Ensure environment variables are set correctly" -ForegroundColor $Blue
        Write-Host "5. Check MongoDB connection" -ForegroundColor $Blue
    }
    
    if (-not $repoSuccess -or -not $workflowsSuccess) {
        Write-Host "GitHub Issues:" -ForegroundColor $Yellow
        Write-Host "1. Verify repository exists and is accessible" -ForegroundColor $Blue
        Write-Host "2. Check GitHub Actions workflows configuration" -ForegroundColor $Blue
        Write-Host "3. Ensure GitHub Secrets are set correctly" -ForegroundColor $Blue
    }
}

# Next steps
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor $Blue
if ($overallSuccess) {
    Write-Host "1. Set up monitoring and alerting" -ForegroundColor $Blue
    Write-Host "2. Configure custom domains" -ForegroundColor $Blue
    Write-Host "3. Set up SSL certificates" -ForegroundColor $Blue
    Write-Host "4. Perform final testing" -ForegroundColor $Blue
} else {
    Write-Host "1. Fix deployment issues" -ForegroundColor $Blue
    Write-Host "2. Re-run this verification script" -ForegroundColor $Blue
    Write-Host "3. Once all issues are resolved, proceed with post-deployment tasks" -ForegroundColor $Blue
}

Write-Host ""
Write-Host "For more information, refer to the documentation:" -ForegroundColor $Yellow
Write-Host "- DEPLOYMENT.md" -ForegroundColor $Yellow
Write-Host "- MONITORING.md" -ForegroundColor $Yellow
Write-Host "- SECURITY.md" -ForegroundColor $Yellow
