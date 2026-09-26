"""
Incidents and Root Cause Investigation API routes for AegisFlow AI.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from ...models.incident import Incident, CausalGraph, EvidenceItem
from ...services.root_cause_engine import root_cause_engine
from ...services.telemetry_simulator import telemetry_simulator

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.get("", response_model=List[Incident])
def list_incidents():
    """List current active and recently resolved incidents."""
    incidents = []
    # Primary incident (WH-03)
    incidents.append(
        root_cause_engine.get_incident_details(
            "INC-4091", action_executed=telemetry_simulator.action_executed
        )
    )
    # Secondary incident (WH-02)
    incidents.append(
        root_cause_engine.get_incident_details(
            "INC-4089", action_executed=False
        )
    )
    return incidents


@router.get("/{incident_id}", response_model=Incident)
def get_incident(incident_id: str):
    """Retrieve full incident details including causal graph and evidence drawer."""
    return root_cause_engine.get_incident_details(
        incident_id, action_executed=telemetry_simulator.action_executed
    )


@router.get("/{incident_id}/causal-graph", response_model=CausalGraph)
def get_causal_graph(incident_id: str):
    """Retrieve causal dependency network for visual node-link rendering."""
    incident = root_cause_engine.get_incident_details(
        incident_id, action_executed=telemetry_simulator.action_executed
    )
    if not incident.causal_graph:
        raise HTTPException(status_code=404, detail="No causal graph available for this incident.")
    return incident.causal_graph


@router.get("/{incident_id}/evidence", response_model=List[EvidenceItem])
def get_evidence(incident_id: str):
    """Retrieve verified and categorized evidence items."""
    incident = root_cause_engine.get_incident_details(
        incident_id, action_executed=telemetry_simulator.action_executed
    )
    return incident.evidence
