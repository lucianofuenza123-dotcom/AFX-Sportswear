
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import type { Category } from "../types";

const categories: { label: string; value: Category | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Camisetas", value: "camisetas" },
  { label: "Shorts", value: "shorts" },
  { label: "Pantalones", value: "pantalones" },
  { label: "Camperas", value: "camperas" },
  { label: "Conjuntos", value: "conjuntos" },
  { label: "Calzado", value: "calzado" },
  { label: "Accesorios", value: "accesorios" },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("categoria") ?? "todos";

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "todos") {
      return products;
    }

    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [selectedCategory]);

  function selectCategory(category: string) {
    if (category === "todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: category });
    }
  }

  return (
    <main className="catalog-page">
      <header className="catalog-page__header">
        <p className="home__eyebrow">AFX SPORTSWEAR</p>
        <h1>Nuestros productos</h1>
        <p>Encontrá tu próximo equipamiento deportivo.</p>
      </header>

      <nav className="catalog-filters" aria-label="Filtrar por categoría">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`catalog-filters__button ${
              selectedCategory === category.value
                ? "catalog-filters__button--active"
                : ""
            }`}
            onClick={() => selectCategory(category.value)}
            aria-pressed={selectedCategory === category.value}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <section className="catalog-page__content">
        <p className="catalog-page__count">
          {filteredProducts.length} productos encontrados
        </p>

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(productId) =>
                  window.location.assign(`/productos/${productId}`)
                }
              />
            ))}
          </div>
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </section>
    </main>
  );
}

export default Products;
