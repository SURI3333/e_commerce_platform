from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_roles
from app.schemas.cart import CartAdd, CartUpdate, CartOut
from app.services.cart_service import get_cart, add_to_cart, update_cart_item, remove_cart_item
from app.models.user import User

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("", response_model=CartOut)
def read_cart(db: Session = Depends(get_db), user: User = Depends(require_roles("customer"))):
    return get_cart(db, user.id)

@router.post("")
def add(db: Session = Depends(get_db), user: User = Depends(require_roles("customer")), data: CartAdd = None):
    add_to_cart(db, user.id, data.product_id, data.quantity)
    return {"ok": "Item added to cart"}

@router.patch("/{cart_item_id}")
def update(cart_item_id: int, data: CartUpdate,
           db: Session = Depends(get_db), user: User = Depends(require_roles("customer"))):
    update_cart_item(db, user.id, cart_item_id, data.quantity)
    return {"ok": "Item updated in cart"}


@router.delete("/{cart_item_id}")
def remove_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("customer"))
):
    remove_cart_item(db, user.id, cart_item_id)
    return {"ok": "Item removed from cart"}
