"""
Risk Engine for AegisFlow AI.
Enforces governance, risk tiering, and human-in-the-loop approval thresholds.
"""

from typing import Dict, Any, Tuple
from ..models.simulation import RiskTier
from ..models.action import UserRole


class RiskEngine:
    def __init__(self):
        # Strict action allowlist with predefined risk tiers and permitted caller roles
        self.action_registry = {
            "traffic.reroute_processing_queue": {
                "name": "Dynamic Traffic Reroute",
                "risk_tier": RiskTier.MEDIUM,
                "approvals_required": 1,
                "permitted_roles": [UserRole.OPERATOR, UserRole.ANALYST, UserRole.ADMINISTRATOR],
                "requires_2fa": False,
                "reversible": True
            },
            "cluster.restart_scanner_service": {
                "name": "Rolling Restart Scanner Cluster",
                "risk_tier": RiskTier.LOW,
                "approvals_required": 0,  # Auto-executable in simulation or 1 click
                "permitted_roles": [UserRole.OPERATOR, UserRole.ANALYST, UserRole.ADMINISTRATOR],
                "requires_2fa": False,
                "reversible": True
            },
            "workforce.rebalance_stations": {
                "name": "Workforce Floor Rebalance",
                "risk_tier": RiskTier.LOW,
                "approvals_required": 1,
                "permitted_roles": [UserRole.OPERATOR, UserRole.ADMINISTRATOR],
                "requires_2fa": False,
                "reversible": True
            },
            "network.isolate_switch_port": {
                "name": "Isolate Core Switch Port",
                "risk_tier": RiskTier.HIGH,
                "approvals_required": 2,
                "permitted_roles": [UserRole.SECURITY_ADMIN, UserRole.ADMINISTRATOR],
                "requires_2fa": True,
                "reversible": False
            },
            "system.throttle_inbound_intake": {
                "name": "Global Intake Throttling",
                "risk_tier": RiskTier.HIGH,
                "approvals_required": 2,
                "permitted_roles": [UserRole.ADMINISTRATOR],
                "requires_2fa": True,
                "reversible": True
            }
        }

    def evaluate_action_risk(self, action_type: str) -> Dict[str, Any]:
        policy = self.action_registry.get(action_type)
        if not policy:
            # Any unlisted action is blocked by default!
            return {
                "allowed": False,
                "reason": f"Action '{action_type}' is NOT in the authorized enterprise allowlist.",
                "risk_tier": RiskTier.HIGH,
                "approvals_required": 99
            }
        
        return {
            "allowed": True,
            "policy": policy,
            "risk_tier": policy["risk_tier"],
            "approvals_required": policy["approvals_required"]
        }

    def can_user_approve(self, action_type: str, user_role: UserRole) -> Tuple[bool, str]:
        eval_result = self.evaluate_action_risk(action_type)
        if not eval_result["allowed"]:
            return False, eval_result["reason"]
        
        policy = eval_result["policy"]
        if user_role not in policy["permitted_roles"]:
            return False, f"Role '{user_role.value}' is not authorized to sign off on {policy['name']} (Requires: {[r.value for r in policy['permitted_roles']]})"
        
        return True, "Authorized"


risk_engine = RiskEngine()
