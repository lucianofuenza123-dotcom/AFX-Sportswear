
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const product = products.find((item) => item.id === Number(id));

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

  const currentQuantity =
    items.find(
      (item) =>
        item.product.id === product.id && item.size === selectedSize
    )?.quantity ?? 0;

  const availableStock = product.stock - currentQuantity;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setMessage("Seleccioná un talle para continuar.");
      return;
    }

    if (quantity > availableStock) {
      setMessage(
        `Solo podés agregar ${availableStock} unidad(es) más de este talle.`
      );
      return;
    }

    addToCart(product, selectedSize, quantity);
    setMessage(`${quantity} unidad(es) agregada(s) al carrito.`);
  };

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
                type="button"
                className={`product-detail__size ${
                  selectedSize === size
                    ? "product-detail__size--selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedSize(size);
                  setMessage("");
                }}
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
            max={Math.max(1, availableStock)}
            value={quantity}
            disabled={product.stock === 0}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (Number.isInteger(value) && value >= 1) {
                setQuantity(Math.min(value, Math.max(1, availableStock)));
              }

              setMessage("");
            }}
          />

          <button
            type="button"
            className="product-detail__add-button"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock === 0
              ? "Sin stock"
              : "Agregar al carrito"}
          </button>

          {message && (
            <p role="status" aria-live="polite">
              {message}
            </p>
          )}

          {items.length > 0 && (
            <p className="product-detail__cart-link-wrapper">
              <Link to="/cart" className="product-detail__cart-link">
                Ver mi carrito →
              </Link>
            </p>
          )}

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
