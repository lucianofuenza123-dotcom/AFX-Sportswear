import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import ProductBase, ProductResponse
from routers.auth import get_admin_user

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


def save_product_data(product, data):
    product.name = data.name
    product.category = data.category.lower()
    product.price = data.price
    product.stock = data.stock
    product.description = data.description
    product.image = data.image
    product.images = json.dumps(data.images, ensure_ascii=False)
    product.sizes = json.dumps(data.sizes, ensure_ascii=False)


# CONSULTAS PÚBLICAS

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


# FUNCIONES EXCLUSIVAS PARA ADMINISTRADORES

@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    data: ProductBase,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):
    product = Product()
    save_product_data(product, data)

    db.add(product)
    db.commit()
    db.refresh(product)

    return product_to_response(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductBase,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    save_product_data(product, data)

    db.commit()
    db.refresh(product)

    return product_to_response(product)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(product)
    db.commit()

    return {"message": "Producto eliminado correctamente"}
