"""Evidence Service - Business logic for evidence management"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import UploadFile
from ..models.evidence import (
    Evidence, EvidenceCreate, CustodyTransfer, 
    AccessLog, CustodyHistoryItem, CustodyHistory
)
from ..models.auth import User
from .storage_service import StorageService
from .blockchain_service import blockchain

class EvidenceService:
    """Service for managing digital evidence"""
    
    def __init__(self):
        self.storage = StorageService()
        # In-memory evidence store (in production, use database)
        self._evidence_store: Dict[str, Evidence] = {}
        self._access_logs: List[AccessLog] = []
    
    async def upload_evidence(
        self,
        file: UploadFile,
        metadata: EvidenceCreate,
        user: User
    ) -> Evidence:
        """
        Upload and register new evidence.
        
        Args:
            file: Uploaded file
            metadata: Evidence metadata
            user: Current user performing upload
            
        Returns:
            Created Evidence record
        """
        # Read file content
        file_bytes = await file.read()
        
        # Store file and get hash
        stored_filename, file_hash, file_size = self.storage.store_file(
            file_bytes, file.filename
        )
        
        # Create evidence record
        evidence = Evidence(
            case_id=metadata.case_id,
            filename=stored_filename,
            original_filename=file.filename,
            evidence_type=metadata.evidence_type,
            description=metadata.description,
            notes=metadata.notes,
            file_hash=file_hash,
            file_size=file_size,
            custodian=user.role,
            custodian_name=user.full_name,
            status="registered"
        )
        
        # Register on blockchain
        blockchain_tx = blockchain.create_evidence_record(
            evidence_id=evidence.id,
            file_hash=file_hash,
            custodian=user.role,
            metadata={
                "case_id": metadata.case_id,
                "description": metadata.description,
                "evidence_type": metadata.evidence_type,
                "uploader": user.full_name
            }
        )
        evidence.blockchain_tx = blockchain_tx
        
        # Store evidence
        self._evidence_store[evidence.id] = evidence
        
        # Log access
        self._log_access(
            evidence.id, "created", user,
            f"Evidence uploaded: {file.filename}"
        )
        
        return evidence
    
    def get_evidence(self, evidence_id: str) -> Optional[Evidence]:
        """Get evidence by ID"""
        return self._evidence_store.get(evidence_id)
    
    def get_all_evidence(self, user: User) -> List[Evidence]:
        """Get all evidence (filtered by role permissions)"""
        # For simplicity, return all evidence for any authenticated user
        return list(self._evidence_store.values())
    
    def log_access(self, evidence_id: str, user: User) -> Optional[AccessLog]:
        """Log evidence access"""
        evidence = self._evidence_store.get(evidence_id)
        if not evidence:
            return None
        
        # Log on blockchain
        blockchain.log_access_event(
            evidence_id=evidence_id,
            actor=user.role,
            actor_name=user.full_name,
            action="accessed"
        )
        
        return self._log_access(
            evidence_id, "accessed", user,
            f"Evidence viewed by {user.full_name}"
        )
    
    def transfer_custody(
        self,
        evidence_id: str,
        transfer: CustodyTransfer,
        user: User
    ) -> Optional[Evidence]:
        """Transfer evidence custody to another role"""
        evidence = self._evidence_store.get(evidence_id)
        if not evidence:
            return None
        
        # Verify current user is the custodian
        if evidence.custodian != user.role:
            raise PermissionError(
                f"Only current custodian ({evidence.custodian}) can transfer custody"
            )
        
        # Record on blockchain
        blockchain_tx = blockchain.transfer_custody(
            evidence_id=evidence_id,
            from_role=user.role,
            from_name=user.full_name,
            to_role=transfer.to_role,
            to_name=transfer.to_name,
            reason=transfer.reason
        )
        
        # Update evidence
        old_custodian = evidence.custodian
        evidence.custodian = transfer.to_role
        evidence.custodian_name = transfer.to_name
        evidence.status = "transferred"
        evidence.updated_at = datetime.utcnow()
        evidence.blockchain_tx = blockchain_tx
        
        # Log access
        self._log_access(
            evidence_id, "transferred", user,
            f"Custody transferred from {old_custodian} to {transfer.to_role}: {transfer.reason}"
        )
        
        return evidence
    
    def verify_integrity(self, evidence_id: str, user: User) -> Dict[str, Any]:
        """Verify evidence integrity"""
        evidence = self._evidence_store.get(evidence_id)
        if not evidence:
            return {"error": "Evidence not found", "verified": False}
        
        # Recalculate hash from stored file
        try:
            file_bytes = self.storage.retrieve_file(evidence.filename)
            current_hash = self.storage.calculate_hash_from_bytes(file_bytes)
        except FileNotFoundError:
            return {
                "error": "Evidence file not found",
                "verified": False,
                "evidence_id": evidence_id
            }
        
        # Verify on blockchain
        result = blockchain.verify_integrity(evidence_id, current_hash)
        
        # Update evidence integrity status
        evidence.integrity_verified = result["verified"]
        if result["verified"]:
            evidence.status = "verified"
        evidence.updated_at = datetime.utcnow()
        
        # Log verification
        self._log_access(
            evidence_id, "verified", user,
            f"Integrity verification: {'PASSED' if result['verified'] else 'FAILED'}"
        )
        
        return {
            **result,
            "evidence_id": evidence_id,
            "filename": evidence.original_filename
        }
    
    def get_custody_history(self, evidence_id: str) -> Optional[CustodyHistory]:
        """Get full custody history for evidence"""
        evidence = self._evidence_store.get(evidence_id)
        if not evidence:
            return None
        
        # Get events from blockchain
        blockchain_events = blockchain.get_evidence_events(evidence_id)
        
        # Convert to history items
        timeline = []
        for event in blockchain_events:
            item = CustodyHistoryItem(
                event=event.get("type", "unknown"),
                actor_role=event.get("to_role") or event.get("actor", "unknown"),
                actor_name=event.get("to_name") or event.get("actor_name", "System"),
                details=event.get("reason") or event.get("result"),
                timestamp=datetime.fromisoformat(event["timestamp"]),
                blockchain_tx=event.get("tx_hash")
            )
            timeline.append(item)
        
        return CustodyHistory(
            evidence_id=evidence_id,
            timeline=timeline
        )
    
    def _log_access(
        self,
        evidence_id: str,
        event_type: str,
        user: User,
        details: str
    ) -> AccessLog:
        """Internal method to log access"""
        log = AccessLog(
            evidence_id=evidence_id,
            event_type=event_type,
            actor_role=user.role,
            actor_name=user.full_name,
            details=details
        )
        self._access_logs.append(log)
        return log

# Global service instance
evidence_service = EvidenceService()
