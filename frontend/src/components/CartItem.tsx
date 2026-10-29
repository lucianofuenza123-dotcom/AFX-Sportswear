
import type { CartItemData } from "../context/CartContext";
import { useCart } from "../context/CartContext";

interface CartItemProps {
  item: CartItemData;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const { product, size, quantity } = item;
  const subtotal = product.price * quantity;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, size, quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, size, quantity + 1);
    }
  };

  return (
    <article className="cart-item">
      <img
        className="cart-item__image"
        src={product.image}
        alt={product.name}
      />

      <div className="cart-item__details">
        <h3>{product.name}</h3>
        <p>Categoría: {product.category}</p>
        <p>Talle: {size}</p>
        <p>Precio unitario: ${product.price.toLocaleString("es-AR")}</p>

        <div className="cart-item__quantity">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label={`Disminuir cantidad de ${product.name}`}
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            aria-label={`Aumentar cantidad de ${product.name}`}
          >
            +
          </button>
        </div>

        <p>
          Subtotal: <strong>${subtotal.toLocaleString("es-AR")}</strong>
        </p>

        <button
          type="button"
          className="cart-item__remove"
          onClick={() => removeFromCart(product.id, size)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
