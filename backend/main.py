"""
Digital Evidence Chain-of-Custody Platform
==========================================
FastAPI Backend for managing digital evidence with blockchain abstraction.

Features:
- JWT Authentication with role-based access
- Evidence upload with SHA-256 hashing
- Chain-of-custody tracking
- Mock blockchain integration
- Integrity verification
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import routers
from app.routers import auth_router, evidence_router

# Create FastAPI app
app = FastAPI(
    title="Evidence Chain-of-Custody API",
    description="Digital Evidence Management Platform with Blockchain Abstraction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(evidence_router, prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Evidence Chain-of-Custody API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/api")
async def api_root():
    """API info endpoint"""
    return {
        "message": "Evidence Chain-of-Custody API",
        "endpoints": {
            "auth": "/api/auth/login",
            "evidence": "/api/evidence",
            "upload": "/api/evidence/upload",
            "verify": "/api/evidence/{id}/verify",
            "transfer": "/api/evidence/{id}/transfer",
            "history": "/api/evidence/{id}/history"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "evidence-api"}

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Evidence Chain-of-Custody API starting up...")
    # Create storage directory
    storage_dir = ROOT_DIR / "evidence_storage"
    storage_dir.mkdir(exist_ok=True)
    logger.info(f"Storage directory: {storage_dir}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Evidence Chain-of-Custody API shutting down...")
