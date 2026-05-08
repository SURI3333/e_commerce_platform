from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_roles
from app.services.payment_service import simulate_group_payment
from app.models.user import User

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/simulate")
def simulate(group_id: str, success: bool,
             db: Session = Depends(get_db),
             user: User = Depends(require_roles("customer"))):
    # customer triggers simulated payment for their checkout group
    return simulate_group_payment(db, group_id, success)


# ✅ PAY ORDER → Swagger will show
@router.post("/pay/{order_id}")
def pay_order(
    order_id: int,
    success: bool = True,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("customer"))
):
    return simulate_group_payment(db, order_id, success)
