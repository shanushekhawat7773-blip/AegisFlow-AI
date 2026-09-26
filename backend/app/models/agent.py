"""
Agent status, capabilities, and telemetry models for AegisFlow AI.
"""

from pydantic import BaseModel
from typing import List, Optional


class AgentProfile(BaseModel):
    id: str
    name: str
    role_description: str
    stage: str               # "Detect", "Investigate", "Understand", "Simulate", "Recommend", "Approve", "Execute", "Verify", "Learn"
    status: str              # "ONLINE", "ACTIVE", "STANDBY", "PROCESSING"
    engine_model: str        # e.g., "Deterministic-EWMA", "Claude 3.5 Sonnet / Bedrock", "Queuing-Fluid-Flow"
    latency_ms: float
    accuracy_pct: float
    invocations_24h: int
    permitted_tools: List[str]
    current_task: Optional[str] = None
    last_active: str
