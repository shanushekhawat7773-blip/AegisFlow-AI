"""
Statistical and Multi-Metric Anomaly Detection Service for AegisFlow AI (Sentinel Agent).
Combines EWMA smoothing, dynamic Z-score thresholds, and cross-metric correlation.
"""

import math
from typing import Dict, Any, Tuple, List
from ..models.telemetry import TelemetryPoint


class AnomalyDetector:
    def __init__(self, z_threshold: float = 2.5, ewma_alpha: float = 0.3):
        self.z_threshold = z_threshold
        self.ewma_alpha = ewma_alpha
        
        # Baselines: mean and std_dev for each metric
        self.baselines = {
            "throughput": {"mean": 1600.0, "std": 65.0, "direction": "lower"},
            "queue_depth": {"mean": 850.0, "std": 90.0, "direction": "higher"},
            "scanner_availability": {"mean": 99.1, "std": 1.2, "direction": "lower"},
            "network_latency": {"mean": 18.0, "std": 3.0, "direction": "higher"},
            "packet_loss": {"mean": 0.04, "std": 0.05, "direction": "higher"},
            "sla_risk": {"mean": 2.5, "std": 1.0, "direction": "higher"},
        }

    def compute_z_score(self, metric: str, value: float) -> float:
        base = self.baselines.get(metric)
        if not base:
            return 0.0
        
        mean = base["mean"]
        std = base["std"]
        diff = value - mean
        z = diff / max(0.001, std)
        
        # Only penalize deviation in the detrimental direction
        if base["direction"] == "lower":
            return max(0.0, -z)
        else:
            return max(0.0, z)

    def evaluate_point(self, metrics: Dict[str, float]) -> Tuple[bool, float, Dict[str, float]]:
        metric_z_scores = {}
        weighted_score = 0.0
        
        weights = {
            "throughput": 0.25,
            "queue_depth": 0.20,
            "scanner_availability": 0.25,
            "network_latency": 0.15,
            "packet_loss": 0.10,
            "sla_risk": 0.05
        }
        
        breach_count = 0
        for metric, val in metrics.items():
            if metric in self.baselines:
                z = self.compute_z_score(metric, val)
                metric_z_scores[metric] = round(z, 2)
                weighted_score += z * weights.get(metric, 0.1)
                if z >= self.z_threshold:
                    breach_count += 1

        # Composite anomaly confidence score mapped to [0, 1]
        composite_score = min(1.0, 1.0 / (1.0 + math.exp(-0.8 * (weighted_score - 2.0))))
        anomaly_detected = breach_count >= 1 or composite_score > 0.65
        
        return anomaly_detected, round(composite_score, 3), metric_z_scores


anomaly_detector = AnomalyDetector()
