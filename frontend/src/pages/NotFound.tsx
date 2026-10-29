
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found">
      <p className="home__eyebrow">AFX SPORTSWEAR</p>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscás no existe o fue movida.</p>

      <Link to="/" className="not-found__button">
        Volver al inicio
      </Link>
    </main>
  );
}

export default NotFound;
