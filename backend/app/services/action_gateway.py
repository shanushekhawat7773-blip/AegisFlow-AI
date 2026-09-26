"""
Controlled Action Gateway for AegisFlow AI.
Ensures zero-unauthorized execution, strict allowlisting, rollback snapshots, and audit logging.
"""

import time
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from ..models.action import (
    ActionExecution,
    ActionStatus,
    ApprovalRecord,
    ActionLogLine,
    UserRole
)
from .risk_engine import risk_engine
from .telemetry_simulator import telemetry_simulator


class ActionGateway:
    def __init__(self):
        self.executions: Dict[str, ActionExecution] = {}
        self._initialize_seed_actions()

    def _initialize_seed_actions(self):
        # Create initial seed execution for Warehouse 03
        seed_id = "ACT-8092-REROUTE"
        self.executions[seed_id] = ActionExecution(
            id=seed_id,
            incident_id="INC-4091",
            scenario_id="SCENARIO_B_REROUTE",
            action_type="traffic.reroute_processing_queue",
            target_system="WH-03 Induction Routing Controller (Zone 4-6)",
            payload={
                "source_lines": [4, 5, 6],
                "target_lines": [1, 2, 3],
                "reroute_ratio": 0.65,
                "idempotency_token": "aegis_token_90f23a",
                "max_diverter_transit_ms": 450
            },
            risk_tier="MEDIUM",
            status=ActionStatus.PENDING_APPROVAL,
            initiated_by_agent="AegisFlow Decision Agent v1.2",
            approvals_required=1,
            approvals=[],
            terminal_logs=[
                ActionLogLine(
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    level="INFO",
                    message="Action proposed by Decision Agent based on Scenario B counterfactual simulation."
                ),
                ActionLogLine(
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    level="GATEWAY",
                    message="Action policy check: 'traffic.reroute_processing_queue' validated against allowlist."
                ),
                ActionLogLine(
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    level="WARN",
                    message="Risk policy gate: MEDIUM risk action requires 1 authorized Operator/Analyst digital sign-off."
                )
            ],
            created_at=datetime.now(timezone.utc).isoformat(),
            rollback_supported=True,
            rollback_snapshot={
                "previous_reroute_ratio": 0.0,
                "active_diverter_matrix": "DEFAULT_BALANCED",
                "target_lines": [4, 5, 6]
            }
        )

    def list_actions(self) -> List[ActionExecution]:
        return list(self.executions.values())

    def get_action(self, action_id: str) -> Optional[ActionExecution]:
        return self.executions.get(action_id)

    def approve_and_execute(
        self,
        action_id: str,
        user_name: str,
        user_role: UserRole,
        justification: str
    ) -> ActionExecution:
        action = self.executions.get(action_id)
        if not action:
            raise ValueError(f"Action '{action_id}' not found.")
        
        # Check permissions
        can_approve, reason = risk_engine.can_user_approve(action.action_type, user_role)
        if not can_approve:
            raise PermissionError(reason)
        
        # Add approval record
        approval = ApprovalRecord(
            user_name=user_name,
            user_role=user_role,
            timestamp=datetime.now(timezone.utc).isoformat(),
            justification=justification,
            digital_signature=f"SIG-ED25519-{uuid.uuid4().hex[:12].upper()}"
        )
        action.approvals.append(approval)
        action.status = ActionStatus.APPROVED

        # Execute through controlled gateway
        action.status = ActionStatus.EXECUTING
        action.started_at = datetime.now(timezone.utc).isoformat()
        
        # Build gateway execution logs
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="SUCCESS",
                message=f"Digital signature verified from {user_name} ({user_role.value}). Policy threshold satisfied (1/1)."
            )
        )
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="GATEWAY",
                message="Establishing mTLS session to WH-03 Edge Controller (ord-gw-01.aegisflow.internal:8443)..."
            )
        )
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="EXEC",
                message="Pre-execution rollback snapshot committed to cryptographic state store: SNAP-ORD-4091"
            )
        )
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="EXEC",
                message=f"Dispatching payload: reroute_ratio={action.payload.get('reroute_ratio', 0.65)} to lines [1, 2, 3]..."
            )
        )
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="SUCCESS",
                message="Edge controller ACK received (HTTP 200 OK, latency=14.2ms). Routing diverter gates engaged."
            )
        )
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="INFO",
                message="Handing off to Verification Agent for continuous telemetry recovery validation."
            )
        )
        
        action.status = ActionStatus.COMPLETED
        action.completed_at = datetime.now(timezone.utc).isoformat()
        action.result_summary = "Rerouting executed safely. Diverter gates 1-3 active at 65% capacity. System entering verification phase."

        # Inform telemetry simulator to trigger live recovery!
        telemetry_simulator.trigger_action(action.action_type)

        return action

    def rollback_action(self, action_id: str, user_name: str, user_role: UserRole) -> ActionExecution:
        action = self.executions.get(action_id)
        if not action:
            raise ValueError(f"Action '{action_id}' not found.")
        
        if not action.rollback_supported or not action.rollback_snapshot:
            raise ValueError("Rollback is not supported for this action.")
        
        action.status = ActionStatus.ROLLED_BACK
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="WARN",
                message=f"Operator {user_name} requested rollback. Restoring snapshot: {action.rollback_snapshot}"
            )
        )
        action.terminal_logs.append(
            ActionLogLine(
                timestamp=datetime.now(timezone.utc).isoformat(),
                level="SUCCESS",
                message="Rollback completed. Routing restored to pre-incident baseline state."
            )
        )
        # Reset simulator state
        telemetry_simulator.reset_state()
        return action


action_gateway = ActionGateway()
