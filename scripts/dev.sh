#!/usr/bin/env bash

echo "Starting AegisFlow AI Platform..."
echo "Backend: http://127.0.0.1:8000 (Docs at /docs)"
echo "Frontend: http://localhost:3000"

python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
