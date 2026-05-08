from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.schemas.auth import RegisterIn, LoginIn, TokenOut
from app.services.auth_service import register, login

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register_user(data: RegisterIn, db: Session = Depends(get_db)):
    user = register(db, data.email, data.password, data.role)
    return {"id": user.id, "email": user.email, "role": user.role, "is_approved": user.is_approved}

@router.post("/login", response_model=TokenOut)
def login_user(data: LoginIn, db: Session = Depends(get_db)):
    token, user = login(db, data.email, data.password)
    return {"access_token": token, "role": user.role}