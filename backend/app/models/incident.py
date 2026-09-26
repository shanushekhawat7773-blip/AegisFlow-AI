"""
Incident and Root Cause Causal Graph models for AegisFlow AI.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum


class IncidentSeverity(str, Enum):
    P1_CRITICAL = "P1_CRITICAL"
    P2_HIGH = "P2_HIGH"
    P3_MEDIUM = "P3_MEDIUM"
    P4_LOW = "P4_LOW"


class IncidentStatus(str, Enum):
    DETECTED = "DETECTED"
    INVESTIGATING = "INVESTIGATING"
    ROOT_CAUSE_IDENTIFIED = "ROOT_CAUSE_IDENTIFIED"
    SIMULATING = "SIMULATING"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    EXECUTING = "EXECUTING"
    VERIFYING = "VERIFYING"
    RECOVERED = "RECOVERED"
    RESOLVED = "RESOLVED"


class EvidenceType(str, Enum):
    OBSERVED = "OBSERVED"        # Direct physical sensor or HTTP log metric
    CORRELATED = "CORRELATED"    # Statistically linked events across separate subsystems
    INFERRED = "INFERRED"        # Derived hypothesis through dependency topology
    PREDICTED = "PREDICTED"      # Forward-looking trajectory if unmitigated


class EvidenceItem(BaseModel):
    id: str
    title: str
    evidence_type: EvidenceType
    source: str                  # e.g., "Switch-03 Syslog", "Scanner Cluster API"
    timestamp: str
    confidence: float
    description: str
    telemetry_delta: Optional[str] = None
    raw_payload: Optional[Dict[str, Any]] = None


class CausalNode(BaseModel):
    id: str
    label: str
    subsystem: str               # "Network", "Hardware", "Software", "Queue", "Business"
    severity: str                # "critical", "warning", "nominal"
    confidence: float
    metric_value: str
    baseline_value: str
    is_root_cause: bool = False
    evidence_ids: List[str] = []


class CausalEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship: str            # "induces", "propagates_to", "degrades"
    confidence: float


class CausalGraph(BaseModel):
    nodes: List[CausalNode]
    edges: List[CausalEdge]
    root_cause_summary: str


class Incident(BaseModel):
    id: str
    title: str
    facility_id: str
    facility_name: str
    severity: IncidentSeverity
    status: IncidentStatus
    detected_at: str
    updated_at: str
    current_impact: str
    affected_systems: List[str]
    sla_risk_pct: float
    anomaly_confidence: float
    causal_graph: Optional[CausalGraph] = None
    evidence: List[EvidenceItem] = []
    investigation_summary: Optional[str] = None
    active_intervention_id: Optional[str] = None
