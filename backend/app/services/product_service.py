from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.product import Product

def list_products(db: Session, q: str | None = None, category: str | None = None):
    query = db.query(Product)
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(Product.category == category)
    return query.order_by(Product.id.desc()).all()

def create_product(db: Session, vendor_id: int, data):
    p = Product(vendor_id=vendor_id, **data.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

def update_product(db: Session, vendor_id: int, product_id: int, data):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")
    if p.vendor_id != vendor_id:
        raise HTTPException(403, "Not your product")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p

def delete_product(db: Session, vendor_id: int, product_id: int):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")
    if p.vendor_id != vendor_id:
        raise HTTPException(403, "Not your product")
    db.delete(p)
    db.commit()