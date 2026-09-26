"""
End-to-end integration tests covering the complete 9-stage closed-loop operational workflow:
Detect -> Investigate -> Understand -> Simulate -> Recommend -> Approve -> Execute -> Verify -> Learn
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["services"]["action_gateway"] == "UP"


def test_complete_closed_loop_workflow():
    # 1. DETECT: Check telemetry and active incidents
    res = client.get("/api/v1/telemetry/facilities")
    assert res.status_code == 200
    facilities = res.json()
    wh3 = next(f for f in facilities if f["facility_id"] == "WH-03-ORD")
    assert wh3["status"] in ["critical", "investigating", "recovered"]

    # 2. INVESTIGATE: Query incident details & evidence drawer
    res = client.get("/api/v1/incidents/INC-4091")
    assert res.status_code == 200
    incident = res.json()
    assert "WH-03" in incident["facility_id"]
    assert len(incident["evidence"]) >= 4

    # 3. UNDERSTAND: Verify causal dependency graph
    causal_graph = incident["causal_graph"]
    assert causal_graph is not None
    assert len(causal_graph["nodes"]) >= 4
    root_node = next(n for n in causal_graph["nodes"] if n["is_root_cause"])
    assert "Switch" in root_node["label"]

    # 4. SIMULATE: Query counterfactual scenario options
    res = client.get("/api/v1/simulations/scenarios/INC-4091")
    assert res.status_code == 200
    sim_data = res.json()
    assert sim_data["recommended_scenario_id"] == "SCENARIO_B_REROUTE"

    # 5. RECOMMEND: Run the recommended simulation
    res = client.post("/api/v1/simulations/run", json={"scenario_id": "SCENARIO_B_REROUTE"})
    assert res.status_code == 200
    sim_run = res.json()
    assert sim_run["status"] == "COMPLETED"
    assert sim_run["predicted_throughput"] > sim_run["baseline_throughput"]

    # 6. APPROVE & 7. EXECUTE: Submit human approval to Action Gateway
    action_res = client.get("/api/v1/actions")
    actions = action_res.json()
    target_action = actions[0]

    approve_res = client.post(
        f"/api/v1/actions/{target_action['id']}/approve",
        json={
            "user_name": "Sarah Chen",
            "user_role": "OPERATOR",
            "justification": "Approved bypass for lines 4-6"
        }
    )
    assert approve_res.status_code == 200
    approved_action = approve_res.json()
    assert approved_action["status"] == "COMPLETED"

    # 8. VERIFY: Query continuous verification workspace
    verify_res = client.get("/api/v1/verification/INC-4091")
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert verify_data["verification_status"] == "VERIFIED_RECOVERED"
    assert verify_data["verification_confidence"] > 0.95

    # 9. LEARN: Query executive post-incident report
    report_res = client.get("/api/v1/reports/INC-4091")
    assert report_res.status_code == 200
    report_data = report_res.json()
    assert report_data["lifecycle_status"] == "VERIFIED_RESOLVED"
    assert "executive_summary" in report_data
