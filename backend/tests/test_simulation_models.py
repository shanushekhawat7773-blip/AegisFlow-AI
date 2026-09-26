"""
Unit tests for Counterfactual Simulation Engine.
"""

import pytest
from app.services.simulation_engine import SimulationEngine


def test_simulation_generates_valid_projections():
    engine = SimulationEngine()
    result = engine.run_simulation("SCENARIO_B_REROUTE", "INC-4091")
    
    assert result.status == "COMPLETED"
    assert len(result.timeline_projections) > 10
    # Throughput should increase from baseline 780 to ~1580
    assert result.timeline_projections[-1].throughput > 1500.0
    # SLA risk should drop from 88.5 to ~2.8%
    assert result.timeline_projections[-1].sla_risk_pct < 5.0
    # 7 distinct simulation stages
    assert len(result.execution_phases) == 7


def test_scenario_comparison_ranks_reroute_first():
    engine = SimulationEngine()
    comparison = engine.get_scenarios_for_incident("INC-4091")
    
    assert len(comparison.scenarios) >= 3
    assert comparison.recommended_scenario_id == "SCENARIO_B_REROUTE"
    recommended = next(s for s in comparison.scenarios if s.id == comparison.recommended_scenario_id)
    assert recommended.recommended is True
    assert recommended.predicted_recovery_minutes <= 10
