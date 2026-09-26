"""
Demo Scenario Controller API routes for AegisFlow AI.
Enables instant, deterministic switching between operational scenarios for presentations.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List
from ...services.telemetry_simulator import telemetry_simulator

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


class SwitchScenarioRequest(BaseModel):
    scenario_id: str


DEMO_SCENARIOS = [
    {
        "id": "WH-03-ORD_SCANNER_OUTAGE",
        "name": "Warehouse 03 — Scanner Cluster Outage & Sorting Degradation",
        "description": "P1 Critical: Core Switch SW-03 packet loss leads to scanner timeouts, queue backup, and carrier SLA breach risk.",
        "facility_id": "WH-03-ORD",
        "severity": "P1_CRITICAL",
        "recommended_action": "traffic.reroute_processing_queue",
        "default": True
    },
    {
        "id": "WH-02-DFW_ORDER_SURGE",
        "name": "Warehouse 02 — Flash Order Surge & Queue Saturation",
        "description": "P2 High: Inbound queue exceeds 210% nominal capacity due to unforecasted supplier truck arrivals.",
        "facility_id": "WH-02-DFW",
        "severity": "P2_HIGH",
        "recommended_action": "workforce.rebalance_stations",
        "default": False
    },
    {
        "id": "BASELINE_NOMINAL",
        "name": "All Facilities — Healthy Operational Baseline",
        "description": "All 4 fulfillment hubs operating within nominal throughput, zero active anomalies, 99.4% overall health.",
        "facility_id": "ALL",
        "severity": "NOMINAL",
        "recommended_action": "none",
        "default": False
    }
]


@router.get("", response_model=List[Dict[str, Any]])
def list_scenarios():
    """List available deterministic demo scenarios."""
    return DEMO_SCENARIOS


@router.post("/switch")
def switch_scenario(req: SwitchScenarioRequest):
    """Switch active simulation scenario in real-time."""
    telemetry_simulator.set_scenario(req.scenario_id)
    return {
        "status": "SCENARIO_SWITCHED",
        "active_scenario": req.scenario_id,
        "message": f"Successfully activated scenario: {req.scenario_id}"
    }


@router.post("/reset")
def reset_demo():
    """Reset the demo state to the beginning of the Warehouse 03 flagship incident."""
    telemetry_simulator.reset_state()
    return {
        "status": "RESET_SUCCESSFUL",
        "message": "Demo state reset to initial P1 Critical incident state for Warehouse 03."
    }
