import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Order
from schemas import OrderCreate

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("", status_code=201)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    try:
        # Combinamos productos repetidos en un solo ítem.
        quantities = {}
        for item in order_data.items:
            quantities[item.product_id] = (
                quantities.get(item.product_id, 0) + item.quantity
            )

        order_items = []
        total = 0

        # Primero verificamos que todos los productos existan y tengan stock.
        for product_id, quantity in quantities.items():
            product = (
                db.query(Product)
                .filter(Product.id == product_id)
                .with_for_update()
                .first()
            )

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"El producto {product_id} no existe"
                )

            if product.stock < quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Stock insuficiente para {product.name}. Disponible: {product.stock}"
                )

            subtotal = product.price * quantity
            total += subtotal

            order_items.append({
                "product_id": product.id,
                "name": product.name,
                "quantity": quantity,
                "price": product.price,
                "subtotal": subtotal
            })

        # Descontamos el stock y guardamos el pedido.
        for item in order_items:
            product = db.query(Product).filter(
                Product.id == item["product_id"]
            ).first()
            product.stock -= item["quantity"]

        new_order = Order(
            total=total,
            items_json=json.dumps(order_items, ensure_ascii=False)
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        return {
            "id": new_order.id,
            "created_at": new_order.created_at,
            "total": new_order.total,
            "items": order_items
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No se pudo crear el pedido"
        )


@router.get("")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.id.desc()).all()

    return [
        {
            "id": order.id,
            "created_at": order.created_at,
            "total": order.total,
            "items": json.loads(order.items_json)
        }
        for order in orders
    ]
