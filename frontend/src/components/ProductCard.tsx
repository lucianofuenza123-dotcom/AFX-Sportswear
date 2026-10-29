
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: number) => void;
}

function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
        />

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
