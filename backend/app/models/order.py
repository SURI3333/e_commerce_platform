import enum
from sqlalchemy import ForeignKey, Integer, String, DateTime, func, Numeric, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class OrderStatus(str, enum.Enum):
    PENDING = "Pending"
    PAID = "Paid"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"

class Order(Base):
    __tablename__ = "orders"

    

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[str] = mapped_column(String(64), index=True)  # ties split orders in one checkout
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    vendor_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)  # vendor-specific order

    status: Mapped[str] = mapped_column(String(20), default=OrderStatus.PENDING.value, index=True)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0)

    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now())
    paid_at: Mapped[str | None] = mapped_column(DateTime(timezone=True), nullable=True)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2))

    order = relationship("Order", back_populates="items")
    product = relationship("Product")