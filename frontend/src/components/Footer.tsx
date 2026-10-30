
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="site-footer__inner">

        {/* MARCA */}
        <div className="footer-brand">
          <Link to="/" className="site-footer__logo">
            AFX SPORTSWEAR
          </Link>

          <p>
            Equipamiento deportivo para superar tus límites.
          </p>

          <p className="footer-brand__phrase">
            VISTE CON ESTILO Y COMIDAD.
          </p>
        </div>

        {/* NAVEGACIÓN */}
        <div className="footer-column">
          <h3>NAVEGACIÓN</h3>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/favoritos">Favoritos</Link>
          <Link to="/cart">Carrito</Link>
        </div>

        {/* AYUDA */}
        <div className="footer-column">
          <h3>AYUDA</h3>
          <a href="mailto:contacto@afx.com">Contacto</a>
          <a href="mailto:contacto@afx.com?subject=Consulta%20sobre%20envios">
            Información de envíos
          </a>
          <a href="mailto:contacto@afx.com?subject=Cambios%20y%20devoluciones">
            Cambios y devoluciones
          </a>
        </div>

        {/* REDES SOCIALES */}
        <div className="footer-column">
          <h3>SEGUINOS</h3>

          <div className="footer-socials">

            <a
              href="https://www.instagram.com/matiias.aveldano/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Matias"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.instagram.com/Luciano_fuenzalida/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Luciano"
            >
              <FaInstagram />
            </a>

          </div>
        </div>

      </div>

      {/* PAGOS Y ENVIOS */}
      <div className="footer-extra">

        <div className="footer-payment">
          <h3>MÉTODOS DE PAGO</h3>

          <div className="footer-payment__items">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>Mercado Pago</span>
            <span>Transferencia</span>
          </div>

        </div>

        <div className="footer-shipping">
          <h3>ENVÍOS</h3>
          <p>Información sobre entregas</p>
          <p>Consultas sobre disponibilidad</p>
          <p>Seguimiento de pedidos</p>
          <p>Cambios y devoluciones</p>
        </div>

      </div>

      {/* PIE FINAL */}
      <div className="site-footer__bottom">
        <span>
          © {new Date().getFullYear()} AFX Sportswear. Todos los derechos reservados.
        </span>

        <span>Proyecto académico</span>
      </div>

    </footer>
  );
}

export default Footer;
