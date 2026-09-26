"""
AegisFlow AI - Backend Application Entrypoint
Predict. Investigate. Simulate. Act.
From operational signal to verified action.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from typing import List, Dict, Any

from .config import settings
from .api.v1.telemetry import router as telemetry_router
from .api.v1.incidents import router as incidents_router
from .api.v1.simulations import router as simulations_router
from .api.v1.actions import router as actions_router
from .api.v1.agents import router as agents_router
from .api.v1.audit import router as audit_router
from .api.v1.analytics import router as analytics_router
from .api.v1.scenarios import router as scenarios_router
from .api.v1.reports import router as reports_router
from .api.v1.verification import router as verification_router

from .services.root_cause_engine import root_cause_engine
from .services.simulation_engine import simulation_engine
from .services.action_gateway import action_gateway
from .services.telemetry_simulator import telemetry_simulator

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Agentic Operational Intelligence Platform. Predict. Investigate. Simulate. Act.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Core Routers
api_prefix = settings.API_V1_STR
app.include_router(telemetry_router, prefix=api_prefix)
app.include_router(incidents_router, prefix=api_prefix)
app.include_router(simulations_router, prefix=api_prefix)
app.include_router(actions_router, prefix=api_prefix)
app.include_router(agents_router, prefix=api_prefix)
app.include_router(audit_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(scenarios_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)
app.include_router(verification_router, prefix=api_prefix)

# Direct Enterprise Clean Endpoints (as requested by API specification)
@app.get(f"{api_prefix}/events")
def list_operational_events():
    """Live operational event stream feed."""
    return [
        {
            "id": "EVT-9042",
            "timestamp": "10:53:12 UTC",
            "facility_id": "WH-03-ORD",
            "severity": "P1_CRITICAL",
            "source": "Sentinel Anomaly Agent",
            "message": "Induction Lines 4-6 throughput collapsed to 780 orders/hr (-51%)."
        },
        {
            "id": "EVT-9043",
            "timestamp": "10:53:20 UTC",
            "facility_id": "WH-03-ORD",
            "severity": "INFO",
            "source": "Investigation Agent",
            "message": "Correlated Core Switch SW-03 TenGigE0/1/24 buffer discards with Scanner 504 timeouts."
        },
        {
            "id": "EVT-9044",
            "timestamp": "10:54:02 UTC",
            "facility_id": "WH-03-ORD",
            "severity": "INFO",
            "source": "Root Cause Agent",
            "message": "Causal dependency chain constructed. Switch buffer exhaustion isolated as root cause."
        },
        {
            "id": "EVT-9045",
            "timestamp": "10:54:45 UTC",
            "facility_id": "WH-03-ORD",
            "severity": "INFO",
            "source": "Simulation Agent",
            "message": "Evaluated 4 counterfactuals. Scenario B (Dynamic Reroute) recommended."
        }
    ]

@app.get(f"{api_prefix}/investigations")
def list_investigations():
    """List active deep investigations."""
    return [root_cause_engine.get_incident_details("INC-4091", action_executed=telemetry_simulator.action_executed)]

@app.get(f"{api_prefix}/root-cause")
def get_primary_root_cause():
    """Retrieve primary causal dependency graph."""
    incident = root_cause_engine.get_incident_details("INC-4091", action_executed=telemetry_simulator.action_executed)
    return incident.causal_graph

@app.get(f"{api_prefix}/recommendations")
def get_recommendations():
    """Retrieve decision agent recommendations."""
    return simulation_engine.get_scenarios_for_incident("INC-4091")

@app.get(f"{api_prefix}/approvals")
def get_approvals():
    """Retrieve action approvals ledger."""
    actions = action_gateway.list_actions()
    return [
        {
            "action_id": a.id,
            "action_type": a.action_type,
            "risk_tier": a.risk_tier,
            "status": a.status,
            "approvals_required": a.approvals_required,
            "approvals": a.approvals
        }
        for a in actions
    ]

@app.get(f"{api_prefix}/demo")
def get_demo_status():
    """Retrieve active demo scenario status."""
    return {
        "active_scenario": telemetry_simulator.active_scenario,
        "action_executed": telemetry_simulator.action_executed,
        "environment": settings.ENVIRONMENT,
        "available_scenarios": ["WH-03-ORD_SCANNER_OUTAGE", "WH-02-DFW_ORDER_SURGE", "BASELINE_NOMINAL"]
    }

@app.get("/")
def root():
    return {
        "platform": "AegisFlow AI",
        "tagline": "Predict. Investigate. Simulate. Act.",
        "statement": "From operational signal to verified action.",
        "status": "OPERATIONAL",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "telemetry_stream": "UP",
            "anomaly_detector": "UP",
            "root_cause_engine": "UP",
            "simulation_engine": "UP",
            "action_gateway": "UP",
            "audit_ledger": "UP"
        }
    }
