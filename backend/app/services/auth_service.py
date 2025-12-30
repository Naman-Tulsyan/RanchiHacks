"""Authentication Service - JWT token management and role-based access"""
import jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..models.auth import User, RoleType

# Security scheme
security = HTTPBearer()

# Secret key for JWT (in production, use a proper secret from environment)
SECRET_KEY = os.environ.get("JWT_SECRET", "hackathon-secret-key-2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Mock user database (simplified for hackathon)
MOCK_USERS = {
    "police_officer": User(
        id="usr-001",
        username="police_officer",
        role="police",
        full_name="Officer John Smith",
        department="Cyber Crime Unit"
    ),
    "forensic_analyst": User(
        id="usr-002",
        username="forensic_analyst",
        role="forensic_lab",
        full_name="Dr. Sarah Johnson",
        department="Digital Forensics Lab"
    ),
    "prosecutor": User(
        id="usr-003",
        username="prosecutor",
        role="prosecutor",
        full_name="James Wilson",
        department="Public Prosecutor Office"
    ),
    "judge": User(
        id="usr-004",
        username="judge",
        role="judge",
        full_name="Hon. Maria Garcia",
        department="District Court"
    )
}

class AuthService:
    """Authentication service for JWT management"""
    
    @staticmethod
    def authenticate_user(username: str, password: str, role: RoleType) -> Optional[User]:
        """Authenticate user (simplified - accepts any password for demo)"""
        # For hackathon: accept demo credentials
        if password == "demo123" or password == "password":
            # Check if we have a mock user for this username
            if username in MOCK_USERS:
                user = MOCK_USERS[username]
                # Verify role matches
                if user.role == role:
                    return user
            # Or create a demo user with the provided role
            return User(
                id=f"usr-{username[:3]}",
                username=username,
                role=role,
                full_name=username.replace("_", " ").title(),
                department=f"{role.replace('_', ' ').title()} Department"
            )
        return None
    
    @staticmethod
    def create_access_token(user: User) -> tuple[str, datetime]:
        """Create JWT access token"""
        expires_at = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        payload = {
            "sub": user.id,
            "username": user.username,
            "role": user.role,
            "full_name": user.full_name,
            "exp": expires_at
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return token, expires_at
    
    @staticmethod
    def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
        """Verify JWT token and return user"""
        try:
            token = credentials.credentials
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            
            return User(
                id=payload["sub"],
                username=payload["username"],
                role=payload["role"],
                full_name=payload["full_name"]
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    @staticmethod
    def require_roles(*allowed_roles: RoleType):
        """Dependency to require specific roles"""
        def role_checker(user: User = Depends(AuthService.verify_token)) -> User:
            if user.role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
                )
            return user
        return role_checker

# Convenience function
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current authenticated user"""
    return AuthService.verify_token(credentials)
