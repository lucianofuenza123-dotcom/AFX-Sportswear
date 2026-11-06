import type { Product } from "../types";

const API_URL = "http://localhost:8000/api";
const TOKEN_KEY = "afx_token";

export type ProductInput = Omit<Product, "id">;

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail;
    throw new ApiError(
      typeof detail === "string"
        ? detail
        : "Error al comunicarse con el servidor. Revisá los datos.",
      response.status
    );
  }

  return data as T;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await request<{ access_token: string; user: AuthUser }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
  setToken(data.access_token);
  return data.user;
}

export const registerCustomer = (name: string, email: string, password: string) =>
  request<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const getMe = () => request<AuthUser>("/auth/me", {}, true);

export const createProduct = (product: ProductInput) =>
  request<Product>(
    "/products",
    { method: "POST", body: JSON.stringify(product) },
    true
  );

export const updateProduct = (id: number, product: ProductInput) =>
  request<Product>(
    `/products/${id}`,
    { method: "PUT", body: JSON.stringify(product) },
    true
  );

export const deleteProduct = (id: number) =>
  request<{ message: string }>(`/products/${id}`, { method: "DELETE" }, true);
export interface OrderRecord {
  id: number;
  created_at: string;
  total: number;
  items: {
    product_id: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  customer?: { name: string; email: string } | null;
}

export const getMyOrders = () =>
  request<OrderRecord[]>("/orders/mine", {}, true);

export const getAllOrders = () => request<OrderRecord[]>("/orders", {}, true);

// El servidor guarda la hora en UTC sin indicarlo; se convierte a hora local.
export function formatOrderDate(value: string): string {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(value);
  return new Date(hasZone ? value : `${value}Z`).toLocaleString("es-AR");
}
