import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import ProductResponse

router = APIRouter(prefix="/api/products", tags=["Products"])


def product_to_response(product):
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "price": product.price,
        "stock": product.stock,
        "description": product.description,
        "image": product.image,
        "images": json.loads(product.images or "[]"),
        "sizes": json.loads(product.sizes or "[]"),
    }


@router.get("", response_model=list[ProductResponse])
def get_products(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Product)

    if category:
        query = query.filter(Product.category == category.lower())

    products = query.order_by(Product.id).all()
    return [product_to_response(product) for product in products]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return product_to_response(product)
