
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === Number(id));

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="product-detail__not-found">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscás no existe.</p>
        <button onClick={() => navigate("/productos")}>
          Volver al catálogo
        </button>
      </main>
    );
  }

  const formattedPrice = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  return (
    <main className="product-detail">
      <button
        className="product-detail__back"
        onClick={() => navigate("/productos")}
      >
        ← Volver a productos
      </button>

      <section className="product-detail__layout">
        <div className="product-detail__image-container">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <p className="home__eyebrow">AFX SPORTSWEAR</p>
          <p className="product-detail__category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-detail__price">{formattedPrice}</p>

          <p className="product-detail__description">
            {product.description}
          </p>

          <p className="product-detail__stock">
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Producto sin stock"}
          </p>

          <label className="product-detail__label" htmlFor="size">
            Seleccioná tu talle
          </label>

          <div className="product-detail__sizes">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`product-detail__size ${
                  selectedSize === size
                    ? "product-detail__size--selected"
                    : ""
                }`}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                disabled={product.stock === 0}
              >
                {size}
              </button>
            ))}
          </div>

          <label className="product-detail__label" htmlFor="quantity">
            Cantidad
          </label>

          <input
            id="quantity"
            className="product-detail__quantity"
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            disabled={product.stock === 0}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (Number.isInteger(value) && value >= 1) {
                setQuantity(Math.min(value, product.stock));
              }
            }}
          />

          <button
            className="product-detail__add-button"
            disabled={
              product.stock === 0 ||
              !selectedSize ||
              quantity > product.stock
            }
            onClick={() => {
              alert(
                `Seleccionaste ${quantity} unidad(es) de ${product.name}, talle ${selectedSize}.`
              );
            }}
          >
            {product.stock === 0
              ? "Sin stock"
              : "Agregar al carrito"}
          </button>

          {!selectedSize && product.stock > 0 && (
            <p className="product-detail__hint">
              Seleccioná un talle para continuar.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
