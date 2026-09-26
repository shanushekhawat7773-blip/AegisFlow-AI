"""
Unit tests for Sentinel Anomaly Detection service.
"""

import pytest
from app.services.anomaly_detector import AnomalyDetector


def test_nominal_telemetry_no_anomaly():
    detector = AnomalyDetector()
    nominal_metrics = {
        "throughput": 1610.0,
        "queue_depth": 840,
        "scanner_availability": 99.2,
        "network_latency": 17.8,
        "packet_loss": 0.03,
        "sla_risk": 2.2
    }
    anom_detected, score, z_scores = detector.evaluate_point(nominal_metrics)
    assert not anom_detected
    assert score < 0.50
    assert z_scores["throughput"] < 1.0


def test_severe_degradation_triggers_anomaly():
    detector = AnomalyDetector()
    degraded_metrics = {
        "throughput": 780.0,  # Huge drop from 1600
        "queue_depth": 4820,  # Huge spike from 850
        "scanner_availability": 48.2, # Down from 99.1
        "network_latency": 124.6, # Up from 18.0
        "packet_loss": 4.82, # Up from 0.04
        "sla_risk": 88.5 # Critical risk
    }
    anom_detected, score, z_scores = detector.evaluate_point(degraded_metrics)
    assert anom_detected
    assert score > 0.85
    assert z_scores["throughput"] > 3.0
    assert z_scores["scanner_availability"] > 3.0
