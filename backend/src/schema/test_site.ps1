Start-Sleep 2
try {
    $r = Invoke-WebRequest -Uri 'http://localhost/' -TimeoutSec 10 -UseBasicParsing
    Write-Host ('Status: ' + $r.StatusCode)
    Write-Host ('Length: ' + $r.RawContentLength)
} catch {
    Write-Host 'Error: ' $_.Exception.Message
}
