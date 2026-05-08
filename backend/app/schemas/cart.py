from pydantic import BaseModel

class CartAdd(BaseModel):
    product_id: int
    quantity: int = 1

class CartUpdate(BaseModel):
    quantity: int

class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    name: str
    price: float
    vendor_id: int
    stock: int

class CartOut(BaseModel):
    items: list[CartItemOut]
    subtotal: float