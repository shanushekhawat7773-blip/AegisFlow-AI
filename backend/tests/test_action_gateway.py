"""
Unit tests for Controlled Action Gateway and Risk Engine.
"""

import pytest
from app.services.risk_engine import RiskEngine
from app.services.action_gateway import ActionGateway
from app.models.action import UserRole, ActionStatus


def test_unauthorized_action_blocked():
    risk = RiskEngine()
    result = risk.evaluate_action_risk("arbitrary_bash_command.rm_rf")
    assert not result["allowed"]
    assert "NOT in the authorized enterprise allowlist" in result["reason"]


def test_medium_risk_requires_operator_approval():
    risk = RiskEngine()
    can_approve, reason = risk.can_user_approve("traffic.reroute_processing_queue", UserRole.OPERATOR)
    assert can_approve
    assert reason == "Authorized"


def test_gateway_execution_lifecycle():
    gateway = ActionGateway()
    actions = gateway.list_actions()
    assert len(actions) > 0
    
    target_action = actions[0]
    executed = gateway.approve_and_execute(
        action_id=target_action.id,
        user_name="Sarah Chen",
        user_role=UserRole.OPERATOR,
        justification="Approved for induction queue bypass"
    )
    assert executed.status == ActionStatus.COMPLETED
    assert len(executed.approvals) == 1
    assert "SIG-ED25519" in executed.approvals[0].digital_signature
    assert len(executed.terminal_logs) >= 5
