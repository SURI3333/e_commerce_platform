from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.order import Order, OrderStatus

def simulate_group_payment(db: Session, group_id: str, success: bool):
    orders = db.query(Order).filter(Order.group_id == group_id).all()
    if not orders:
        raise HTTPException(404, "Group not found")

    if success:
        for o in orders:
            o.status = OrderStatus.PAID.value
            o.paid_at = datetime.now(timezone.utc)
    else:
        # remain pending (or could mark failed if you add that state)
        for o in orders:
            o.status = OrderStatus.PENDING.value

    db.commit()
    return {"group_id": group_id, "success": success, "order_count": len(orders)}