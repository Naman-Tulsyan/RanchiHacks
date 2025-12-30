"""Storage Service - Local file storage for evidence files"""
import os
import shutil
import hashlib
from pathlib import Path
from typing import Tuple
from datetime import datetime
import uuid

# Storage directory
STORAGE_DIR = Path(__file__).parent.parent.parent / "evidence_storage"

class StorageService:
    """Service for managing evidence file storage"""
    
    def __init__(self):
        """Initialize storage directory"""
        STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    
    @staticmethod
    def calculate_hash(file_path: Path) -> str:
        """Calculate SHA-256 hash of a file"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    
    @staticmethod
    def calculate_hash_from_bytes(file_bytes: bytes) -> str:
        """Calculate SHA-256 hash from file bytes"""
        return hashlib.sha256(file_bytes).hexdigest()
    
    def store_file(self, file_bytes: bytes, original_filename: str) -> Tuple[str, str, int]:
        """
        Store a file and return the stored filename, hash, and size.
        
        Returns:
            Tuple of (stored_filename, file_hash, file_size)
        """
        # Generate unique filename
        ext = Path(original_filename).suffix
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:8]
        stored_filename = f"{timestamp}_{unique_id}{ext}"
        
        # Calculate hash
        file_hash = self.calculate_hash_from_bytes(file_bytes)
        file_size = len(file_bytes)
        
        # Store file
        file_path = STORAGE_DIR / stored_filename
        with open(file_path, "wb") as f:
            f.write(file_bytes)
        
        return stored_filename, file_hash, file_size
    
    def retrieve_file(self, filename: str) -> bytes:
        """Retrieve a stored file by filename"""
        file_path = STORAGE_DIR / filename
        if not file_path.exists():
            raise FileNotFoundError(f"File {filename} not found")
        
        with open(file_path, "rb") as f:
            return f.read()
    
    def verify_file_integrity(self, filename: str, expected_hash: str) -> bool:
        """Verify file integrity by comparing hashes"""
        file_path = STORAGE_DIR / filename
        if not file_path.exists():
            return False
        
        current_hash = self.calculate_hash(file_path)
        return current_hash == expected_hash
    
    def delete_file(self, filename: str) -> bool:
        """Delete a stored file"""
        file_path = STORAGE_DIR / filename
        if file_path.exists():
            file_path.unlink()
            return True
        return False
    
    def get_file_path(self, filename: str) -> Path:
        """Get the full path of a stored file"""
        return STORAGE_DIR / filename
