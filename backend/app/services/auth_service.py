from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token

ALLOWED_ROLES = {"admin", "vendor", "customer"}

def register(db: Session, email: str, password: str, role: str):
    role = role.lower()
    if role not in ALLOWED_ROLES:
        raise HTTPException(400, "Invalid role")
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(400, "Email already registered")

    user = User(email=email, hashed_password=hash_password(password), role=role,
                is_approved=(False if role == "vendor" else True))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token(subject=str(user.id), role=user.role)
    return token, user