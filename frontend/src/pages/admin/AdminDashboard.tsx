import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProducts } from "../../services/api";
import {
  ApiError,
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "../../services/adminApi";
import type { Category, Product } from "../../types";
import "./Admin.css";

const CATEGORIES: Category[] = [
  "camisetas",
  "shorts",
  "pantalones",
  "camperas",
  "conjuntos",
  "calzado",
  "accesorios",
];

interface FormState {
  name: string;
  category: Category;
  price: string;
  stock: string;
  description: string;
  image: string;
  images: string;
  sizes: string;
}

function toForm(p?: Product): FormState {
  return {
    name: p?.name ?? "",
    category: p?.category ?? "camisetas",
    price: p ? String(p.price) : "",
    stock: p ? String(p.stock) : "0",
    description: p?.description ?? "",
    image: p?.image ?? "",
    images: (p?.images ?? []).join("\n"),
    sizes: (p?.sizes ?? []).join(", "),
  };
}

function toInput(f: FormState): ProductInput {
  return {
    name: f.name.trim(),
    category: f.category,
    price: Number(f.price),
    stock: Number(f.stock),
    description: f.description.trim(),
    image: f.image.trim(),
    images: f.images.split("\n").map((s) => s.trim()).filter(Boolean),
    sizes: f.sizes.split(",").map((s) => s.trim()).filter(Boolean),
  };
}

interface ProductFormProps {
  initial?: Product;
  onSave: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}

function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(toForm(initial));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(toInput(form));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal">
      <form className="admin-card admin-form" onSubmit={handleSubmit}>
        <h2>{initial ? "Editar producto" : "Nuevo producto"}</h2>

        <label>
          Nombre
          <input value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </label>

        <label>
          Categoría
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <div className="admin-row">
          <label>
            Precio
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Descripción
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>

        <label>
          Imagen principal (URL o ruta)
          <input value={form.image} onChange={(e) => set("image", e.target.value)} />
        </label>

        <label>
          Imágenes extra (una por línea)
          <textarea
            rows={3}
            value={form.images}
            onChange={(e) => set("images", e.target.value)}
          />
        </label>

        <label>
          Talles (separados por coma)
          <input
            placeholder="S, M, L, XL"
            value={form.sizes}
            onChange={(e) => set("sizes", e.target.value)}
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const { user: admin, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    },
    [logout]
  );

  const load = useCallback(async () => {
    try {
      setProducts(await getProducts());
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(input: ProductInput) {
    try {
      if (editing === "new") await createProduct(input);
      else if (editing) await updateProduct(editing.id, input);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout();
      throw err;
    }
    setEditing(null);
    await load();
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setError("");
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Panel AFX Sportswear</h1>
          <small>{admin?.name}</small>
        </div>
        <div className="admin-actions">
          <Link to="/admin/pedidos" className="admin-btn admin-btn-outline">Pedidos</Link>
          <Link to="/" className="admin-btn admin-btn-outline">Ver tienda</Link>
          <button className="admin-btn" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <div className="admin-toolbar">
        <h2>Productos ({products.length})</h2>
        <button className="admin-btn" onClick={() => setEditing("new")}>
          + Agregar producto
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-loading">Cargando...</p>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.image && <img src={p.image} alt={p.name} />}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toLocaleString("es-AR")}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn admin-btn-outline"
                        onClick={() => setEditing(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(p)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ProductForm
          initial={editing === "new" ? undefined : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}