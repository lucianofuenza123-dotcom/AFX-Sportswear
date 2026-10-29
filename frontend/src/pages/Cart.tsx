
import { useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

export default function Cart() {
  const {
    items,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [orderCompleted, setOrderCompleted] = useState(false);

  const finishOrder = () => {
    if (items.length === 0) return;

    clearCart();
    setOrderCompleted(true);
  };

  if (orderCompleted) {
    return (
      <section className="cart-page">
        <div className="cart-message">
          <h1>¡Pedido realizado con éxito!</h1>
          <p>
            Gracias por elegir AFX Sportswear. Tu compra fue simulada
            correctamente.
          </p>
          <button
            type="button"
            onClick={() => setOrderCompleted(false)}
          >
            Volver al carrito
          </button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <h1>Tu carrito</h1>
        <p>Tu carrito está vacío.</p>
        <p>Explorá nuestros productos y encontrá tu próximo equipamiento.</p>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h1>Tu carrito</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem
              key={`${item.product.id}-${item.size}`}
              item={item}
            />
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Resumen del pedido</h2>

          <p>
            Unidades totales: <strong>{totalItems}</strong>
          </p>

          <p>
            Total:{" "}
            <strong>${totalPrice.toLocaleString("es-AR")}</strong>
          </p>

          <button type="button" onClick={clearCart}>
            Vaciar carrito
          </button>

          <button type="button" onClick={finishOrder}>
            Finalizar pedido
          </button>
        </aside>
      </div>
    </section>
  );
}
