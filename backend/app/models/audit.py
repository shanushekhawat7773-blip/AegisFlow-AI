"""
Audit log models for AegisFlow AI.
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any


class AuditEntry(BaseModel):
    id: str
    sequence_number: int
    timestamp: str
    event_type: str          # "ANOMALY_TRIGGERED", "CAUSAL_INFERENCE", "SIMULATION_RUN", "HUMAN_APPROVAL", "GATEWAY_DISPATCH", "VERIFICATION_SUCCESS"
    facility_id: str
    actor: str               # "Sentinel Agent", "Operator (sarah.chen)", "Action Gateway"
    actor_role: str          # "AGENT", "OPERATOR", "ADMIN", "SECURITY"
    action_details: str
    risk_level: str          # "INFO", "LOW", "MEDIUM", "HIGH"
    payload_hash: str        # Simulated cryptographic SHA-256 integrity hash
    previous_hash: str       # Tamper-evident blockchain/ledger style sequencing
    metadata: Optional[Dict[str, Any]] = None
