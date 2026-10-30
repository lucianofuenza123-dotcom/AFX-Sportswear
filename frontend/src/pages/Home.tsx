
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const banners = [
  {
    image: "/images/banner-entrenamiento.png",
    eyebrow: "AFX SPORTSWEAR",
    title: "SUPERÁ TUS LÍMITES.",
    description:
      "Equipamiento deportivo para entrenar, competir y dar lo mejor de vos.",
  },
  {
    image: "/images/banner-futbol.png",
    eyebrow: "PASIÓN POR EL DEPORTE",
    title: "ENTRENÁ CON ACTITUD.",
    description:
      "Encontrá el equipamiento ideal para cada desafío.",
  },
  {
    image: "/images/banner-tercero.png",
    eyebrow: "AFX SPORTSWEAR",
    title: "MARCÁ TU PROPIO RITMO",
    description:
      "Diseñado para acompañarte en cada disciplina, cada entrenamiento y cada movimiento.",
  },
];

function Home() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((current) => (current + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function previousBanner() {
    setCurrentBanner(
      (current) => (current - 1 + banners.length) % banners.length
    );
  }

  function nextBanner() {
    setCurrentBanner((current) => (current + 1) % banners.length);
  }

  const banner = banners[currentBanner];

  return (
    <main className="home">
      <section className="home__carousel">
        <img
          key={banner.image}
          className="home__carousel-image"
          src={banner.image}
          alt="Campaña deportiva AFX Sportswear"
        />

        <div className="home__carousel-overlay" />

        <div className="home__carousel-content">
          <p className="home__eyebrow">{banner.eyebrow}</p>

          <h1 className="home__banner-title" key={banner.title}>
            {banner.title}
          </h1>

          <p className="home__description">
            {banner.description}
          </p>

          <button
            className="home__hero-button"
            onClick={() => navigate("/productos")}
          >
            EXPLORAR COLECCIÓN
          </button>
        </div>

        <button
          className="home__carousel-arrow home__carousel-arrow--left"
          onClick={previousBanner}
          aria-label="Banner anterior"
        >
          &#10094;
        </button>

        <button
          className="home__carousel-arrow home__carousel-arrow--right"
          onClick={nextBanner}
          aria-label="Banner siguiente"
        >
          &#10095;
        </button>

        <div className="home__carousel-dots">
          {banners.map((item, index) => (
            <button
              key={item.image}
              className={`home__carousel-dot ${
                currentBanner === index
                  ? "home__carousel-dot--active"
                  : ""
              }`}
              onClick={() => setCurrentBanner(index)}
              aria-label={`Ir al banner ${index + 1}`}
              aria-current={currentBanner === index ? "true" : undefined}
            />
          ))}
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
