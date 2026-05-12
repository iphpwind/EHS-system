$r = Invoke-RestMethod -Uri 'http://127.0.0.1:3001/api/system/menu/getRouters' -Headers @{'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoxLCJyb2xlIjoxLCJpYXQiOjE3NDY2MDQ4MDAsImV4cCI6MTc0OTIwMDAwMH0.fake'} -TimeoutSec 10
Write-Host ('Count: ' + $r.data.Count)
foreach ($item in $r.data) {
    Write-Host $item.meta.title
    if ($item.children) {
        foreach ($child in $item.children) {
            Write-Host ('  - ' + $child.meta.title)
        }
    }
}
