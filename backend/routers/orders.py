import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Order, User
from schemas import OrderCreate
from routers.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def order_to_response(order):
    return {
        "id": order.id,
        "created_at": order.created_at,
        "total": order.total,
        "items": json.loads(order.items_json)
    }


@router.post("", status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Agrupamos cantidades por producto para controlar el stock.
        quantities = {}
        for item in order_data.items:
            quantities[item.product_id] = (
                quantities.get(item.product_id, 0) + item.quantity
            )

        # Verificamos que todos los productos existan y tengan stock.
        products = {}

        for product_id, quantity in quantities.items():
            product = db.query(Product).filter(
                Product.id == product_id
            ).first()

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

            products[product_id] = product

        # Creamos el detalle conservando cada talle.
        order_items = []
        total = 0

        for item in order_data.items:
            product = products[item.product_id]

            if item.size not in json.loads(product.sizes or "[]"):
                raise HTTPException(
                    status_code=400,
                    detail=f"Talle no válido para {product.name}"
                )

            subtotal = product.price * item.quantity
            total += subtotal

            order_items.append({
                "product_id": product.id,
                "name": product.name,
                "size": item.size,
                "quantity": item.quantity,
                "price": product.price,
                "subtotal": subtotal
            })

        # Descontamos el stock.
        for product_id, quantity in quantities.items():
            products[product_id].stock -= quantity

        # Guardamos el pedido asociado al cliente.
        new_order = Order(
            user_id=current_user.id,
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


@router.get("/mine")
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.id.desc())
        .all()
    )
    return [order_to_response(order) for order in orders]


@router.get("")
def get_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    rows = (
        db.query(Order, User)
        .outerjoin(User, Order.user_id == User.id)
        .order_by(Order.id.desc())
        .all()
    )

    result = []
    for order, user in rows:
        data = order_to_response(order)
        data["customer"] = (
            {"name": user.name, "email": user.email} if user else None
        )
        result.append(data)

    return result