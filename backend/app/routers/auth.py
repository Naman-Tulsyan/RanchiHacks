"""Authentication Router - Login and token management"""
from fastapi import APIRouter, HTTPException, status
from ..models.auth import UserLogin, Token
from ..services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Authenticate user and return JWT token.
    
    For demo purposes, use password: "demo123" or "password"
    
    Available demo users:
    - police_officer (role: police)
    - forensic_analyst (role: forensic_lab)
    - prosecutor (role: prosecutor)
    - judge (role: judge)
    
    Or use any username with valid role.
    """
    user = AuthService.authenticate_user(
        credentials.username,
        credentials.password,
        credentials.role
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials or role mismatch"
        )
    
    token, expires_at = AuthService.create_access_token(user)
    
    return Token(
        access_token=token,
        token_type="bearer",
        user=user,
        expires_at=expires_at
    )

@router.get("/me")
async def get_current_user_info(
    user = None  # Will be injected by dependency
):
    """Get current user info from token"""
    from ..services.auth_service import get_current_user
    # This endpoint requires the token to be verified by middleware
    return {"message": "Use Authorization header with Bearer token"}
