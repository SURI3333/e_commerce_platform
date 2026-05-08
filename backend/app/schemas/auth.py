from pydantic import BaseModel, EmailStr, field_validator

class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    role: str  # admin|vendor|customer
    
    
    @field_validator("password")
    @classmethod
    def password_length(cls, v: str):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 characters")
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str