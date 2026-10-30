
import type { Review } from "../types";

export const reviews: Review[] = [
  {
    id: 1,
    productId: 1,
    customerName: "Lucas M.",
    rating: 5,
    title: "Excelente calidad",
    comment: "Muy cómoda para entrenar. La tela es liviana y transpirable.",
  },
  {
    id: 2,
    productId: 1,
    customerName: "Juan P.",
    rating: 4,
    title: "Muy buen producto",
    comment: "Buena calidad y buen calce. La recomiendo.",
  },
  {
    id: 3,
    productId: 1,
    customerName: "Santiago R.",
    rating: 5,
    title: "Superó mis expectativas",
    comment: "Excelente para entrenamientos y actividades deportivas.",
  },
  {
    id: 4,
    productId: 2,
    customerName: "Martín G.",
    rating: 5,
    title: "Ideal para jugar",
    comment: "Muy cómoda y ligera. Perfecta para jugar al fútbol.",
  },
  {
    id: 5,
    productId: 2,
    customerName: "Nicolás F.",
    rating: 4,
    title: "Buena camiseta",
    comment: "Buen diseño y buena calidad de tela.",
  },
  {
    id: 6,
    productId: 3,
    customerName: "Agustín L.",
    rating: 5,
    title: "Muy cómoda",
    comment: "La uso para entrenar todos los días. Muy recomendable.",
  },
  {
    id: 7,
    productId: 4,
    customerName: "Franco D.",
    rating: 4,
    title: "Buen short",
    comment: "Cómodo para el gimnasio y para salir a correr.",
  },
  {
    id: 8,
    productId: 5,
    customerName: "Tomás B.",
    rating: 5,
    title: "Excelente calce",
    comment: "Muy cómodo y práctico para usar todos los días.",
  },
  {
    id: 9,
    productId: 6,
    customerName: "Matías C.",
    rating: 4,
    title: "Muy buena campera",
    comment: "Abriga bien y tiene un diseño excelente.",
  },
  {
    id: 10,
    productId: 7,
    customerName: "Federico A.",
    rating: 5,
    title: "Excelente conjunto",
    comment: "Muy buena calidad. Las prendas combinan perfectamente.",
  },
  {
    id: 11,
    productId: 8,
    customerName: "Diego S.",
    rating: 5,
    title: "Muy cómodas",
    comment: "Ideales para correr. Buena comodidad y estabilidad.",
  },
  {
    id: 12,
    productId: 9,
    customerName: "Bruno T.",
    rating: 4,
    title: "Buen producto",
    comment: "Cómodas y suaves. Cumplen perfectamente.",
  },
  {
    id: 13,
    productId: 10,
    customerName: "Ezequiel N.",
    rating: 5,
    title: "Muy práctica",
    comment: "Tiene buen espacio para llevar todo lo necesario.",
  },
];

export function getProductReviews(productId: number) {
  return reviews.filter((review) => review.productId === productId);
}

export function getProductRating(productId: number) {
  const productReviews = getProductReviews(productId);

  if (productReviews.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = productReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return {
    average: total / productReviews.length,
    count: productReviews.length,
  };
}
