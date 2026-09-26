# AegisFlow AI — Enterprise Security, RBAC & Governance Model

> **AegisFlow AI — Predict. Investigate. Simulate. Act.**  
> *From operational signal to verified action.*

---

## 1. Controlled Autonomy Principle

Modern autonomous systems often fail in enterprise environments because they either provide zero autonomy (requiring humans to perform every keystroke) or dangerous unrestricted autonomy (giving LLMs shell access to production infrastructure).

AegisFlow enforces **Controlled Autonomy**:
1. **No Direct Execution by LLM**: The language model is an advisory and analytical engine only. It constructs explanations, summarizes evidence, and interprets telemetry. It cannot execute code or dispatch network packets directly.
2. **Predefined Action Allowlist**: All interventions must map to an approved schema in the Action Gateway. Any action not present in the allowlist is rejected automatically by the policy engine.
3. **Deterministic Verification Gate**: Actions are only marked as successful after mathematical verification proves system recovery.

---

## 2. Action Risk Classification Matrix

| Risk Tier | Criteria | Autonomy Level | Required Authorization | Examples |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Low)** | Fully reversible; zero downtime; zero blast radius. | **Auto-executable** in simulation or 1-click execution. | Operator / Analyst | Rolling cache reset, diagnostic verbosity elevation, workforce station shift. |
| **Tier 2 (Medium)** | Affects active traffic distribution; reversible with low blast radius. | **Gated Autonomy**: Action formulated by AI, dispatched only upon human sign-off. | Authorized Operator (Digital Signature) | Dynamic traffic reroute (`traffic.reroute_processing_queue`), scanner cluster rolling reboot. |
| **Tier 3 (High)** | Irreversible or wide blast radius across critical infrastructure. | **Strict Dual-Signoff**: Requires security review and cryptographic 2FA confirmation. | Security Administrator + Platform Administrator | Network switch port isolation (`network.isolate_switch_port`), global inbound intake throttling. |

---

## 3. Cryptographic Audit Trail Architecture

Every operational state change is logged in an append-only cryptographic ledger inspired by blockchain sequencing:

```
[Block N-1: Previous Hash] ◄──┐
                              │
[Block N Payload:             │
  - Sequence Number           │
  - Timestamp (UTC)           │
  - Event Type                │
  - Actor Identity & Role     │
  - Action Parameters         │
  - SHA-256 Payload Hash] ────┴── [Block N+1: Previous Hash]
```

- **Tamper Evidence**: If an adversary alters any log entry, all subsequent SHA-256 hashes become invalid.
- **Verification Endpoint**: `GET /api/v1/audit/verify-chain` programmatically verifies ledger integrity across all blocks.
- **Role Signatures**: Approvals contain an Ed25519 digital signature string linked to the operator's verified Cognito session.
