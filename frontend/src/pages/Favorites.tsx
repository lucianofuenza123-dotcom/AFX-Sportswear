
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
  const navigate = useNavigate();
  const { favoriteIds } = useFavorites();

  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id)
  );

  return (
    <main className="favorites-page">
      <header className="favorites-page__header">
        <p className="home__eyebrow">AFX SPORTSWEAR</p>
        <h1>Mis favoritos</h1>
        <p>Todos los productos que guardaste.</p>
      </header>

      <section className="favorites-page__content">
        {favoriteProducts.length > 0 ? (
          <>
            <p className="favorites-page__count">
              {favoriteProducts.length}{" "}
              {favoriteProducts.length === 1
                ? "producto guardado"
                : "productos guardados"}
            </p>

            <div className="products-grid">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(productId) =>
                    navigate(`/productos/${productId}`)
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="favorites-page__empty">
            <span className="favorites-page__heart">♡</span>
            <h2>Todavía no tenés favoritos</h2>
            <p>
              Explorá nuestros productos y guardá los que más te gusten.
            </p>
            <button
              type="button"
              onClick={() => navigate("/productos")}
            >
              EXPLORAR PRODUCTOS
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Favorites;
