import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException
from app.models.cart import CartItem
from app.models.product import Product
from app.models.order import Order, OrderItem, OrderStatus

def checkout(db: Session, customer_id: int):
    cart_items = db.query(CartItem).filter(CartItem.customer_id == customer_id).all()
    if not cart_items:
        raise HTTPException(400, "Cart is empty")

    # Group cart items by vendor_id
    by_vendor: dict[int, list[CartItem]] = {}
    for ci in cart_items:
        by_vendor.setdefault(ci.product.vendor_id, []).append(ci)

    group_id = uuid.uuid4().hex
    created_orders: list[Order] = []

    # TRANSACTION: verify & decrement stock + create orders/items atomically
    with db.begin():
        # Lock/read products; SQLite won't do SELECT FOR UPDATE strictly, but transaction still prevents partial commits
        # For Postgres, you can use .with_for_update() for strong locking.
        # We still do a "check then decrement" inside one transaction.
        for vendor_id, items in by_vendor.items():
            order = Order(group_id=group_id, customer_id=customer_id, vendor_id=vendor_id,
                          status=OrderStatus.PENDING.value, total_amount=0)
            db.add(order)
            db.flush()  # get order.id

            total = 0.0
            for ci in items:
                # Reload product inside transaction
                p = db.execute(select(Product).where(Product.id == ci.product_id)).scalar_one()
                if ci.quantity > p.stock:
                    raise HTTPException(409, f"Out of stock: {p.name} (available {p.stock})")

                # decrement stock
                p.stock -= ci.quantity

                unit_price = float(p.price)
                total += unit_price * ci.quantity

                oi = OrderItem(order_id=order.id, product_id=p.id,
                               quantity=ci.quantity, unit_price=unit_price)
                db.add(oi)

            order.total_amount = round(total, 2)
            created_orders.append(order)

        # Clear cart only if everything succeeded
        db.query(CartItem).filter(CartItem.customer_id == customer_id).delete()

    db.refresh(created_orders[0])
    total_all = sum(float(o.total_amount) for o in created_orders)
    return group_id, [o.id for o in created_orders], round(total_all, 2)

def list_customer_orders(db: Session, customer_id: int):
    return db.query(Order).filter(Order.customer_id == customer_id).order_by(Order.id.desc()).all()

def list_vendor_orders(db: Session, vendor_id: int):
    return db.query(Order).filter(Order.vendor_id == vendor_id).order_by(Order.id.desc()).all()

def update_vendor_status(db: Session, vendor_id: int, order_id: int, status: str):
    order = db.get(Order, order_id)
    if not order or order.vendor_id != vendor_id:
        raise HTTPException(404, "Order not found")
    if order.status not in (OrderStatus.PAID.value, OrderStatus.SHIPPED.value, OrderStatus.DELIVERED.value):
        raise HTTPException(400, "Invalid current state")
    if status not in (OrderStatus.SHIPPED.value, OrderStatus.DELIVERED.value):
        raise HTTPException(400, "Allowed: Shipped, Delivered")
    # basic workflow: Paid -> Shipped -> Delivered
    if status == OrderStatus.SHIPPED.value and order.status != OrderStatus.PAID.value:
        raise HTTPException(409, "Can ship only after Paid")
    if status == OrderStatus.DELIVERED.value and order.status != OrderStatus.SHIPPED.value:
        raise HTTPException(409, "Can deliver only after Shipped")

    order.status = status
    db.commit()
    db.refresh(order)
    return order