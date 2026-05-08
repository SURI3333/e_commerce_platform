from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_roles
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut
from app.services.product_service import (
    list_products,
    create_product,
    update_product,
    delete_product,
)
from app.models.user import User

router = APIRouter(
    prefix="/products",
    tags=["Products"]   # ✅ Clean Swagger section
)

# =================================================
# 1) PUBLIC: GET ALL PRODUCTS (Browse)
# =================================================
@router.get(
    "",
    response_model=list[ProductOut],
    operation_id="get_products",
)
def get_products(
    q: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    """
    Public endpoint.
    - Browse all products
    - Optional search by name (q)
    - Optional filter by category
    """
    return list_products(db, q=q, category=category)


# =================================================
# 2) VENDOR: ADD PRODUCT
# =================================================
@router.post(
    "",
    response_model=ProductOut,
    operation_id="add_product",
)
def add_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("vendor","admin","customer")),
):
    """
    Vendor adds a new product.
    """
    return create_product(db, user.id, data)


# =================================================
# 3) VENDOR: UPDATE PRODUCT
# =================================================
@router.patch(
    "/{product_id}",
    response_model=ProductOut,
    operation_id="update_product",
)
def update_product_by_id(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("vendor","admin","customer")),
):
    """
    Vendor updates their own product.
    """
    return update_product(db, user.id, product_id, data)


# =================================================
# 4) VENDOR: DELETE PRODUCT
# =================================================


@router.delete("/{product_id}", operation_id="delete_product")
def delete_product_by_id(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("vendor","admin","customer")),
):
    """
    Vendor deletes their own product.
    """
    delete_product(db, user.id, product_id)
    return {"message": "Product deleted successfully"}