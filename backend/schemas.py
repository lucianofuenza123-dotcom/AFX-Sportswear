
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1)
    category: str
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    description: str | None = None
    image: str | None = None
    images: list[str] = Field(default_factory=list)
    sizes: list[str] = Field(default_factory=list)


class ProductResponse(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    size: str = Field(..., min_length=1)


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderResponse(BaseModel):
    id: int
    created_at: datetime
    total: float
    items: list[dict]

    model_config = ConfigDict(from_attributes=True)


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
