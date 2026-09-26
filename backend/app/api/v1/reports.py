"""
Incident Reports API routes for AegisFlow AI.
"""

from fastapi import APIRouter
from typing import Dict, Any
from ...services.report_generator import report_generator

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{incident_id}")
def get_incident_report(incident_id: str = "INC-4091") -> Dict[str, Any]:
    """Retrieve full executive post-incident report with timeline, causal root cause, and verified outcome."""
    return report_generator.generate_incident_report(incident_id)
