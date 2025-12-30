"""Mock Blockchain Service - Simulates Hyperledger Fabric interactions"""
import uuid
import hashlib
from datetime import datetime
from typing import Dict, Any, Optional

class BlockchainService:
    """
    Mock blockchain service that simulates Hyperledger Fabric interactions.
    In production, this would connect to the actual Fabric Gateway SDK.
    """
    
    def __init__(self):
        """Initialize mock blockchain state"""
        # In-memory ledger (simulates blockchain state)
        self._ledger: Dict[str, Dict[str, Any]] = {}
        # Transaction log
        self._transactions: list = []
    
    def _generate_tx_hash(self, data: str) -> str:
        """Generate a mock transaction hash"""
        timestamp = datetime.utcnow().isoformat()
        combined = f"{data}:{timestamp}:{uuid.uuid4().hex}"
        return f"0x{hashlib.sha256(combined.encode()).hexdigest()[:16]}"
    
    def create_evidence_record(
        self,
        evidence_id: str,
        file_hash: str,
        custodian: str,
        metadata: Dict[str, Any]
    ) -> str:
        """
        Create a new evidence record on the blockchain.
        
        Args:
            evidence_id: Unique evidence identifier
            file_hash: SHA-256 hash of the evidence file
            custodian: Current custodian role
            metadata: Additional metadata
            
        Returns:
            Transaction hash
        """
        tx_hash = self._generate_tx_hash(f"CREATE:{evidence_id}:{file_hash}")
        
        record = {
            "evidence_id": evidence_id,
            "file_hash": file_hash,
            "custodian": custodian,
            "created_at": datetime.utcnow().isoformat(),
            "metadata": metadata,
            "events": [{
                "type": "created",
                "timestamp": datetime.utcnow().isoformat(),
                "actor": custodian,
                "tx_hash": tx_hash
            }]
        }
        
        self._ledger[evidence_id] = record
        self._transactions.append({
            "tx_hash": tx_hash,
            "type": "CREATE",
            "evidence_id": evidence_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return tx_hash
    
    def log_access_event(
        self,
        evidence_id: str,
        actor: str,
        actor_name: str,
        action: str = "accessed"
    ) -> str:
        """
        Log an access event on the blockchain.
        
        Args:
            evidence_id: Evidence identifier
            actor: Actor role
            actor_name: Actor's full name
            action: Type of access
            
        Returns:
            Transaction hash
        """
        tx_hash = self._generate_tx_hash(f"ACCESS:{evidence_id}:{actor}")
        
        if evidence_id in self._ledger:
            self._ledger[evidence_id]["events"].append({
                "type": action,
                "timestamp": datetime.utcnow().isoformat(),
                "actor": actor,
                "actor_name": actor_name,
                "tx_hash": tx_hash
            })
        
        self._transactions.append({
            "tx_hash": tx_hash,
            "type": "ACCESS",
            "evidence_id": evidence_id,
            "actor": actor,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return tx_hash
    
    def transfer_custody(
        self,
        evidence_id: str,
        from_role: str,
        from_name: str,
        to_role: str,
        to_name: str,
        reason: str
    ) -> str:
        """
        Transfer custody of evidence on the blockchain.
        
        Args:
            evidence_id: Evidence identifier
            from_role: Current custodian role
            from_name: Current custodian name
            to_role: New custodian role
            to_name: New custodian name
            reason: Reason for transfer
            
        Returns:
            Transaction hash
        """
        tx_hash = self._generate_tx_hash(f"TRANSFER:{evidence_id}:{from_role}:{to_role}")
        
        if evidence_id in self._ledger:
            self._ledger[evidence_id]["custodian"] = to_role
            self._ledger[evidence_id]["events"].append({
                "type": "transferred",
                "timestamp": datetime.utcnow().isoformat(),
                "from_role": from_role,
                "from_name": from_name,
                "to_role": to_role,
                "to_name": to_name,
                "reason": reason,
                "tx_hash": tx_hash
            })
        
        self._transactions.append({
            "tx_hash": tx_hash,
            "type": "TRANSFER",
            "evidence_id": evidence_id,
            "from": from_role,
            "to": to_role,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return tx_hash
    
    def verify_integrity(
        self,
        evidence_id: str,
        current_hash: str
    ) -> Dict[str, Any]:
        """
        Verify evidence integrity by comparing hashes.
        
        Args:
            evidence_id: Evidence identifier
            current_hash: Current calculated hash
            
        Returns:
            Verification result with blockchain hash
        """
        tx_hash = self._generate_tx_hash(f"VERIFY:{evidence_id}:{current_hash}")
        
        if evidence_id not in self._ledger:
            return {
                "verified": False,
                "reason": "Evidence not found on blockchain",
                "tx_hash": tx_hash
            }
        
        original_hash = self._ledger[evidence_id]["file_hash"]
        is_match = original_hash == current_hash
        
        # Log verification event
        self._ledger[evidence_id]["events"].append({
            "type": "verified",
            "timestamp": datetime.utcnow().isoformat(),
            "result": "match" if is_match else "mismatch",
            "tx_hash": tx_hash
        })
        
        self._transactions.append({
            "tx_hash": tx_hash,
            "type": "VERIFY",
            "evidence_id": evidence_id,
            "result": "match" if is_match else "mismatch",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return {
            "verified": is_match,
            "original_hash": original_hash,
            "current_hash": current_hash,
            "match": is_match,
            "tx_hash": tx_hash,
            "message": "Integrity verified - hash matches" if is_match else "INTEGRITY ALERT - hash mismatch detected"
        }
    
    def get_evidence_events(self, evidence_id: str) -> list:
        """Get all events for an evidence record"""
        if evidence_id in self._ledger:
            return self._ledger[evidence_id]["events"]
        return []
    
    def get_evidence_record(self, evidence_id: str) -> Optional[Dict[str, Any]]:
        """Get evidence record from blockchain"""
        return self._ledger.get(evidence_id)

# Global blockchain service instance (simulates network connection)
blockchain = BlockchainService()
