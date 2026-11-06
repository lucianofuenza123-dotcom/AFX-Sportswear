import type { Product } from "../types";
import { getToken } from "./adminApi";

const API_URL = "http://localhost:8000/api";

export interface OrderItemRequest {
  product_id: number;
  quantity: number;
  size: string;
}

export interface OrderResponse {
  id: number;
  created_at: string;
  total: number;
  items: {
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    size: string;
  }[];
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Error al comunicarse con el servidor");
  }

  return data as T;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  const response = await fetch(`${API_URL}/products${params}`);
  return handleResponse<Product[]>(response);
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse<Product>(response);
}

export async function createOrder(
  items: OrderItemRequest[]
): Promise<OrderResponse> {
  const token = getToken();

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ items }),
  });

  return handleResponse<OrderResponse>(response);
}