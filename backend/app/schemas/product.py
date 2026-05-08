from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: float
    stock: int
    category: str = "general"

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    stock: int | None = None
    category: str | None = None

class ProductOut(BaseModel):
    id: int
    vendor_id: int
    name: str
    description: str
    price: float
    stock: int
    category: str

    class Config:
        from_attributes = True