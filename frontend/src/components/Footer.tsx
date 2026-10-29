
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <Link to="/" className="site-footer__logo">
            AFX SPORTSWEAR
          </Link>
          <p>Equipamiento deportivo para superar tus límites.</p>
        </div>

        <div className="site-footer__links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
        </div>
      </div>

      <div className="site-footer__bottom">
        © {new Date().getFullYear()} AFX Sportswear. Proyecto académico.
      </div>
    </footer>
  );
}

export default Footer;
