import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";
import { createOrder } from "../services/api";

export default function Cart() {
  const {
    items,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const { user, loading: authLoading } = useAuth();

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  const finishOrder = async () => {
    if (items.length === 0 || loading || !user) return;

    setLoading(true);
    setError("");

    try {
      const order = await createOrder(
        items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size,
        }))
      );

      setOrderId(order.id);
      clearCart();
      setOrderCompleted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al realizar el pedido"
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderCompleted) {
    return (
      <section className="cart-page">
        <div className="cart-message">
          <h1>¡Pedido realizado con éxito!</h1>
          <p>
            Gracias por elegir AFX Sportswear.
            Tu compra fue registrada correctamente.
          </p>
          <p>Número de pedido: <strong>{orderId}</strong></p>
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
        <p>
          Explorá nuestros productos y encontrá
          tu próximo equipamiento.
        </p>
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

          {!authLoading && !user && (
            <p role="alert">
              Para finalizar tu pedido necesitás{" "}
              <Link to="/login">ingresar</Link> o{" "}
              <Link to="/registro">crear una cuenta</Link>.
            </p>
          )}

          {error && (
            <p role="alert" className="cart-error">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={clearCart}
            disabled={loading}
          >
            Vaciar carrito
          </button>

          <button
            type="button"
            onClick={finishOrder}
            disabled={loading || authLoading || !user}
          >
            {loading ? "Procesando pedido..." : "Finalizar pedido"}
          </button>
        </aside>
      </div>
    </section>
  );
}