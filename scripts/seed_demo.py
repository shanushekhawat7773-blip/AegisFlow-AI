"""
AegisFlow AI - Demo Seed & Verification Utility
Predict. Investigate. Simulate. Act.
"""

import sys
import os

# Ensure backend on path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.services.telemetry_simulator import telemetry_simulator
from app.services.root_cause_engine import root_cause_engine
from app.services.simulation_engine import simulation_engine
from app.services.action_gateway import action_gateway
from app.services.verification_engine import verification_engine


def seed_and_verify():
    print("[AegisFlow AI] Initializing deterministic demo state...")
    telemetry_simulator.reset_state()
    
    # 1. Telemetry check
    facs = telemetry_simulator.get_all_facilities()
    print(f" -> Telemetry Stream: {len(facs)} regional hubs initialized.")
    
    # 2. Incident & Root Cause check
    inc = root_cause_engine.get_incident_details("INC-4091")
    print(f" -> Active Incident: #{inc.id} ({inc.severity.value}) - {inc.title}")
    print(f" -> Causal Graph: {len(inc.causal_graph.nodes)} nodes, {len(inc.causal_graph.edges)} edges.")
    
    # 3. Simulation check
    comp = simulation_engine.get_scenarios_for_incident("INC-4091")
    print(f" -> Simulation Scenarios: {len(comp.scenarios)} options evaluated.")
    print(f" -> Recommended: {comp.recommended_scenario_id}")
    
    # 4. Action Gateway check
    actions = action_gateway.list_actions()
    print(f" -> Action Gateway: {len(actions)} actions in queue. Allowlist active.")
    
    # 5. Verification check
    ver = verification_engine.get_verification_status("INC-4091")
    print(f" -> Verification Status: {ver['verification_status']}")
    
    print("[AegisFlow AI] Demo environment seed verified successfully.")


if __name__ == "__main__":
    seed_and_verify()
