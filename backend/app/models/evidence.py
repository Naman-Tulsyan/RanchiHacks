"""Evidence Models"""
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
import uuid

StatusType = Literal["registered", "in_analysis", "verified", "transferred", "archived"]
EventType = Literal["created", "accessed", "transferred", "verified", "modified"]

class EvidenceCreate(BaseModel):
    """Evidence upload request"""
    case_id: str
    description: str
    evidence_type: str  # e.g., "document", "image", "video", "audio"
    notes: Optional[str] = None

class Evidence(BaseModel):
    """Evidence record model"""
    id: str = Field(default_factory=lambda: f"EVD-{uuid.uuid4().hex[:8].upper()}")
    case_id: str
    filename: str
    original_filename: str
    evidence_type: str
    description: str
    notes: Optional[str] = None
    file_hash: str  # SHA-256 hash
    file_size: int
    custodian: str  # Current custodian role
    custodian_name: str  # Name of current custodian
    status: StatusType = "registered"
    blockchain_tx: Optional[str] = None
    integrity_verified: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EvidenceResponse(BaseModel):
    """Evidence response model"""
    id: str
    case_id: str
    filename: str
    original_filename: str
    evidence_type: str
    description: str
    notes: Optional[str] = None
    file_hash: str
    file_size: int
    custodian: str
    custodian_name: str
    status: StatusType
    blockchain_tx: Optional[str] = None
    integrity_verified: bool
    created_at: datetime
    updated_at: datetime

class CustodyTransfer(BaseModel):
    """Custody transfer request"""
    to_role: str
    to_name: str
    reason: str
    notes: Optional[str] = None

class AccessLog(BaseModel):
    """Access log entry"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    evidence_id: str
    event_type: EventType
    actor_role: str
    actor_name: str
    details: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    blockchain_tx: Optional[str] = None

class CustodyHistoryItem(BaseModel):
    """Single custody history item"""
    event: EventType
    actor_role: str
    actor_name: str
    details: Optional[str] = None
    timestamp: datetime
    hash: Optional[str] = None
    blockchain_tx: Optional[str] = None

class CustodyHistory(BaseModel):
    """Full custody history response"""
    evidence_id: str
    timeline: List[CustodyHistoryItem]
