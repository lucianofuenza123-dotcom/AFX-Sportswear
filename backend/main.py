import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, SessionLocal
from models import Product
from routers import products, orders, auth

app = FastAPI(
    title="AFX Sportswear API",
    description="API de productos y pedidos de AFX Sportswear",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(auth.router)

INITIAL_PRODUCTS = [
    {
        "id": 1, "name": "Camiseta Deportiva Pro", "category": "camisetas",
        "price": 45000, "stock": 20,
        "description": "Camiseta liviana y transpirable para entrenamientos.",
        "image": "/images/productos/camiseta-pro/camiseta-pro1.jpg",
        "images": ["/images/productos/camiseta-pro/camiseta-pro1.jpg", "/images/productos/camiseta-pro/camiseta-pro2.jpg", "/images/productos/camiseta-pro/camiseta-pro3.jpg"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 2, "name": "Camiseta de Fútbol", "category": "camisetas",
        "price": 135000, "stock": 15,
        "description": "Camiseta deportiva ideal para jugar al fútbol.",
        "image": "/images/productos/camiseta-futbol/camiseta-fut1.jpg",
        "images": ["/images/productos/camiseta-futbol/camiseta-fut1.jpg", "/images/productos/camiseta-futbol/camiseta-fut2.jpg", "/images/productos/camiseta-futbol/camiseta-fut3.jpg", "/images/productos/camiseta-futbol/camiseta-fut4.jpg"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 3, "name": "Remera de Entrenamiento", "category": "camisetas",
        "price": 22000, "stock": 25,
        "description": "Remera cómoda para entrenar todos los días.",
        "image": "/images/productos/remera-entrenamiento/remera-entrenamiento1.jpg",
        "images": ["/images/productos/remera-entrenamiento/remera-entrenamiento1.jpg", "/images/productos/remera-entrenamiento/remera-entrenamiento2.jpg", "/images/productos/remera-entrenamiento/remera-entrenamiento3.jpg"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 4, "name": "Short Deportivo", "category": "shorts",
        "price": 18000, "stock": 20,
        "description": "Short versátil para gimnasio y actividades deportivas.",
        "image": "/images/productos/short-deportivo/short-deportivo1.jpg",
        "images": ["/images/productos/short-deportivo/short-deportivo1.jpg", "/images/productos/short-deportivo/short-deportivo2.jpg", "/images/productos/short-deportivo/short-deportivo3.jpg"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 5, "name": "Pantalón Jogger", "category": "pantalones",
        "price": 40000, "stock": 12,
        "description": "Pantalón deportivo para entrenar o usar a diario.",
        "image": "/images/productos/jogger/jogger1.jpg",
        "images": ["/images/productos/jogger/jogger1.jpg", "/images/productos/jogger/jogger2.jpg", "/images/productos/jogger/jogger3.jpg"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 6, "name": "Campera Deportiva", "category": "camperas",
        "price": 65000, "stock": 10,
        "description": "Campera cómoda para entrenar al aire libre.",
        "image": "/images/productos/campera-deportiva/campera-deportiva1.jpg",
        "images": ["/images/productos/campera-deportiva/campera-deportiva1.jpg", "/images/productos/campera-deportiva/campera-deportiva2.jpg", "/images/productos/campera-deportiva/campera-deportiva3.jpg", "/images/productos/campera-deportiva/campera-deportiva4.jpg"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 7, "name": "Conjunto Deportivo", "category": "conjuntos",
        "price": 200000, "stock": 8,
        "description": "Conjunto deportivo que combina comodidad y estilo.",
        "image": "/images/productos/conjunto-deportivo/conjunto.messi1.jpg",
        "images": ["/images/productos/conjunto-deportivo/conjunto.messi1.jpg", "/images/productos/conjunto-deportivo/conjunto.messi2.jpg", "/images/productos/conjunto-deportivo/conjunto.messi3.jpg", "/images/productos/conjunto-deportivo/conjunto.messi4.jpg"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 8, "name": "Zapatillas Running", "category": "calzado",
        "price": 250000, "stock": 10,
        "description": "Calzado deportivo para correr y caminar.",
        "image": "/images/productos/zapatillas-running/zapatilla-run1.jpg",
        "images": ["/images/productos/zapatillas-running/zapatilla-run1.jpg", "/images/productos/zapatillas-running/zapatilla-run2.jpg", "/images/productos/zapatillas-running/zapatilla-run3.jpg", "/images/productos/zapatillas-running/zapatilla-run4.jpg"],
        "sizes": ["39", "40", "41", "42", "43", "44"]
    },
    {
        "id": 9, "name": "Medias Deportivas", "category": "accesorios",
        "price": 10000, "stock": 30,
        "description": "Medias cómodas para acompañar tus entrenamientos.",
        "image": "/images/productos/medias-deportivas/medias1.jpg",
        "images": ["/images/productos/medias-deportivas/medias1.jpg", "/images/productos/medias-deportivas/medias2.jpg", "/images/productos/medias-deportivas/medias3.jpg"],
        "sizes": ["Único"]
    },
    {
        "id": 10, "name": "Mochila Deportiva", "category": "accesorios",
        "price": 30000, "stock": 10,
        "description": "Mochila práctica para llevar tus elementos deportivos.",
        "image": "/images/productos/mochila-deportiva/mochila-deportiva1.jpg",
        "images": ["/images/productos/mochila-deportiva/mochila-deportiva1.jpg", "/images/productos/mochila-deportiva/mochila-deportiva2.jpg", "/images/productos/mochila-deportiva/mochila-deportiva3.jpg"],
        "sizes": ["Único"]
    }
]


@app.on_event("startup")
def seed_products():
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            for item in INITIAL_PRODUCTS:
                product = Product(
                    id=item["id"],
                    name=item["name"],
                    category=item["category"],
                    price=item["price"],
                    stock=item["stock"],
                    description=item["description"],
                    image=item["image"],
                    images=json.dumps(item["images"], ensure_ascii=False),
                    sizes=json.dumps(item["sizes"], ensure_ascii=False)
                )
                db.add(product)
            db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "AFX Sportswear API funcionando"}
