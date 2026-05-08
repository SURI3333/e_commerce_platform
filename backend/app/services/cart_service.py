from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.cart import CartItem
from app.models.product import Product

def get_cart(db: Session, customer_id: int):
    items = db.query(CartItem).filter(CartItem.customer_id == customer_id).all()
    out_items = []
    subtotal = 0.0
    for ci in items:
        p = ci.product
        line = float(p.price) * ci.quantity
        subtotal += line
        out_items.append({
            "id": ci.id,
            "product_id": p.id,
            "quantity": ci.quantity,
            "name": p.name,
            "price": float(p.price),
            "vendor_id": p.vendor_id,
            "stock": p.stock
        })
    return {"items": out_items, "subtotal": round(subtotal, 2)}

def add_to_cart(db: Session, customer_id: int, product_id: int, quantity: int):
    if quantity <= 0:
        raise HTTPException(400, "Quantity must be > 0")
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")

    ci = db.query(CartItem).filter(CartItem.customer_id == customer_id, CartItem.product_id == product_id).first()
    if ci:
        ci.quantity += quantity
    else:
        ci = CartItem(customer_id=customer_id, product_id=product_id, quantity=quantity)
        db.add(ci)
    db.commit()

def update_cart_item(db: Session, customer_id: int, cart_item_id: int, quantity: int):
    ci = db.get(CartItem, cart_item_id)
    if not ci or ci.customer_id != customer_id:
        raise HTTPException(404, "Cart item not found")
    if quantity <= 0:
        db.delete(ci)
    else:
        ci.quantity = quantity
    db.commit()

def clear_cart(db: Session, customer_id: int):
    db.query(CartItem).filter(CartItem.customer_id == customer_id).delete()
    db.commit()


def remove_cart_item(db: Session, customer_id: int, cart_item_id: int):
    ci = db.get(CartItem, cart_item_id)
    if not ci or ci.customer_id != customer_id:
        raise HTTPException(404, "Cart item not found")
    db.delete(ci)
    db.commit()

def get_cart_item(db: Session, customer_id: int, cart_item_id: int):
    ci = db.get(CartItem, cart_item_id)
    if not ci or ci.customer_id != customer_id:
        raise HTTPException(404, "Cart item not found")
    return ci