from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_roles
from app.schemas.order import CheckoutOut, OrderOut, StatusUpdate
from app.services.order_service import checkout, list_customer_orders, list_vendor_orders, update_vendor_status
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["orders"])




@router.post("/checkout")
def do_checkout(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("customer")),
):
    group_id, order_ids, total_amount = checkout(db, user.id)

    return {
        "group_id": group_id,
        "order_ids": order_ids,
        "total_amount": total_amount
    }


@router.get("/my-orders", response_model=list[OrderOut])
def get_my_orders(db: Session = Depends(get_db), user: User = Depends(require_roles("customer"))):
    return list_customer_orders(db, user.id)

@router.get("/vendor", response_model=list[OrderOut])
def vendor_orders(db: Session = Depends(get_db), user: User = Depends(require_roles("vendor"))):
    return list_vendor_orders(db, user.id)

@router.patch("/{order_id}/status", response_model=OrderOut)
def vendor_update_status(order_id: int, data: StatusUpdate,
                         db: Session = Depends(get_db), user: User = Depends(require_roles("vendor"))):
    return update_vendor_status(db, user.id, order_id, data.status)



@router.post("/place")
def place_order(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("customer"))
):
    return checkout(db, user.id)

@router.get("/my-orders", response_model=list[OrderOut])
def get_my_orders(db: Session = Depends(get_db), user: User = Depends(require_roles("customer"))):
    return list_customer_orders(db, user.id)