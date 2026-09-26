"""
Operational Telemetry Simulator for AegisFlow AI.
Generates realistic multi-facility telemetry with deterministic scenario injection.
"""

import time
import math
import random
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional
from ..models.telemetry import TelemetryPoint, FacilityStatus, TelemetryHistory


class TelemetrySimulator:
    def __init__(self):
        self.active_scenario = "WH-03-ORD_SCANNER_OUTAGE"
        self.scenario_start_time = datetime.now(timezone.utc) - timedelta(minutes=14)
        self.action_executed = False
        self.executed_action_type: Optional[str] = None
        self.action_execution_time: Optional[datetime] = None
        
        # Base facility configurations
        self.facilities_meta = {
            "WH-01-SEA": {
                "name": "Seattle Fulfillment Hub (WH-01)",
                "location": "Pacific Northwest Region",
                "base_throughput": 1250.0,
                "base_queue": 450,
                "base_scanners": 99.4,
                "base_latency": 14.2,
                "base_packet_loss": 0.02,
                "base_machine_health": 98.6,
                "base_sla_risk": 1.2
            },
            "WH-02-DFW": {
                "name": "Dallas Sortation Center (WH-02)",
                "location": "South Central Hub",
                "base_throughput": 1400.0,
                "base_queue": 1100,
                "base_scanners": 97.8,
                "base_latency": 22.5,
                "base_packet_loss": 0.08,
                "base_machine_health": 95.1,
                "base_sla_risk": 4.8
            },
            "WH-03-ORD": {
                "name": "Chicago Mega-Inbound Gateway (WH-03)",
                "location": "Midwest Distribution Cluster",
                "base_throughput": 1600.0,
                "base_queue": 850,
                "base_scanners": 99.1,
                "base_latency": 18.0,
                "base_packet_loss": 0.04,
                "base_machine_health": 97.4,
                "base_sla_risk": 2.5
            },
            "WH-04-ATL": {
                "name": "Atlanta Air Freight Facility (WH-04)",
                "location": "Southeast Logistics Corridor",
                "base_throughput": 980.0,
                "base_queue": 320,
                "base_scanners": 99.8,
                "base_latency": 12.1,
                "base_packet_loss": 0.01,
                "base_machine_health": 99.2,
                "base_sla_risk": 0.8
            }
        }

    def set_scenario(self, scenario_id: str):
        self.active_scenario = scenario_id
        self.scenario_start_time = datetime.now(timezone.utc) - timedelta(minutes=14)
        self.action_executed = False
        self.executed_action_type = None
        self.action_execution_time = None

    def trigger_action(self, action_type: str):
        self.action_executed = True
        self.executed_action_type = action_type
        self.action_execution_time = datetime.now(timezone.utc)

    def reset_state(self):
        self.set_scenario("WH-03-ORD_SCANNER_OUTAGE")

    def get_facility_status(self, facility_id: str) -> FacilityStatus:
        meta = self.facilities_meta.get(facility_id)
        if not meta:
            raise ValueError(f"Unknown facility: {facility_id}")
        
        now = datetime.now(timezone.utc)
        now_iso = now.isoformat()
        
        # Calculate degradation or recovery based on active scenario
        if facility_id == "WH-03-ORD" and self.active_scenario == "WH-03-ORD_SCANNER_OUTAGE":
            if self.action_executed and self.action_execution_time:
                # Post-intervention recovery state
                seconds_since_action = (now - self.action_execution_time).total_seconds()
                recovery_factor = min(1.0, max(0.1, seconds_since_action / 20.0))
                
                throughput = 780.0 + (1550.0 - 780.0) * recovery_factor
                queue = int(4820 - (4820 - 920) * recovery_factor)
                scanners = 48.0 + (98.5 - 48.0) * recovery_factor
                latency = 124.0 - (124.0 - 19.5) * recovery_factor
                packet_loss = 4.8 - (4.8 - 0.05) * recovery_factor
                sla_risk = 88.5 - (88.5 - 2.8) * recovery_factor
                
                status = "recovered" if recovery_factor > 0.8 else "investigating"
                active_inc = 0 if recovery_factor > 0.8 else 1
            else:
                # Active critical incident
                throughput = 780.0
                queue = 4820
                scanners = 48.2
                latency = 124.6
                packet_loss = 4.82
                sla_risk = 88.5
                status = "critical"
                active_inc = 1
        elif facility_id == "WH-02-DFW" and self.active_scenario == "WH-02-DFW_ORDER_SURGE":
            throughput = 1380.0
            queue = 3450
            scanners = 96.5
            latency = 38.0
            packet_loss = 0.15
            sla_risk = 44.0
            status = "warning"
            active_inc = 1
        else:
            # Baseline nominal state
            throughput = meta["base_throughput"] + random.uniform(-20, 20)
            queue = meta["base_queue"] + random.randint(-25, 25)
            scanners = meta["base_scanners"]
            latency = meta["base_latency"] + random.uniform(-1, 1)
            packet_loss = meta["base_packet_loss"]
            sla_risk = meta["base_sla_risk"]
            status = "healthy"
            active_inc = 0

        return FacilityStatus(
            facility_id=facility_id,
            facility_name=meta["name"],
            location=meta["location"],
            status=status,
            current_throughput=round(throughput, 1),
            target_throughput=meta["base_throughput"],
            queue_depth=queue,
            scanner_availability=round(scanners, 1),
            network_latency_ms=round(latency, 1),
            packet_loss_pct=round(packet_loss, 2),
            active_incidents=active_inc,
            sla_risk_pct=round(sla_risk, 1),
            last_updated=now_iso
        )

    def get_all_facilities(self) -> List[FacilityStatus]:
        return [self.get_facility_status(fid) for fid in self.facilities_meta.keys()]

    def get_telemetry_history(self, facility_id: str, minutes: int = 30) -> TelemetryHistory:
        meta = self.facilities_meta.get(facility_id, self.facilities_meta["WH-03-ORD"])
        now = datetime.now(timezone.utc)
        points: List[TelemetryPoint] = []
        
        for i in range(minutes, -1, -1):
            pt_time = now - timedelta(minutes=i)
            time_str = pt_time.strftime("%H:%M")
            
            # Simulate historical progression for WH-03-ORD during scanner outage
            if facility_id == "WH-03-ORD" and self.active_scenario == "WH-03-ORD_SCANNER_OUTAGE":
                # Incident began 14 minutes ago
                if i > 14:
                    # Healthy baseline period
                    tp = meta["base_throughput"] + math.sin(i * 0.3) * 35.0
                    qd = meta["base_queue"] + int(math.cos(i * 0.2) * 40.0)
                    sc = 99.1
                    lat = 18.2
                    pl = 0.04
                    sla = 2.1
                    anom = False
                    score = 0.12
                else:
                    # Degradation period
                    progression = min(1.0, (14 - i) / 8.0)
                    
                    if self.action_executed and self.action_execution_time:
                        sec_since = (now - self.action_execution_time).total_seconds()
                        rec_factor = min(1.0, max(0.0, sec_since / 20.0))
                        tp = 780.0 + (1550.0 - 780.0) * rec_factor
                        qd = int(4820 - (4820 - 920) * rec_factor)
                        sc = 48.0 + (98.5 - 48.0) * rec_factor
                        lat = 124.0 - (124.0 - 19.5) * rec_factor
                        pl = 4.8 - (4.8 - 0.05) * rec_factor
                        sla = 88.5 - (88.5 - 2.8) * rec_factor
                        anom = rec_factor < 0.7
                        score = max(0.1, 0.94 * (1.0 - rec_factor))
                    else:
                        tp = meta["base_throughput"] - (meta["base_throughput"] - 780.0) * progression
                        qd = meta["base_queue"] + int((4820 - meta["base_queue"]) * progression)
                        sc = 99.1 - (99.1 - 48.2) * progression
                        lat = 18.2 + (124.6 - 18.2) * progression
                        pl = 0.04 + (4.82 - 0.04) * progression
                        sla = 2.1 + (88.5 - 2.1) * progression
                        anom = True
                        score = min(0.96, 0.45 + 0.51 * progression)
            else:
                tp = meta["base_throughput"] + math.sin(i * 0.5) * 40.0
                qd = meta["base_queue"] + int(math.cos(i * 0.4) * 50.0)
                sc = meta["base_scanners"]
                lat = meta["base_latency"] + math.sin(i) * 1.5
                pl = meta["base_packet_loss"]
                sla = meta["base_sla_risk"]
                anom = False
                score = 0.08

            points.append(
                TelemetryPoint(
                    timestamp=time_str,
                    facility_id=facility_id,
                    metrics={
                        "throughput": round(tp, 1),
                        "queue_depth": qd,
                        "scanner_availability": round(sc, 1),
                        "network_latency": round(lat, 1),
                        "packet_loss": round(pl, 2),
                        "sla_risk": round(sla, 1)
                    },
                    anomaly_detected=anom,
                    anomaly_score=round(score, 2)
                )
            )

        return TelemetryHistory(facility_id=facility_id, points=points)


# Global singleton simulator instance
telemetry_simulator = TelemetrySimulator()
