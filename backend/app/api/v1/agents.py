"""
AI Agents Directory API routes for AegisFlow AI.
"""

from fastapi import APIRouter
from typing import List
from ...models.agent import AgentProfile

router = APIRouter(prefix="/agents", tags=["agents"])

AGENTS_REGISTRY: List[AgentProfile] = [
    AgentProfile(
        id="agent-01-sentinel",
        name="Sentinel Anomaly Agent",
        role_description="Continuous high-frequency multi-metric anomaly detection across telemetry streams.",
        stage="Detect",
        status="ACTIVE",
        engine_model="Statistical EWMA + Dynamic Z-score",
        latency_ms=12.4,
        accuracy_pct=99.4,
        invocations_24h=142800,
        permitted_tools=["telemetry.read_stream", "anomaly.evaluate_vector", "alert.trigger_p1"],
        current_task="Monitoring 4 fulfillment hubs (sampling rate: 500ms)",
        last_active="Just now"
    ),
    AgentProfile(
        id="agent-02-investigation",
        name="Investigation Agent",
        role_description="Correlates cross-domain logs, sensor metrics, and network topology across systems.",
        stage="Investigate",
        status="ACTIVE",
        engine_model="Claude 3.5 Sonnet / Bedrock Integration",
        latency_ms=180.2,
        accuracy_pct=97.8,
        invocations_24h=4210,
        permitted_tools=["logs.query_opensearch", "topology.query_cmdb", "metrics.correlate_time_series"],
        current_task="Correlating switch discards with scanner 504 timeouts (WH-03)",
        last_active="1 min ago"
    ),
    AgentProfile(
        id="agent-03-rootcause",
        name="Root Cause Agent",
        role_description="Isolates primary fault mechanisms and constructs directed acyclic causal graphs.",
        stage="Understand",
        status="STANDBY",
        engine_model="Bayesian Causal Graph Synthesis",
        latency_ms=210.0,
        accuracy_pct=96.5,
        invocations_24h=1890,
        permitted_tools=["graph.synthesize_causal_chain", "blast_radius.calculate", "evidence.classify_type"],
        current_task="Idle (Awaiting new anomaly trigger)",
        last_active="4 min ago"
    ),
    AgentProfile(
        id="agent-04-simulation",
        name="Counterfactual Simulation Agent",
        role_description="Simulates candidate interventions in silico using deterministic queuing models.",
        stage="Simulate",
        status="ACTIVE",
        engine_model="Queuing Theory (M/M/c) + Fluid Dynamics",
        latency_ms=45.6,
        accuracy_pct=98.9,
        invocations_24h=840,
        permitted_tools=["simulation.run_fluid_model", "queue.project_drain_time", "sla.calculate_risk_delta"],
        current_task="Projecting recovery trajectory for Scenario B",
        last_active="2 min ago"
    ),
    AgentProfile(
        id="agent-05-decision",
        name="Decision Agent",
        role_description="Ranks candidate interventions using multi-criteria utility functions and cost trade-offs.",
        stage="Recommend",
        status="STANDBY",
        engine_model="Multi-Criteria Utility Optimizer",
        latency_ms=64.2,
        accuracy_pct=98.1,
        invocations_24h=840,
        permitted_tools=["decision.rank_scenarios", "explain.generate_recommendation"],
        current_task="Idle",
        last_active="6 min ago"
    ),
    AgentProfile(
        id="agent-06-risk",
        name="Risk Governance Agent",
        role_description="Evaluates action blast radius, checks safety policies, and enforces human-in-the-loop gates.",
        stage="Approve",
        status="ACTIVE",
        engine_model="Enterprise Policy Evaluator (OPA-aligned)",
        latency_ms=8.1,
        accuracy_pct=100.0,
        invocations_24h=840,
        permitted_tools=["policy.verify_allowlist", "rbac.check_permission", "security.validate_signature"],
        current_task="Guarding Action Gateway allowlist",
        last_active="Just now"
    ),
    AgentProfile(
        id="agent-07-execution",
        name="Controlled Execution Agent",
        role_description="Dispatches signed, idempotent operational commands through secure mTLS gateway.",
        stage="Execute",
        status="ACTIVE",
        engine_model="Idempotent Gateway Dispatcher",
        latency_ms=18.4,
        accuracy_pct=100.0,
        invocations_24h=312,
        permitted_tools=["gateway.dispatch_mtls", "snapshot.capture_pre_state", "rollback.execute_safe"],
        current_task="Maintaining edge session pool",
        last_active="6 min ago"
    ),
    AgentProfile(
        id="agent-08-verification",
        name="Continuous Verification Agent",
        role_description="Compares pre-vs-post telemetry to mathematically verify system recovery and monitor drift.",
        stage="Verify",
        status="ACTIVE",
        engine_model="Statistical Hypothesis Testing (t-test / KS)",
        latency_ms=22.8,
        accuracy_pct=99.2,
        invocations_24h=312,
        permitted_tools=["telemetry.compute_delta", "drift.watch_stability_window", "verdict.generate_status"],
        current_task="Monitoring post-intervention telemetry drift (WH-03)",
        last_active="Just now"
    ),
    AgentProfile(
        id="agent-09-reporting",
        name="Reporting & Learning Agent",
        role_description="Synthesizes executive post-mortems, updates runbooks, and audits operational compliance.",
        stage="Learn",
        status="STANDBY",
        engine_model="Claude 3.5 Sonnet / Bedrock Integration",
        latency_ms=310.0,
        accuracy_pct=98.5,
        invocations_24h=142,
        permitted_tools=["report.generate_executive_briefing", "runbook.propose_rule_patch"],
        current_task="Idle",
        last_active="8 min ago"
    )
]


@router.get("", response_model=List[AgentProfile])
def list_agents():
    """List all specialized autonomous agents operating within the AegisFlow architecture."""
    return AGENTS_REGISTRY
