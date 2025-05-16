# Sanjeevani 2.0 PDF Generator (PowerShell Version)
# This script converts Markdown files to HTML for easier viewing

Write-Host "=== Sanjeevani 2.0 HTML Document Generator ===" -ForegroundColor Cyan
Write-Host "This script converts Markdown files to HTML for easier viewing." -ForegroundColor Yellow
Write-Host ""

# Function to convert Markdown to HTML
function Convert-MarkdownToHtml {
    param (
        [string]$InputFile,
        [string]$OutputFile
    )
    
    Write-Host "Converting $InputFile to $OutputFile..." -ForegroundColor Green
    
    # Read the Markdown content
    $markdownContent = Get-Content -Path $InputFile -Raw
    
    # Create HTML header
    $htmlHeader = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sanjeevani 2.0 - $(Split-Path -Path $InputFile -Leaf)</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        h1 {
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            margin-top: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        code {
            background-color: #f8f8f8;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        pre {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        blockquote {
            border-left: 4px solid #3498db;
            padding-left: 15px;
            color: #555;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
"@
    
    # Create HTML footer
    $htmlFooter = @"
</body>
</html>
"@
    
    # Simple Markdown to HTML conversion
    $htmlContent = $markdownContent
    
    # Convert headers
    $htmlContent = $htmlContent -replace '# (.*)', '<h1>$1</h1>'
    $htmlContent = $htmlContent -replace '## (.*)', '<h2>$1</h2>'
    $htmlContent = $htmlContent -replace '### (.*)', '<h3>$1</h3>'
    $htmlContent = $htmlContent -replace '#### (.*)', '<h4>$1</h4>'
    $htmlContent = $htmlContent -replace '##### (.*)', '<h5>$1</h5>'
    $htmlContent = $htmlContent -replace '###### (.*)', '<h6>$1</h6>'
    
    # Convert emphasis
    $htmlContent = $htmlContent -replace '\*\*(.*?)\*\*', '<strong>$1</strong>'
    $htmlContent = $htmlContent -replace '\*(.*?)\*', '<em>$1</em>'
    
    # Convert lists
    $htmlContent = $htmlContent -replace '- (.*)', '<li>$1</li>'
    $htmlContent = $htmlContent -replace '1\. (.*)', '<li>$1</li>'
    
    # Convert code blocks
    $htmlContent = $htmlContent -replace '```(.*?)```', '<pre><code>$1</code></pre>'
    
    # Convert inline code
    $htmlContent = $htmlContent -replace '`(.*?)`', '<code>$1</code>'
    
    # Convert links
    $htmlContent = $htmlContent -replace '\[(.*?)\]\((.*?)\)', '<a href="$2">$1</a>'
    
    # Convert paragraphs
    $htmlContent = $htmlContent -replace '(\r?\n){2,}', '</p><p>'
    $htmlContent = "<p>$htmlContent</p>"
    
    # Combine HTML
    $fullHtml = $htmlHeader + $htmlContent + $htmlFooter
    
    # Write HTML to file
    Set-Content -Path $OutputFile -Value $fullHtml
    
    if (Test-Path $OutputFile) {
        Write-Host "Successfully converted $InputFile to $OutputFile" -ForegroundColor Green
        return $true
    } else {
        Write-Host "Failed to convert $InputFile to $OutputFile" -ForegroundColor Red
        return $false
    }
}

# Get input file
$inputFile = if ($args.Count -gt 0) { $args[0] } else { "HANDOFF.md" }
if (-not (Test-Path $inputFile)) {
    Write-Host "Error: $inputFile not found." -ForegroundColor Red
    exit 1
}

# Get output file
$outputFile = if ($args.Count -gt 1) { $args[1] } else { $inputFile -replace '\.md$', '.html' }

# Convert Markdown to HTML
$success = Convert-MarkdownToHtml -InputFile $inputFile -OutputFile $outputFile

if ($success) {
    # Open the HTML file in the default browser
    Write-Host "Opening $outputFile in the default browser..." -ForegroundColor Green
    Start-Process $outputFile
} else {
    Write-Host "HTML generation failed." -ForegroundColor Red
    exit 1
}

# Generate HTML for other documentation files
$generateMore = Read-Host "Do you want to generate HTML for other documentation files? (y/n)"
if ($generateMore -eq "y" -or $generateMore -eq "Y") {
    $files = @("DEPLOYMENT.md", "DEPLOYMENT_CHECKLIST.md", "MONITORING.md", "SECURITY.md")
    foreach ($file in $files) {
        if (Test-Path $file) {
            $output = $file -replace '\.md$', '.html'
            $success = Convert-MarkdownToHtml -InputFile $file -OutputFile $output
            if ($success) {
                Write-Host "Successfully converted $file to $output" -ForegroundColor Green
            }
        } else {
            Write-Host "File $file not found, skipping." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "All HTML generation tasks completed!" -ForegroundColor Green
