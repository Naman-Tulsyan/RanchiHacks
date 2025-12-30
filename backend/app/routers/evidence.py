"""Evidence Router - Evidence management API endpoints"""
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from typing import List, Optional
from ..models.evidence import (
    EvidenceCreate, EvidenceResponse, CustodyTransfer, 
    AccessLog, CustodyHistory
)
from ..models.auth import User
from ..services.evidence_service import evidence_service
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/evidence", tags=["Evidence Management"])

@router.post("/upload", response_model=EvidenceResponse)
async def upload_evidence(
    file: UploadFile = File(...),
    case_id: str = Form(...),
    description: str = Form(...),
    evidence_type: str = Form(...),
    notes: Optional[str] = Form(None),
    user: User = Depends(get_current_user)
):
    """
    Upload new evidence file.
    
    - Generates SHA-256 hash
    - Stores file securely
    - Registers on blockchain
    - Returns evidence record with blockchain transaction
    
    Required roles: police, forensic_lab
    """
    if user.role not in ["police", "forensic_lab"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only police and forensic lab can upload evidence"
        )
    
    metadata = EvidenceCreate(
        case_id=case_id,
        description=description,
        evidence_type=evidence_type,
        notes=notes
    )
    
    evidence = await evidence_service.upload_evidence(file, metadata, user)
    return evidence

@router.get("/", response_model=List[EvidenceResponse])
async def list_evidence(
    user: User = Depends(get_current_user)
):
    """Get all evidence accessible to current user."""
    return evidence_service.get_all_evidence(user)

@router.get("/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence(
    evidence_id: str,
    user: User = Depends(get_current_user)
):
    """Get evidence details by ID."""
    evidence = evidence_service.get_evidence(evidence_id)
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence {evidence_id} not found"
        )
    
    # Log access
    evidence_service.log_access(evidence_id, user)
    
    return evidence

@router.post("/{evidence_id}/access", response_model=AccessLog)
async def log_evidence_access(
    evidence_id: str,
    user: User = Depends(get_current_user)
):
    """
    Log an access event for evidence.
    
    Automatically logged when viewing, but can be called explicitly.
    """
    log = evidence_service.log_access(evidence_id, user)
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence {evidence_id} not found"
        )
    return log

@router.post("/{evidence_id}/transfer", response_model=EvidenceResponse)
async def transfer_custody(
    evidence_id: str,
    transfer: CustodyTransfer,
    user: User = Depends(get_current_user)
):
    """
    Transfer evidence custody to another role.
    
    Only the current custodian can transfer custody.
    Transfer is recorded on blockchain.
    """
    try:
        evidence = evidence_service.transfer_custody(evidence_id, transfer, user)
        if not evidence:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Evidence {evidence_id} not found"
            )
        return evidence
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )

@router.post("/{evidence_id}/verify")
async def verify_evidence(
    evidence_id: str,
    user: User = Depends(get_current_user)
):
    """
    Verify evidence integrity.
    
    - Recalculates SHA-256 hash
    - Compares with blockchain record
    - Returns match/mismatch status
    """
    result = evidence_service.verify_integrity(evidence_id, user)
    if "error" in result and not result.get("verified"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"]
        )
    return result

@router.get("/{evidence_id}/history", response_model=CustodyHistory)
async def get_evidence_history(
    evidence_id: str,
    user: User = Depends(get_current_user)
):
    """
    Get full chain-of-custody history for evidence.
    
    Returns timeline of all events from blockchain.
    """
    history = evidence_service.get_custody_history(evidence_id)
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence {evidence_id} not found"
        )
    return history
