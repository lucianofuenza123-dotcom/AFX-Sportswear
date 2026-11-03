from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1)
    category: str
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    description: str | None = None
    image: str | None = None
    images: list[str] = []
    sizes: list[str] = []


class ProductResponse(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderResponse(BaseModel):
    id: int
    created_at: datetime
    total: float
    items: list[dict]

    model_config = ConfigDict(from_attributes=True)
