"""
Action Gateway and Approval API routes for AegisFlow AI.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ...models.action import ActionExecution, UserRole
from ...services.action_gateway import action_gateway
from ...services.audit_service import audit_service

router = APIRouter(prefix="/actions", tags=["actions"])


class ApprovalRequest(BaseModel):
    user_name: str
    user_role: UserRole
    justification: str


class RollbackRequest(BaseModel):
    user_name: str
    user_role: UserRole


@router.get("", response_model=List[ActionExecution])
def list_actions():
    """List all proposed, approved, executed, and rolled-back actions."""
    return action_gateway.list_actions()


@router.get("/{action_id}", response_model=ActionExecution)
def get_action(action_id: str):
    """Retrieve full execution lifecycle and terminal logs for an action."""
    action = action_gateway.get_action(action_id)
    if not action:
        raise HTTPException(status_code=404, detail=f"Action '{action_id}' not found.")
    return action


@router.post("/{action_id}/approve", response_model=ActionExecution)
def approve_and_execute(action_id: str, req: ApprovalRequest):
    """Approve and dispatch action through controlled gateway."""
    try:
        action = action_gateway.approve_and_execute(
            action_id=action_id,
            user_name=req.user_name,
            user_role=req.user_role,
            justification=req.justification
        )
        # Log to tamper-evident audit ledger
        audit_service.append_entry(
            event_type="HUMAN_APPROVAL_RECORDED",
            facility_id="WH-03-ORD",
            actor=f"{req.user_name} ({req.user_role.value})",
            actor_role=req.user_role.value,
            action_details=f"Approved action {action.action_type}: {req.justification}",
            risk_level=action.risk_tier
        )
        audit_service.append_entry(
            event_type="CONTROLLED_GATEWAY_DISPATCH",
            facility_id="WH-03-ORD",
            actor="Action Gateway Controller",
            actor_role="GATEWAY",
            action_details=f"Dispatched {action.action_type} to WH-03 Edge Controller. Status: COMPLETED.",
            risk_level=action.risk_tier
        )
        return action
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{action_id}/rollback", response_model=ActionExecution)
def rollback_action(action_id: str, req: RollbackRequest):
    """Safely roll back an executed action to its pre-intervention state."""
    try:
        action = action_gateway.rollback_action(
            action_id=action_id,
            user_name=req.user_name,
            user_role=req.user_role
        )
        audit_service.append_entry(
            event_type="ACTION_ROLLED_BACK",
            facility_id="WH-03-ORD",
            actor=f"{req.user_name} ({req.user_role.value})",
            actor_role=req.user_role.value,
            action_details=f"Restored pre-incident state for action {action_id}",
            risk_level="HIGH"
        )
        return action
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
