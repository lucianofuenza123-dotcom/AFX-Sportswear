import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ApiError,
  formatOrderDate,
  getAllOrders,
  type OrderRecord,
} from "../../services/adminApi";
import "./Admin.css";

export default function AdminOrders() {
  const { logout } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setError(err instanceof Error ? err.message : "Ocurrió un error");
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const totalSold = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Pedidos</h1>
        <div className="admin-actions">
          <Link to="/admin" className="admin-btn admin-btn-outline">
            Volver a productos
          </Link>
        </div>
      </header>

      <div className="admin-toolbar">
        <h2>
          {orders.length} pedidos · Total vendido: $
          {totalSold.toLocaleString("es-AR")}
        </h2>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-loading">Cargando...</p>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Detalle</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{formatOrderDate(o.created_at)}</td>
                  <td>
                    {o.customer
                      ? `${o.customer.name} (${o.customer.email})`
                      : "—"}
                  </td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {o.items.map((item, i) => (
                        <li key={`${item.product_id}-${item.size}-${i}`}>
                          {item.quantity} x {item.name} (talle {item.size})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${o.total.toLocaleString("es-AR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
