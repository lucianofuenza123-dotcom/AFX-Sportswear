import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedAdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p className="admin-loading">Verificando sesión...</p>;

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/admin/login" replace />;
}