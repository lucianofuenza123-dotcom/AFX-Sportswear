
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../types";

// Un artículo del carrito es un producto con un talle y una cantidad.
export interface CartItemData {
  product: Product;
  size: string;
  quantity: number;
}

// Funciones y datos que el contexto compartirá con la aplicación.
interface CartContextType {
  items: CartItemData[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (
    productId: number,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItemData[]>([]);

  // Agrega un artículo o suma su cantidad si ya existe con el mismo talle.
  const addToCart = (
    product: Product,
    size: string,
    quantity: number
  ) => {
    if (!Number.isInteger(quantity) || quantity <= 0) return;
    if (!product.sizes.includes(size)) return;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id && item.size === size
      );

      const currentQuantity = existingItem?.quantity ?? 0;
      const newQuantity = currentQuantity + quantity;

      // No permitir superar el stock disponible.
      if (newQuantity > product.stock) return currentItems;

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...currentItems, { product, size, quantity }];
    });
  };

  // Elimina una variante específica del producto.
  const removeFromCart = (productId: number, size: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(item.product.id === productId && item.size === size)
      )
    );
  };

  // Actualiza la cantidad de una variante sin superar el stock.
  const updateQuantity = (
    productId: number,
    size: string,
    quantity: number
  ) => {
    if (!Number.isInteger(quantity) || quantity <= 0) return;

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id !== productId || item.size !== size) {
          return item;
        }

        if (quantity > item.product.stock) return item;

        return { ...item, quantity };
      })
    );
  };

  // Vacía todos los artículos.
  const clearCart = () => {
    setItems([]);
  };

  // Suma las unidades de todos los artículos.
  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calcula el precio total.
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Permite utilizar el carrito desde cualquier componente.
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider");
  }

  return context;
}

