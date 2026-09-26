"""
Action Gateway and Approval models for AegisFlow AI.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum


class UserRole(str, Enum):
    OPERATOR = "OPERATOR"
    ANALYST = "ANALYST"
    SECURITY_ADMIN = "SECURITY_ADMIN"
    ADMINISTRATOR = "ADMINISTRATOR"


class ActionStatus(str, Enum):
    PROPOSED = "PROPOSED"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    EXECUTING = "EXECUTING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    ROLLED_BACK = "ROLLED_BACK"


class ApprovalRecord(BaseModel):
    user_name: str
    user_role: UserRole
    timestamp: str
    justification: str
    digital_signature: str


class ActionLogLine(BaseModel):
    timestamp: str
    level: str  # "INFO", "WARN", "GATEWAY", "EXEC", "SUCCESS"
    message: str


class ActionExecution(BaseModel):
    id: str
    incident_id: str
    scenario_id: str
    action_type: str            # Must match allowlist
    target_system: str
    payload: Dict[str, Any]
    risk_tier: str
    status: ActionStatus
    initiated_by_agent: str     # e.g., "AegisFlow Decision Agent v1.2"
    approvals_required: int
    approvals: List[ApprovalRecord] = []
    terminal_logs: List[ActionLogLine] = []
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    rollback_supported: bool = True
    rollback_snapshot: Optional[Dict[str, Any]] = None
    result_summary: Optional[str] = None
