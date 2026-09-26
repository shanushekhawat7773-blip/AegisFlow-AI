"""
Tamper-Evident Audit Service for AegisFlow AI.
Maintains an append-only ledger with cryptographic hash chaining (SHA-256).
"""

import hashlib
import json
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from ..models.audit import AuditEntry


class AuditService:
    def __init__(self):
        self.entries: List[AuditEntry] = []
        self._initialize_audit_trail()

    def _calculate_hash(self, prev_hash: str, payload: Dict[str, Any]) -> str:
        content = prev_hash + json.dumps(payload, sort_keys=True)
        return hashlib.sha256(content.encode("utf-8")).hexdigest()

    def _initialize_audit_trail(self):
        now = datetime.now(timezone.utc)
        genesis_hash = "0000000000000000000000000000000000000000000000000000000000000000"
        
        events = [
            {
                "event_type": "TELEMETRY_ANOMALY_TRIGGERED",
                "facility_id": "WH-03-ORD",
                "actor": "Sentinel Anomaly Agent v2.1",
                "actor_role": "AGENT",
                "action_details": "Z-score breach (z=4.82) detected on Scanner Cluster Rack 08 API latency.",
                "risk_level": "HIGH",
                "minutes_ago": 14
            },
            {
                "event_type": "CAUSAL_INFERENCE_SYNTHESIS",
                "facility_id": "WH-03-ORD",
                "actor": "Root Cause Agent v1.8",
                "actor_role": "AGENT",
                "action_details": "Causal graph constructed: Core Switch SW-03 buffer drops cascading to Scanner API 504s.",
                "risk_level": "INFO",
                "minutes_ago": 12
            },
            {
                "event_type": "COUNTERFACTUAL_SIMULATION_RUN",
                "facility_id": "WH-03-ORD",
                "actor": "Simulation Agent v3.0",
                "actor_role": "AGENT",
                "action_details": "Evaluated 4 intervention candidates. Scenario B (Dynamic Reroute) identified as optimal.",
                "risk_level": "INFO",
                "minutes_ago": 10
            },
            {
                "event_type": "INTERVENTION_POLICY_EVALUATION",
                "facility_id": "WH-03-ORD",
                "actor": "AegisFlow Risk Engine v1.0",
                "actor_role": "AGENT",
                "action_details": "Action 'traffic.reroute_processing_queue' classified as MEDIUM risk. 1 human approval required.",
                "risk_level": "MEDIUM",
                "minutes_ago": 9
            },
            {
                "event_type": "HUMAN_APPROVAL_RECORDED",
                "facility_id": "WH-03-ORD",
                "actor": "Sarah Chen (Senior Operations Lead)",
                "actor_role": "OPERATOR",
                "action_details": "Approved Scenario B routing divert for Lines 4-6. Digital Signature: SIG-ED25519-88F4A2.",
                "risk_level": "MEDIUM",
                "minutes_ago": 7
            },
            {
                "event_type": "CONTROLLED_GATEWAY_DISPATCH",
                "facility_id": "WH-03-ORD",
                "actor": "Action Gateway Controller",
                "actor_role": "GATEWAY",
                "action_details": "Idempotent dispatch to WH-03 edge router. Diverter gates 1-3 engaged at 65% capacity.",
                "risk_level": "MEDIUM",
                "minutes_ago": 6
            },
            {
                "event_type": "CONTINUOUS_VERIFICATION_PASS",
                "facility_id": "WH-03-ORD",
                "actor": "Verification Agent v1.4",
                "actor_role": "AGENT",
                "action_details": "Recovery confirmed: Throughput at 1,565 pkgs/hr, SLA breach risk collapsed from 88.5% to 2.9%.",
                "risk_level": "LOW",
                "minutes_ago": 4
            }
        ]

        prev_hash = genesis_hash
        for i, ev in enumerate(events):
            t = (now - timedelta(minutes=ev["minutes_ago"])).isoformat()
            payload = {
                "seq": i + 1,
                "event": ev["event_type"],
                "actor": ev["actor"],
                "details": ev["action_details"],
                "timestamp": t
            }
            curr_hash = self._calculate_hash(prev_hash, payload)
            
            entry = AuditEntry(
                id=f"AUD-{1000 + i}",
                sequence_number=i + 1,
                timestamp=t,
                event_type=ev["event_type"],
                facility_id=ev["facility_id"],
                actor=ev["actor"],
                actor_role=ev["actor_role"],
                action_details=ev["action_details"],
                risk_level=ev["risk_level"],
                payload_hash=curr_hash,
                previous_hash=prev_hash,
                metadata={"verified_chain": True}
            )
            self.entries.append(entry)
            prev_hash = curr_hash

    def list_entries(self, limit: int = 50) -> List[AuditEntry]:
        return list(reversed(self.entries[-limit:]))

    def append_entry(
        self,
        event_type: str,
        facility_id: str,
        actor: str,
        actor_role: str,
        action_details: str,
        risk_level: str
    ) -> AuditEntry:
        prev_hash = self.entries[-1].payload_hash if self.entries else "0" * 64
        seq = len(self.entries) + 1
        t = datetime.now(timezone.utc).isoformat()
        payload = {
            "seq": seq,
            "event": event_type,
            "actor": actor,
            "details": action_details,
            "timestamp": t
        }
        curr_hash = self._calculate_hash(prev_hash, payload)
        entry = AuditEntry(
            id=f"AUD-{1000 + len(self.entries)}",
            sequence_number=seq,
            timestamp=t,
            event_type=event_type,
            facility_id=facility_id,
            actor=actor,
            actor_role=actor_role,
            action_details=action_details,
            risk_level=risk_level,
            payload_hash=curr_hash,
            previous_hash=prev_hash,
            metadata={"verified_chain": True}
        )
        self.entries.append(entry)
        return entry


audit_service = AuditService()
