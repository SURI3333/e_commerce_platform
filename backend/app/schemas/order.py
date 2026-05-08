from pydantic import BaseModel



class CheckoutOut(BaseModel):
    group_id: str
    order_ids: list[int]
    total_amount: float

class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class OrderOut(BaseModel):
    id: int
    group_id: str
    customer_id: int
    vendor_id: int
    status: str
    total_amount: float
    items: list[OrderItemOut]

    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str  # Shipped|Delivered