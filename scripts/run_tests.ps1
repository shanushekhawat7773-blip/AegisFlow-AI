Write-Host "=== Running AegisFlow AI Automated Test Suite ===" -ForegroundColor Cyan

Write-Host "1. Running Backend Pytest..." -ForegroundColor Yellow
python -m pytest backend/tests -v
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend tests failed!"
    exit 1
}

Write-Host "2. Building Frontend Production Bundle..." -ForegroundColor Yellow
cd frontend
npm.cmd run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed!"
    cd ..
    exit 1
}
cd ..

Write-Host "=== All Tests and Builds Passed Successfully ===" -ForegroundColor Green
