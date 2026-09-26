"""
Top-Level System Verification Test for AegisFlow AI Platform.
Predict. Investigate. Simulate. Act.
"""

import os
import json
import pytest
import sys

# Ensure backend root is on sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_required_directories_exist():
    required_dirs = ["frontend", "backend", "data", "docs", "scripts", ".github"]
    for d in required_dirs:
        path = os.path.join(root_dir, d)
        assert os.path.isdir(path), f"Directory '{d}' must exist in repository root"


def test_data_scenarios_valid_json():
    scenarios_dir = os.path.join(root_dir, "data", "scenarios")
    files = [f for f in os.listdir(scenarios_dir) if f.endswith(".json")]
    assert len(files) >= 3, "Expected at least 3 scenario datasets in data/scenarios"
    
    for f in files:
        with open(os.path.join(scenarios_dir, f), "r") as fp:
            data = json.load(fp)
            assert "scenario_id" in data
            assert "name" in data


def test_action_allowlist_structure():
    allowlist_path = os.path.join(root_dir, "data", "rules", "action_allowlist.json")
    assert os.path.isfile(allowlist_path)
    with open(allowlist_path, "r") as fp:
        rules = json.load(fp)
        assert rules["enforcement_mode"] == "STRICT_ALLOWLIST"
        assert len(rules["actions"]) >= 3


def test_all_api_endpoints_operational():
    endpoints = [
        "/health",
        "/api/v1/events",
        "/api/v1/incidents",
        "/api/v1/investigations",
        "/api/v1/root-cause",
        "/api/v1/simulations/scenarios/INC-4091",
        "/api/v1/recommendations",
        "/api/v1/approvals",
        "/api/v1/actions",
        "/api/v1/verification/INC-4091",
        "/api/v1/agents",
        "/api/v1/analytics/metrics",
        "/api/v1/audit",
        "/api/v1/audit/verify-chain",
        "/api/v1/demo",
        "/api/v1/reports/INC-4091"
    ]
    for ep in endpoints:
        res = client.get(ep)
        assert res.status_code == 200, f"Endpoint {ep} failed with status {res.status_code}"
