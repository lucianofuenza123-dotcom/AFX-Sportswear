import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const { user, login, register } = useAuth();
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isRegister ? "Crear cuenta" : "Ingresar"}</h1>

        {isRegister && (
          <label>
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              required
            />
          </label>
        )}

        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={isRegister ? 8 : undefined}
            required
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : isRegister ? "Registrarme" : "Ingresar"}
        </button>

        <p className="auth-switch">
          {isRegister ? (
            <>¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></>
          ) : (
            <>¿No tenés cuenta? <Link to="/registro">Registrate</Link></>
          )}
        </p>
      </form>
    </main>
  );
}