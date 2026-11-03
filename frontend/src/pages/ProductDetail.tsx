
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { getProductRating, getProductReviews } from "../data/reviews";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

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

  // Galería de imágenes
  const productImages = product.images?.length
    ? product.images
    : [product.image];

  const activeImage = productImages.includes(selectedImage)
    ? selectedImage
    : productImages[0];

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

  const rating = getProductRating(product.id);
  const productReviews = getProductReviews(product.id);

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
        {/* Galería de imágenes */}
        <div className="product-detail__gallery">
          <div className="product-detail__image-container">
            <img src={activeImage} alt={product.name} />
          </div>

          {productImages.length > 1 && (
            <div className="product-detail__thumbnails">
              {productImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`product-detail__thumbnail ${
                    activeImage === image ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Ver fotografía ${index + 1}`}
                  aria-pressed={activeImage === image}
                >
                  <img
                    src={image}
                    alt={`${product.name} - foto ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="product-detail__info">
          <p className="home__eyebrow">AFX SPORTSWEAR</p>
          <p className="product-detail__category">{product.category}</p>

          <h1>{product.name}</h1>

          {rating.count > 0 && (
            <a className="product-detail__rating-link" href="#product-reviews">
              <span className="product-rating__stars">
                {"★".repeat(Math.round(rating.average))}
                {"☆".repeat(5 - Math.round(rating.average))}
              </span>
              <strong>{rating.average.toFixed(1)}/5</strong>
              <span>({rating.count} opiniones)</span>
            </a>
          )}

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

      {/* Opiniones de compradores */}
      <section className="product-reviews" id="product-reviews">
        <div className="product-reviews__header">
          <div>
            <p className="home__eyebrow">EXPERIENCIAS AFX</p>
            <h2>Opiniones de compradores</h2>
          </div>

          {rating.count > 0 && (
            <div className="product-reviews__summary">
              <strong>{rating.average.toFixed(1)}</strong>
              <span className="product-rating__stars">
                {"★".repeat(Math.round(rating.average))}
                {"☆".repeat(5 - Math.round(rating.average))}
              </span>
              <span>{rating.count} opiniones</span>
            </div>
          )}
        </div>

        <p className="product-reviews__demo">
          Las siguientes opiniones son datos de demostración.
        </p>

        {productReviews.length > 0 ? (
          <div className="product-reviews__list">
            {productReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card__top">
                  <div>
                    <h3>{review.title}</h3>
                    <p className="review-card__customer">
                      {review.customerName} · Comprador
                    </p>
                  </div>

                  <span
                    className="product-rating__stars"
                    aria-label={`${review.rating} de 5 estrellas`}
                  >
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="review-card__comment">{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>Todavía no hay opiniones para este producto.</p>
        )}
      </section>
    </main>
  );
}

export default ProductDetail;
