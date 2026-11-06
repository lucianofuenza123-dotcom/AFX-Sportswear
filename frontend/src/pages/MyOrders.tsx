import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ApiError,
  formatOrderDate,
  getMyOrders,
  type OrderRecord,
} from "../services/adminApi";
import "./Orders.css";

export default function MyOrders() {
  const { user, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    getMyOrders()
      .then(setOrders)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setError(err instanceof Error ? err.message : "Ocurrió un error");
      })
      .finally(() => setLoading(false));
  }, [user, logout]);

  if (authLoading) return <main className="orders-page">Cargando...</main>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="orders-page">
      <h1>Mis pedidos</h1>

      {error && <p role="alert">{error}</p>}
      {loading && <p>Cargando pedidos...</p>}

      {!loading && !error && orders.length === 0 && (
        <p>
          Todavía no hiciste ningún pedido.{" "}
          <Link to="/productos">Ver productos</Link>
        </p>
      )}

      {orders.map((order) => (
        <article key={order.id} className="order-card">
          <div className="order-card__head">
            <strong>Pedido #{order.id}</strong>
            <span>{formatOrderDate(order.created_at)}</span>
          </div>

          <ul>
            {order.items.map((item, index) => (
              <li key={`${item.product_id}-${item.size}-${index}`}>
                <span>
                  {item.quantity} x {item.name} (talle {item.size})
                </span>
                <span>${item.subtotal.toLocaleString("es-AR")}</span>
              </li>
            ))}
          </ul>

          <p className="order-card__total">
            Total: ${order.total.toLocaleString("es-AR")}
          </p>
        </article>
      ))}
    </main>
  );
}