# AegisFlow AI — 3-Minute Hackathon Demonstration Script

> **Product Tagline**: Predict. Investigate. Simulate. Act.  
> **Statement**: From operational signal to verified action.

---

## ⏱️ Pitch Timeline Overview

| Time | Phase | Target Screen | Core Message for Judges |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | **The Problem & Detect** | `/overview` (Command Center) | Observability tools only alert that a problem exists; they don't solve it. Show live anomaly spike in Warehouse 03. |
| **0:30 - 1:15** | **Investigate & Understand** | `/incidents/INC-4091` | Automated causal chain graph isolation. Distinguish observed raw evidence from AI inference. |
| **1:15 - 2:00** | **Simulate & Recommend** | `/simulations` | Counterfactual simulation studio. In silico queuing theory models comparing 4 interventions before touching production. |
| **2:00 - 2:30** | **Approve & Act** | `/actions` | Controlled autonomy: Risk tiering and human-in-the-loop approval. Idempotent action gateway execution. |
| **2:30 - 3:00** | **Verify & Learn** | `/verification` & `/reports/INC-4091` | Mathematical verification of recovery: Throughput rebound, SLA risk collapse, and auto-generated executive post-mortem. |

---

## 🎙️ Step-by-Step Spoken Script

### Minute 0:00 - 0:30: The Problem & Anomaly Detection
> *"Judges, in high-throughput fulfillment networks and automated logistics, downtime doesn't just cost compute—it halts conveyers, breaches carrier deadlines, and costs tens of thousands of dollars per minute. Today, when an alert fires in CloudWatch or Datadog, engineers spend 45 minutes manually triaging logs while queues overflow.*
>
> *This is **AegisFlow AI**—an enterprise agentic platform that moves **from operational signal to verified action**.*
>
> *Here in our live Command Center, the Sentinel Agent continuously monitors 4 regional fulfillment hubs. Look at **Warehouse 03 in Chicago**: throughput just collapsed by 51%, and express delivery SLA breach risk spiked to 88.5%. With one click, let's enter the Incident Investigation Workspace."*

### Minute 0:30 - 1:15: Deep Investigation & Causal Graph
> *(Click into Incident #INC-4091)*
>
> *"AegisFlow doesn't just say 'something is wrong'; it constructs the causal dependency chain. Look at this graph:*
> *A buffer overrun on **Core Switch SW-03** dropped packets to the **Optical Scanner API**, which triggered HTTP 504 timeouts on **Sorting Lines 4-6**, causing the PLC to slow induction, backing up 4,820 parcels.*
>
> *Crucially for enterprise trust: open the **Evidence Drawer**. We strictly separate **[Observed]** physical hardware discards and syslog counters from **[Inferred]** root causes and **[Predicted]** SLA breach trajectories. Nothing is hallucinated."*

### Minute 1:15 - 2:00: Counterfactual Simulation Studio
> *(Click 'Proceed to Simulation Studio')*
>
> *"Now for our flagship capability: **The Simulation Studio**. Before touching a production switch or conveyor line, operators can simulate interventions in silico using deterministic queuing models.*
>
> *The system evaluated four candidate interventions:*
> - *Restarting the daemon takes 18 minutes and causes 3 minutes of total downtime—rejected.*
> - *Workforce rebalance is throughput-constrained—rejected.*
> - *The Decision Agent recommends **Scenario B: Dynamic Traffic Reroute**. It models diverting 65% of volume to auxiliary lines 1-3. The simulation predicts complete throughput restoration in 6 minutes, collapsing SLA risk from 88.5% down to 2.8% with zero downtime."*

### Minute 2:00 - 2:30: Human-in-the-Loop Approval & Action Gateway
> *(Click 'Request Approval & Dispatch to Action Gateway')*
>
> *"AegisFlow believes in **controlled autonomy**, not reckless AI execution. Our Risk Engine classifies this action as **MEDIUM risk**, requiring digital sign-off from an authorized Operator.*
>
> *We review the exact idempotent JSON payload, enter our digital signature as Operations Lead Sarah Chen, and click **Sign & Dispatch Command**.*
>
> *Look at the live terminal: the Action Gateway verifies the cryptographic token, validates against our strict allowlist, takes an immutable pre-state snapshot for zero-loss rollback, and executes over mutual TLS to the edge router."*

### Minute 2:30 - 3:00: Closed-Loop Verification & Executive Post-Mortem
> *(Click 'Verify System Recovery')*
>
> *"Finally, the critical operational question: **Did the action actually work?***
>
> *The Verification Agent immediately begins statistical comparison. Look at the live before-and-after deltas:*
> - *Throughput rebounded from 780 to **1,565 packages per hour**.*
> - *The queue drained by **80.5%**.*
> - *SLA breach risk collapsed from 88.5% to **2.9%**.*
> - *Verdict: **VERIFIED RECOVERED**.*
>
> *To close the loop, open the **Executive Report**: an audit-ready post-mortem with preventative runbook updates generated in seconds. Total MTTR was under 6 minutes, averting $42,600 in carrier penalties.*
>
> *AegisFlow AI: Predict. Investigate. Simulate. Act. Thank you."*
