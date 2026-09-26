Write-Host "Starting AegisFlow AI Platform..." -ForegroundColor Cyan
Write-Host "Backend: http://127.0.0.1:8000 (Interactive docs at /docs)" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm.cmd run dev"
