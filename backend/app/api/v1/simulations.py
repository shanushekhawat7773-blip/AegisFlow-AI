"""
Simulation API routes for AegisFlow AI.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ...models.simulation import SimulationComparison, SimulationRunResult
from ...services.simulation_engine import simulation_engine

router = APIRouter(prefix="/simulations", tags=["simulations"])


class RunSimulationRequest(BaseModel):
    scenario_id: str
    incident_id: Optional[str] = "INC-4091"


@router.get("/scenarios/{incident_id}", response_model=SimulationComparison)
def get_scenarios(incident_id: str):
    """Retrieve counterfactual intervention candidates and recommendation analysis."""
    return simulation_engine.get_scenarios_for_incident(incident_id)


@router.post("/run", response_model=SimulationRunResult)
def run_simulation(req: RunSimulationRequest):
    """Execute deterministic counterfactual simulation for a candidate intervention."""
    return simulation_engine.run_simulation(req.scenario_id, req.incident_id or "INC-4091")
