# AegisFlow AI

**Predict. Investigate. Simulate. Act.**  
*From operational signal to verified action.*

[![AegisFlow CI](https://github.com/shanushekhawat7773-blip/AegisFlow-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/shanushekhawat7773-blip/AegisFlow-AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16_App_Router-black.svg)](https://nextjs.org)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Amazon_Bedrock_Claude_3.5_Sonnet-orange.svg)](https://aws.amazon.com/bedrock/)

---

## What It Does

**AegisFlow AI** is an agentic operational intelligence platform designed to detect emerging operational failures, investigate probable root causes, simulate possible interventions, obtain appropriate human approval, safely execute approved actions, and continuously verify whether the intervention solved the problem.

Built specifically for high-throughput fulfillment centers, automated supply chains, and complex logistics hubs, AegisFlow operates as an **AI Operations Command Center**. It ingests multi-stream telemetry (order throughput, buffer queue depths, optical scanner availability, intra-facility network latency, PLC conveyor signals, machine health), identifies abnormal behavior through statistical variance and moving average deviation, isolates causal dependency chains, models interventions in silico before touching production, and tracks post-action recovery.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE CLOSED-LOOP WORKFLOW                                  │
│                                                                                        │
│   DETECT ──► INVESTIGATE ──► UNDERSTAND ──► SIMULATE ──► RECOMMEND ──► APPROVE         │
│                                                                             │          │
│   LEARN  ◄───────────────── VERIFY ◄────────────────────── EXECUTE ◄────────┘          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Why It Exists

Modern enterprise observability tools (APMs, dashboards, and log aggregators) alert operators when anomalies occur, but stop there. When a critical bottleneck occurs in an automated facility:
1. **Alert Fatigue & Triaging Latency**: Human operators are inundated with disconnected sensor alerts and spend 30 to 60 minutes cross-correlating syslog discards with PLC alarms while package backlogs accumulate.
2. **Unpredictable Blast Radius**: Operators hesitate to take corrective actions (such as restarting scanner clusters or reallocating induction diverters) because the downstream impact on upstream conveyors or carrier SLA deadlines cannot be verified beforehand.
3. **The AI Hallucination & Authority Risk**: Generic LLM chatbots or autonomous scripts given unrestricted shell or API access risk executing catastrophic or irreversible commands in production environments.

AegisFlow AI solves this through **Controlled Autonomy**: pairing deterministic mathematical simulation ($M/M/c$ queuing theory) with role-based human-in-the-loop approvals, allowlisted action gateways, and statistical verification.

---

## Core Operational Workflow

Every operational failure handled by AegisFlow follows a rigorous 9-stage closed-loop lifecycle:

1. **Detect (Sentinel Agent)**: High-frequency telemetry evaluation using Exponentially Weighted Moving Averages (EWMA) and dynamic Z-score thresholds ($z > 2.5$) across order throughput, scanner health, and network latency.
2. **Investigate (Investigation Agent)**: Cross-subsystem signal correlation linking hardware drop counters on Core Switch SW-03 to HTTP 504 timeouts on the optical scanner gateway subnet.
3. **Understand (Root Cause Agent)**: Synthesis of a directed acyclic Bayesian causal dependency graph isolating the true root cause and quantifying collateral blast radius.
4. **Simulate (Simulation Agent)**: In silico evaluation of alternative interventions using fluid flow and queuing mechanics to project recovery time, residual SLA breach risk, and throughput impact.
5. **Recommend (Decision Agent)**: Multi-criteria utility ranking that explains trade-offs and highlights the optimal intervention.
6. **Approve (Risk Governance Engine)**: Safety classification into Low, Medium, and High risk tiers with cryptographic digital sign-off gates.
7. **Execute (Controlled Action Gateway)**: Idempotent command dispatch over mutual TLS with automatic pre-execution rollback snapshotting.
8. **Verify (Continuous Verification Agent)**: Before-vs-after statistical delta analysis validating throughput recovery and monitoring telemetry drift over a 15-minute stability window.
9. **Learn (Reporting & Runbook Agent)**: Automated synthesis of an audit-ready executive incident post-mortem with recommended runbook updates.

---

## Architecture

AegisFlow separates concerns cleanly into specialized service layers rather than relying on a single monolithic model:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND INTERFACE (NEXT.JS)                              │
│   Command Center  •  Live Operations  •  Incidents  •  Investigation Workspace         │
│   Simulation Studio  •  Action Gateway  •  Verification  •  Agents  •  Audit  •  Demo   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ Typed REST API / JSON
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               BACKEND API (FASTAPI)                                    │
│   /events  •  /incidents  •  /investigations  •  /root-cause  •  /simulations          │
│   /recommendations  •  /approvals  •  /actions  •  /verification  •  /audit  •  /demo   │
└──────────┬───────────────────────┬───────────────────────┬──────────────────────┬──────┘
           │                       │                       │                      │
           ▼                       ▼                       ▼                      ▼
┌──────────────────────┐┌──────────────────────┐┌──────────────────────┐┌────────────────┐
│ TELEMETRY SIMULATOR  ││ ANOMALY DETECTOR     ││ ROOT CAUSE ENGINE    ││ SIMULATION     │
│ Multi-facility time  ││ EWMA + Z-Score       ││ Bayesian Causal      ││ Queuing Theory │
│ series generator     ││ Multi-metric scoring ││ Graph Builder        ││ M/M/c Engine   │
└──────────────────────┘└──────────────────────┘└──────────────────────┘└──────┬─────────┘
                                                                               │
                                                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         AI REASONING LAYER (PROVIDER ABSTRACTION)                      │
│   Deterministic Enterprise Engine (Offline)  ◄──►  Amazon Bedrock (Claude 3.5 Sonnet)   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      GOVERNANCE, ACTION GATEWAY & VERIFICATION                         │
│   Risk Engine (Tier 1/2/3)  •  Allowlist Validator  •  Rollback Snapshot Engine        │
│   Continuous Telemetry Diff Verifier  •  Tamper-Evident SHA-256 Audit Ledger           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

- **AI Operations Command Center**: High-density operational visibility across 4 regional fulfillment centers (`WH-01 Seattle`, `WH-02 Dallas`, `WH-03 Chicago`, `WH-04 Atlanta`) with live health status and throughput sparklines.
- **Root Cause Causal Chain**: Interactive node-link visualization of failure propagation: Network Buffer Drop $\rightarrow$ Scanner API Timeouts $\rightarrow$ Induction Slowdown $\rightarrow$ Buffer Accumulation $\rightarrow$ Carrier SLA Risk.
- **Enterprise Evidence Drawer**: Rigorously separates **[Observed]** sensor metrics and syslog counters from **[Correlated]** events, **[Inferred]** root cause hypotheses, and **[Predicted]** trajectories to eliminate AI hallucination.
- **Counterfactual Simulation Studio**: Side-by-side scenario matrix comparing predicted recovery duration, throughput gain, residual SLA risk, financial cost, and reversibility across 4 candidate interventions.
- **Controlled Action Gateway**: Strict allowlist policy (`traffic.reroute_processing_queue`, `cluster.restart_scanner_service`, etc.) preventing arbitrary command execution.
- **Immutable Cryptographic Audit Trail**: Tamper-evident log with SHA-256 block chaining and verification (`/api/v1/audit/verify-chain`).
- **Post-Incident Executive Briefing Generator**: Print-ready post-mortem documentation detailing timelines, root causes, evaluated alternatives, human sign-offs, and verification proof.
- **Global Command Palette**: Instant navigation and demo control accessible anywhere via `Ctrl+K`.

---

## AI Agent Architecture

| Agent | Operational Stage | Engine / Model | Primary Responsibility | Permitted Tools |
| :--- | :--- | :--- | :--- | :--- |
| **Sentinel Agent** | Detect | Statistical EWMA + Z-Score | Continuous 500ms multi-metric telemetry stream scoring | `telemetry.read_stream`, `anomaly.evaluate_vector`, `alert.trigger_p1` |
| **Investigation Agent** | Investigate | Amazon Bedrock / Claude 3.5 | Cross-subsystem topology correlation and log parsing | `logs.query_opensearch`, `topology.query_cmdb`, `metrics.correlate` |
| **Root Cause Agent** | Understand | Bayesian Causal Synthesis | Directed acyclic causal graph synthesis and root isolation | `graph.synthesize_causal_chain`, `blast_radius.calculate`, `evidence.classify` |
| **Simulation Agent** | Simulate | Deterministic Queuing ($M/M/c$) | In silico fluid dynamic forward recovery projections | `simulation.run_fluid_model`, `queue.project_drain`, `sla.calculate_delta` |
| **Decision Agent** | Recommend | Multi-Criteria Utility Optimizer | Trade-off ranking and transparent rationale synthesis | `decision.rank_scenarios`, `explain.generate_recommendation` |
| **Risk Agent** | Approve | Enterprise Policy Evaluator | Blast radius safety gating and approval authorization | `policy.verify_allowlist`, `rbac.check_permission`, `security.validate_signature` |
| **Execution Agent** | Execute | Idempotent Dispatcher | Allowlisted mTLS dispatch and pre-execution snapshotting | `gateway.dispatch_mtls`, `snapshot.capture_pre_state`, `rollback.execute_safe` |
| **Verification Agent** | Verify | Hypothesis Testing ($t$-test / KS) | Before/after metric delta recovery analysis & drift watch | `telemetry.compute_delta`, `drift.watch_window`, `verdict.generate_status` |
| **Reporting Agent** | Learn | Amazon Bedrock / Claude 3.5 | Audit briefings, executive post-mortems, runbook updates | `report.generate_executive_briefing`, `runbook.propose_rule_patch` |

---

## Safety & Human Oversight

1. **Strict Tool Boundaries**: The LLM is used solely for natural-language synthesis, evidence interpretation, and explanation. Numerical anomaly scores, queue drain rates, and risk calculations are produced by deterministic Python algorithms.
2. **Predefined Allowlist**: Any command not in `data/rules/action_allowlist.json` is rejected by the Action Gateway.
3. **Risk-Tiered Authorization**:
   - **Tier 1 (Low)**: Reversible with zero blast radius (e.g., rolling daemon restart, workforce floor shift).
   - **Tier 2 (Medium)**: Operational routing diversion requiring authorized Operator digital signature.
   - **Tier 3 (High)**: Switch port isolation or intake throttling requiring Security Admin + Platform Admin dual-signoff.
4. **Zero-Loss Rollback**: Pre-execution snapshots captured prior to command dispatch enable instant state rollback.

---

## Technology Stack

- **Frontend**: Next.js 16 (React 19, TypeScript, App Router), Tailwind CSS v4, Lucide React icons.
- **Backend API**: Python 3.11+, FastAPI, Pydantic v2 schemas, Uvicorn ASGI server.
- **Telemetry & Modeling**: Pure-Python statistical anomaly detector and fluid queuing theory simulator.
- **AI Integration**: Amazon Bedrock provider abstraction (`anthropic.claude-3-5-sonnet-20240620-v1:0`) with fallback to local deterministic reasoning provider.
- **Testing & CI**: Pytest, FastAPI TestClient, GitHub Actions CI workflow.

---

## Project Structure

```
AegisFlow AI/
├── .github/
│   └── workflows/
│       └── ci.yml                      # Automated CI: backend tests & frontend build
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entrypoint, middleware, routers
│   │   ├── config.py                   # Configuration and environment settings
│   │   ├── models/                     # Pydantic v2 domain schemas
│   │   │   ├── telemetry.py
│   │   │   ├── incident.py
│   │   │   ├── simulation.py
│   │   │   ├── action.py
│   │   │   ├── agent.py
│   │   │   └── audit.py
│   │   ├── services/                   # Operational engines & simulators
│   │   │   ├── telemetry_simulator.py  # Multi-facility time series simulator
│   │   │   ├── anomaly_detector.py     # Statistical EWMA + Z-score engine
│   │   │   ├── root_cause_engine.py    # Bayesian causal dependency builder
│   │   │   ├── simulation_engine.py    # Deterministic M/M/c queuing model
│   │   │   ├── risk_engine.py          # Action risk evaluator & RBAC
│   │   │   ├── action_gateway.py       # Controlled allowlisted dispatch
│   │   │   ├── verification_engine.py  # Continuous recovery delta verifier
│   │   │   ├── audit_service.py        # Cryptographic SHA-256 audit ledger
│   │   │   └── report_generator.py     # Post-incident report generator
│   │   ├── ai/                         # Dual AI provider abstraction
│   │   │   ├── base.py                 # Abstract AI provider interface
│   │   │   ├── bedrock_provider.py     # Amazon Bedrock Claude 3.5 runtime
│   │   │   └── deterministic_provider.py # Zero-dependency local reasoning
│   │   └── api/v1/                     # Modular REST API routers
│   │       ├── telemetry.py
│   │       ├── incidents.py
│   │       ├── simulations.py
│   │       ├── actions.py
│   │       ├── agents.py
│   │       ├── audit.py
│   │       ├── analytics.py
│   │       ├── scenarios.py
│   │       ├── reports.py
│   │       └── verification.py
│   ├── tests/                          # Backend unit & integration tests
│   │   ├── conftest.py
│   │   ├── test_anomaly_detection.py
│   │   ├── test_simulation_models.py
│   │   ├── test_action_gateway.py
│   │   └── test_end_to_end_flow.py
│   ├── requirements.txt
│   └── run.py
├── data/
│   ├── scenarios/                      # Deterministic demo scenario datasets
│   │   ├── warehouse_03_scanner_outage.json
│   │   ├── warehouse_02_order_surge.json
│   │   └── baseline_nominal.json
│   ├── topology/                       # Facility network topology configurations
│   │   └── warehouse_network_topology.json
│   └── rules/                          # Enterprise action governance allowlist
│       └── action_allowlist.json
├── docs/
│   ├── AWS_ARCHITECTURE.md             # Enterprise AWS Cloud Native Blueprint
│   ├── HACKATHON_DEMO_SCRIPT.md        # 3-minute pitch presentation script
│   └── SECURITY_MODEL.md               # Controlled autonomy & RBAC specification
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              # Root HTML shell
│   │   │   ├── page.tsx                # Public Landing Page (Editorial Hero)
│   │   │   ├── (dashboard)/            # Authenticated Command Center Shell
│   │   │   │   ├── layout.tsx          # Enterprise Shell (Header, Sidebar, Tour)
│   │   │   │   ├── overview/page.tsx   # Operational Command Center
│   │   │   │   ├── operations/page.tsx # Live Operations & Warehouse Network
│   │   │   │   ├── incidents/page.tsx  # Incidents Directory
│   │   │   │   ├── incidents/[id]/page.tsx # Deep Investigation & Causal Graph
│   │   │   │   ├── simulations/page.tsx# Simulation Studio & Comparison Matrix
│   │   │   │   ├── actions/page.tsx    # Action Gateway & Approval Center
│   │   │   │   ├── verification/page.tsx# Continuous Verification Workspace
│   │   │   │   ├── agents/page.tsx     # Autonomous AI Agents Registry
│   │   │   │   ├── audit/page.tsx      # Immutable Cryptographic Audit Trail
│   │   │   │   ├── analytics/page.tsx  # Operational Reliability & Benchmarks
│   │   │   │   ├── reports/[id]/page.tsx# Executive Incident Post-Mortem Report
│   │   │   │   ├── demo/page.tsx       # 7-Scenario Presentation Lab
│   │   │   │   └── settings/page.tsx   # Platform & Security Settings
│   │   ├── components/
│   │   │   ├── layout/                 # Sidebar, Header, CommandPalette
│   │   │   └── demo/                   # DemoTourBanner
│   │   ├── lib/
│   │   │   ├── api.ts                  # Typed client with high-fidelity fallbacks
│   │   │   └── types.ts                # TypeScript domain models
│   │   └── styles/
│   │       └── globals.css             # Enterprise design system tokens
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── scripts/
│   ├── dev.sh                          # Start full dev stack (Unix)
│   ├── dev.ps1                         # Start full dev stack (PowerShell)
│   ├── run_tests.sh                    # Automated test runner (Unix)
│   ├── run_tests.ps1                   # Automated test runner (PowerShell)
│   └── seed_demo.py                    # Demo state verification & seed utility
├── tests/
│   ├── conftest.py
│   └── test_platform.py                # Top-level system integration tests
├── .env.example                        # Environment variables template
├── .gitignore
├── LICENSE                             # MIT License
└── README.md
```

---

## Local Setup & Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ (Node 20+ recommended)
- npm 9+

### 1. Clone & Configure
```bash
git clone https://github.com/shanushekhawat7773-blip/AegisFlow-AI.git
cd AegisFlow-AI

# Create your local environment configuration
cp .env.example .env
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# (Optional) Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Unix/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend tests
python -m pytest tests

# Start FastAPI server (runs on port 8000)
python run.py
```
*Backend API documentation is available at: `http://127.0.0.1:8000/docs`*

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server (runs on port 3000)
npm run dev
```
*Open your browser to: `http://localhost:3000`*

---

## Environment Variables

Copy `.env.example` to `.env`. Placeholder configuration:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `AEGISFLOW_ENV` | `demo` | Environment tier: `demo`, `staging`, or `production`. |
| `AI_PROVIDER` | `deterministic` | Provider mode: `deterministic` (zero-dependency offline) or `bedrock`. |
| `AWS_REGION` | `us-east-1` | Target AWS region for Bedrock and EventBridge. |
| `AWS_BEDROCK_MODEL_ID` | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Amazon Bedrock foundation model ID. |
| `AWS_ACCESS_KEY_ID` | *(optional)* | AWS IAM access key (if using Bedrock outside IAM roles). |
| `AWS_SECRET_ACCESS_KEY` | *(optional)* | AWS IAM secret key. |
| `ANOMALY_ZSCORE_THRESHOLD`| `2.5` | Standard deviation threshold for Sentinel anomaly trigger. |
| `EWMA_ALPHA` | `0.3` | Smoothing factor for moving average baseline. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | URL of the FastAPI backend service. |

---

## Example Incident Walkthrough

During the live demonstration, evaluate **Incident #INC-4091: Warehouse 03 Order Processing Degradation**:

1. **0:00 - 0:30 (Detect)**: In `/overview`, Sentinel Agent triggers a P1 Critical alert on `Warehouse 03 (Chicago)`. Induction throughput collapses from 1,600 to 780 parcels/hr (-51%), and carrier SLA failure risk surges to 88.5%.
2. **0:30 - 1:15 (Investigate)**: In `/incidents/INC-4091`, Bayesian correlation traces the failure chain: Core Switch SW-03 input buffer drops frame packets $\rightarrow$ Optical Scanner API times out (34.2% HTTP 504s) $\rightarrow$ Induction Lines 4-6 decelerate $\rightarrow$ Central queue escalates to 4,820 parcels. Inspect the **Evidence Drawer** to verify observed physical discards versus inferred hypotheses.
3. **1:15 - 2:00 (Simulate)**: In `/simulations`, the Simulation Studio evaluates 4 candidate interventions. The Decision Agent recommends **Scenario B: Dynamic Traffic Reroute** (diverts 65% of volume to auxiliary lines 1-3), forecasting throughput recovery to 1,580/hr in 6 minutes with zero downtime.
4. **2:00 - 2:30 (Approve & Act)**: In `/actions`, review the MEDIUM risk classification. Authorized Operator Sarah Chen submits digital signature `SIG-ED25519-88F4A2`. The Action Gateway snapshots system state and dispatches the command over mutual TLS.
5. **2:30 - 3:00 (Verify & Learn)**: In `/verification`, live telemetry confirms recovery: throughput rebounds to **1,565 packages/hr**, the staging queue drains by **80.5%**, and SLA breach risk collapses to **2.9%**. View the **Executive Incident Report** (`/reports/INC-4091`) detailing $42,600 in avoided carrier penalties.

---

## Testing

AegisFlow AI features automated test coverage across algorithms, simulation formulas, safety gates, and repository integrity:

```bash
# Run all tests (backend + top-level system verification)
python -m pytest backend/tests tests/test_platform.py -v
```

**Test Suites**:
- `test_anomaly_detection.py`: Verifies nominal telemetry acceptance and Z-score threshold breaches ($z > 2.5$).
- `test_simulation_models.py`: Validates deterministic $M/M/c$ queuing theory projections and scenario utility ranking.
- `test_action_gateway.py`: Enforces allowlist rejection, RBAC approval permissions, and execution lifecycles.
- `test_end_to_end_flow.py`: Verifies the full 9-stage closed-loop operational flow via FastAPI TestClient.
- `test_platform.py`: Verifies directory structure, JSON scenario schemas, and all 16 API endpoints.

---

## AWS Deployment Architecture

In production, AegisFlow AI maps directly to AWS managed infrastructure:

- **Amazon Bedrock**: Runs agentic natural-language reasoning, root cause synthesis, and executive briefing generation using Anthropic Claude 3.5 Sonnet.
- **Amazon EventBridge**: Routes high-throughput telemetry events from PLC sensors and edge gateways to downstream micro-agents without polling.
- **AWS Lambda & ECS Fargate**: Serverless execution of the Sentinel Anomaly Evaluator and containerized execution of the Simulation Engine.
- **Amazon OpenSearch Service**: Indexes switch syslog discards, WMS events, and historical incident vectors for rapid correlation.
- **Amazon DynamoDB**: Stores rolling 30-minute metric windows, active incident states, and distributed execution locks with sub-10ms latency.
- **Amazon S3**: Immutable storage for tamper-evident audit logs, pre-execution rollback snapshots, and generated PDF incident reports.
- **Amazon Cognito**: Authenticates operators, analysts, and administrators with role-based IAM policies.
- **Amazon CloudWatch**: Telemetry drift monitoring to guard against secondary operational regressions.

*For complete network diagrams and service mappings, see [`docs/AWS_ARCHITECTURE.md`](docs/AWS_ARCHITECTURE.md).*

---

## Future Roadmap

- **Multi-Facility Cross-Routing**: Autonomous inter-facility freight rebalancing between regional fulfillment hubs during severe weather disruptions.
- **Automated PLC Firmware Canarying**: Shadow testing scanner cluster firmware patches in staging environments prior to production rollout.
- **Reinforcement Learning from Operational Feedback (RLOF)**: Continuous calibration of simulation models based on verified post-intervention recovery curves.
- **Predictive Edge Sidecars**: Lightweight WASM/Rust edge sidecars running on industrial IoT gateways for sub-10ms anomaly detection.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
