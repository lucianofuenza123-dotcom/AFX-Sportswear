
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import type { Product, Category } from "../types";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [availability, setAvailability] = useState("todos");

  const navigate = useNavigate();
  const selectedCategory = searchParams.get("categoria") ?? "todos";

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (active) {
          setProducts(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los productos"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const availableSizes = useMemo(() => {
    return [...new Set(products.flatMap((product) => product.sizes))].sort(
      (a, b) => a.localeCompare(b, "es", { numeric: true })
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("es");
    const minimum = minPrice === "" ? null : Number(minPrice);
    const maximum = maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "todos" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name.toLocaleLowerCase("es").includes(normalizedSearch) ||
        product.description.toLocaleLowerCase("es").includes(normalizedSearch);

      const matchesMinPrice =
        minimum === null || product.price >= minimum;

      const matchesMaxPrice =
        maximum === null || product.price <= maximum;

      const matchesSize =
        selectedSize === "" || product.sizes.includes(selectedSize);

      const matchesAvailability =
        availability === "todos" ||
        (availability === "disponibles" && product.stock > 0) ||
        (availability === "agotados" && product.stock === 0);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesSize &&
        matchesAvailability
      );
    });
  }, [
    products,
    selectedCategory,
    searchTerm,
    minPrice,
    maxPrice,
    selectedSize,
    availability,
  ]);

  function selectCategory(category: string) {
    if (category === "todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: category });
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedSize("");
    setAvailability("todos");
    setSearchParams({});
  }

  const activeFiltersCount = [
    searchTerm !== "",
    minPrice !== "",
    maxPrice !== "",
    selectedSize !== "",
    availability !== "todos",
    selectedCategory !== "todos",
  ].filter(Boolean).length;

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
            type="button"
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

      <section className="advanced-filters" aria-label="Filtros avanzados">
        <div className="advanced-filters__header">
          <div>
            <p className="home__eyebrow">PERSONALIZÁ TU BÚSQUEDA</p>
            <h2>Filtros avanzados</h2>
          </div>

          <button
            type="button"
            className="advanced-filters__clear"
            onClick={clearFilters}
            disabled={activeFiltersCount === 0}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="advanced-filters__grid">
          <div className="advanced-filters__field">
            <label htmlFor="min-price">Precio mínimo</label>
            <input
              id="min-price"
              type="number"
              min="0"
              placeholder="Desde $"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </div>

          <div className="advanced-filters__field">
            <label htmlFor="max-price">Precio máximo</label>
            <input
              id="max-price"
              type="number"
              min="0"
              placeholder="Hasta $"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </div>

          <div className="advanced-filters__field">
            <label htmlFor="size-filter">Talle</label>
            <select
              id="size-filter"
              value={selectedSize}
              onChange={(event) => setSelectedSize(event.target.value)}
            >
              <option value="">Todos los talles</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="advanced-filters__field">
            <label htmlFor="availability-filter">Disponibilidad</label>
            <select
              id="availability-filter"
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
            >
              <option value="todos">Todos los productos</option>
              <option value="disponibles">Con stock</option>
              <option value="agotados">Sin stock</option>
            </select>
          </div>
        </div>

        <p className="advanced-filters__active">
          {activeFiltersCount}{" "}
          {activeFiltersCount === 1 ? "filtro aplicado" : "filtros aplicados"}
        </p>
      </section>

      <section className="catalog-page__content">
        {loading ? (
          <p role="status">Cargando productos...</p>
        ) : error ? (
          <div role="alert" className="catalog-empty">
            <h2>No pudimos cargar los productos</h2>
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        ) : (
          <>
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
                  Probá modificando los filtros o realizando otra búsqueda.
                </p>
                <button type="button" onClick={clearFilters}>
                  Ver todos los productos
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default Products;
