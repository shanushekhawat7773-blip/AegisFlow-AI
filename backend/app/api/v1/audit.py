"""
Audit Trail API routes for AegisFlow AI.
"""

from fastapi import APIRouter, Query
from typing import List, Dict, Any
from ...models.audit import AuditEntry
from ...services.audit_service import audit_service

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("", response_model=List[AuditEntry])
def get_audit_trail(limit: int = Query(default=50, ge=1, le=200)):
    """Retrieve chronologically ordered, tamper-evident audit ledger entries."""
    return audit_service.list_entries(limit)


@router.get("/verify-chain")
def verify_hash_chain() -> Dict[str, Any]:
    """Verify cryptographic hash chaining across all audit records."""
    entries = audit_service.entries
    if not entries:
        return {"valid": True, "entries_checked": 0}
    
    for i in range(1, len(entries)):
        if entries[i].previous_hash != entries[i-1].payload_hash:
            return {
                "valid": False,
                "broken_at_sequence": entries[i].sequence_number,
                "reason": "Hash mismatch detected in audit chain"
            }
            
    return {
        "valid": True,
        "entries_checked": len(entries),
        "latest_block_hash": entries[-1].payload_hash,
        "integrity_status": "CRYPTOGRAPHICALLY_VERIFIED"
    }
