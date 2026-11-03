export type Category =
  | "camisetas"
  | "shorts"
  | "pantalones"
  | "camperas"
  | "conjuntos"
  | "calzado"
  | "accesorios";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image: string;
  images?: string[];
  sizes: string[];
}

export interface Review {
  id: number;
  productId: number;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
}