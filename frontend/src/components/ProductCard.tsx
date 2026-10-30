
import type { Product } from "../types";
import { useFavorites } from "../context/FavoritesContext";

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: number) => void;
}

function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorite = isFavorite(product.id);

  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
        />

        <button
          type="button"
          className={`product-card__favorite ${
            favorite ? "product-card__favorite--active" : ""
          }`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={
            favorite
              ? `Quitar ${product.name} de favoritos`
              : `Agregar ${product.name} a favoritos`
          }
          aria-pressed={favorite}
        >
          {favorite ? "♥" : "♡"}
        </button>

        {product.stock === 0 && (
          <span className="product-card__badge">Sin stock</span>
        )}
      </div>

      <div className="product-card__info">
        <span className="product-card__category">
          {product.category}
        </span>

        <h3 className="product-card__name">{product.name}</h3>

        <p className="product-card__price">
          {product.price.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          })}
        </p>

        <button
          className="product-card__button"
          onClick={() => onViewDetails(product.id)}
          disabled={product.stock === 0}
        >
          Ver producto
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
