
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const selectedCategory = searchParams.get("categoria") ?? "todos";

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("es");

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "todos" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name.toLocaleLowerCase("es").includes(normalizedSearch) ||
        product.description.toLocaleLowerCase("es").includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

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

      <div className="catalog-search">
        <label htmlFor="product-search">Buscar productos</label>

        <div className="catalog-search__input-wrapper">
          <input
            id="product-search"
            type="search"
            placeholder="Ej.: camiseta, mochila, running..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Limpiar búsqueda"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

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
        <p className="catalog-page__count" aria-live="polite">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "producto encontrado"
            : "productos encontrados"}
        </p>

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(productId) =>
                  navigate(`/productos/${productId}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h2>No encontramos productos</h2>
            <p>
              Probá con otro nombre o seleccioná una categoría diferente.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSearchParams({});
              }}
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;
