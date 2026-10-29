
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__hero-content">
          <p className="home__eyebrow">AFX SPORTSWEAR</p>

          <h1>SUPERÁ TUS LÍMITES.</h1>

          <p className="home__description">
            Equipamiento deportivo para entrenar, competir y dar lo mejor
            de vos.
          </p>

          <button
            className="home__hero-button"
            onClick={() => navigate("/productos")}
          >
            EXPLORAR COLECCIÓN
          </button>
        </div>
      </section>

      <section className="home__catalog" id="productos">
        <div className="home__section-heading">
          <div>
            <p className="home__eyebrow">NUESTRA COLECCIÓN</p>
            <h2>Productos destacados</h2>
          </div>

          <span className="home__product-count">
            {products.length} productos
          </span>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(productId) =>
                navigate(`/productos/${productId}`)
              }
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
