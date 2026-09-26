"""
Verification API routes for AegisFlow AI.
"""

from fastapi import APIRouter
from typing import Dict, Any
from ...services.verification_engine import verification_engine

router = APIRouter(prefix="/verification", tags=["verification"])


@router.get("/{incident_id}")
def get_verification(incident_id: str = "INC-4091") -> Dict[str, Any]:
    """Retrieve real-time before vs after verification diff, SLA delta, and recovery verdict."""
    return verification_engine.get_verification_status(incident_id)
