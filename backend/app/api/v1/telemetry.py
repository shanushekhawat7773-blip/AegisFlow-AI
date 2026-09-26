"""
Telemetry API routes for AegisFlow AI.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List
from ...models.telemetry import FacilityStatus, TelemetryHistory
from ...services.telemetry_simulator import telemetry_simulator

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


@router.get("/facilities", response_model=List[FacilityStatus])
def get_facilities():
    """Retrieve real-time status across all operational fulfillment hubs."""
    return telemetry_simulator.get_all_facilities()


@router.get("/facility/{facility_id}", response_model=FacilityStatus)
def get_facility(facility_id: str):
    """Retrieve detailed real-time telemetry for a specific facility."""
    try:
        return telemetry_simulator.get_facility_status(facility_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/history/{facility_id}", response_model=TelemetryHistory)
def get_history(facility_id: str, minutes: int = Query(default=30, ge=5, le=120)):
    """Retrieve time-series telemetry points for high-density charting."""
    return telemetry_simulator.get_telemetry_history(facility_id, minutes)
