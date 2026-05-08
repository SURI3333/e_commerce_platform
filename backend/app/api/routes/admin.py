from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_roles
from app.models.user import User
from app.models.product import Product
from app.schemas.admin import VendorOut, VendorApproveIn

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/vendors", response_model=list[VendorOut])
def vendors(db: Session = Depends(get_db), user: User = Depends(require_roles("admin"))):
    return db.query(User).filter(User.role == "vendor").order_by(User.id.desc()).all()

@router.patch("/vendors/{vendor_id}", response_model=VendorOut)
def approve(vendor_id: int, data: VendorApproveIn,
            db: Session = Depends(get_db), user: User = Depends(require_roles("admin"))):
    v = db.get(User, vendor_id)
    if not v or v.role != "vendor":
        return None
    v.is_approved = data.is_approved
    db.commit()
    db.refresh(v)
    return v

@router.get("/products")
def all_products(db: Session = Depends(get_db), user: User = Depends(require_roles("admin"))):
    return db.query(Product).order_by(Product.id.desc()).all()