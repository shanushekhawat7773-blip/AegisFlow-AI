"""
Counterfactual Simulation models for AegisFlow AI.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum


class RiskTier(str, Enum):
    LOW = "LOW"        # Tier 1: Auto-executable / fully reversible
    MEDIUM = "MEDIUM"  # Tier 2: 1 Operator approval required
    HIGH = "HIGH"      # Tier 3: Explicit confirmation & Admin authorization required


class InterventionScenario(BaseModel):
    id: str
    incident_id: str
    name: str
    code_identifier: str        # e.g., "SCENARIO_B_REROUTE"
    description: str
    risk_tier: RiskTier
    predicted_recovery_minutes: int
    predicted_throughput_recovery_pct: float
    predicted_sla_risk_final_pct: float
    operational_cost_est_usd: float
    reversibility_score_pct: float
    blast_radius_subsystems: List[str]
    confidence_score: float
    recommended: bool = False
    action_type: str            # e.g., "traffic.reroute_processing_queue"
    action_parameters: Dict[str, Any]
    decision_rationale: str
    downtime_during_intervention_sec: int


class MetricProjectionPoint(BaseModel):
    minute: int
    throughput: float
    queue_depth: int
    sla_risk_pct: float


class SimulationRunResult(BaseModel):
    simulation_id: str
    scenario: InterventionScenario
    executed_at: str
    baseline_throughput: float
    baseline_queue_depth: int
    baseline_sla_risk: float
    predicted_throughput: float
    predicted_queue_depth: int
    predicted_sla_risk: float
    timeline_projections: List[MetricProjectionPoint]
    execution_phases: List[Dict[str, Any]]
    status: str = "COMPLETED"


class SimulationComparison(BaseModel):
    incident_id: str
    scenarios: List[InterventionScenario]
    recommended_scenario_id: str
    recommendation_summary: str
    generated_at: str
