from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def hash_password(password: str) -> str:
    # ✅ bcrypt HARD limit = 72 bytes
    if len(password.encode("utf-8")) > 72:
        password = password[:72]   # truncate safely
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    if len(password.encode("utf-8")) > 72:
        password = password[:72]
    return pwd_context.verify(password, hashed_password)


def create_access_token(subject: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MIN)
    payload = {"sub": subject, "role": role, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])