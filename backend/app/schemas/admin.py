from pydantic import BaseModel

class VendorOut(BaseModel):
    id: int
    email: str
    is_approved: bool

    class Config:
        from_attributes = True

class VendorApproveIn(BaseModel):
    is_approved: bool