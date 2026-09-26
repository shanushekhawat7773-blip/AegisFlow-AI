"""
Telemetry data models for AegisFlow AI.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum


class MetricType(str, Enum):
    THROUGHPUT = "throughput"          # Orders processed per hour
    QUEUE_DEPTH = "queue_depth"        # Pending items in sorting buffer
    SCANNER_AVAILABILITY = "scanner_availability" # % operational optical scanners
    NETWORK_LATENCY = "network_latency" # Intra-warehouse switch RTT in ms
    PACKET_LOSS = "packet_loss"        # % network packet drop
    MACHINE_HEALTH = "machine_health"  # % telemetry score across conveyor motors
    WORKFORCE_ACTIVE = "workforce_active" # Headcount utilization %
    SLA_RISK = "sla_risk"              # Current calculated SLA breach risk %


class TelemetryPoint(BaseModel):
    timestamp: str
    facility_id: str
    metrics: Dict[str, float]
    anomaly_detected: bool = False
    anomaly_score: float = 0.0


class FacilityStatus(BaseModel):
    facility_id: str
    facility_name: str
    location: str
    status: str  # "healthy", "warning", "investigating", "critical"
    current_throughput: float
    target_throughput: float
    queue_depth: int
    scanner_availability: float
    network_latency_ms: float
    packet_loss_pct: float
    active_incidents: int
    sla_risk_pct: float
    last_updated: str


class TelemetryHistory(BaseModel):
    facility_id: str
    points: List[TelemetryPoint]
