#!/usr/bin/env bash
set -e

echo "=== Running AegisFlow AI Automated Test Suite ==="

echo "1. Running Backend Pytest..."
python -m pytest backend/tests -v

echo "2. Building Frontend Production Bundle..."
cd frontend
npm run build

echo "=== All Tests and Builds Passed Successfully ==="
