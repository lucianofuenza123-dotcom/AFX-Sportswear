import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { totalItems } = useCart();
  const { favoriteIds } = useFavorites();
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo">
          AFX<span>SPORTSWEAR</span>
        </Link>

        <nav className="site-header__nav" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "site-header__link active" : "site-header__link"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/productos"
            className={({ isActive }) =>
              isActive ? "site-header__link active" : "site-header__link"
            }
          >
            Productos
          </NavLink>

          <NavLink
            to="/favoritos"
            className={({ isActive }) =>
              isActive ? "site-header__link active" : "site-header__link"
            }
          >
            Favoritos ({favoriteIds.length})
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "site-header__link active" : "site-header__link"
            }
          >
            Carrito ({totalItems})
          </NavLink>

          {user && (
            <NavLink
              to="/mis-pedidos"
              className={({ isActive }) =>
                isActive ? "site-header__link active" : "site-header__link"
              }
            >
              Mis pedidos
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin" className="site-header__link">
              Panel
            </NavLink>
          )}

          {user ? (
            <button
              type="button"
              className="site-header__link site-header__link--button"
              onClick={logout}
            >
              Salir ({user.name.split(" ")[0]})
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "site-header__link active" : "site-header__link"
              }
            >
              Ingresar
            </NavLink>
          )}
        </nav>

        <Link to="/productos" className="site-header__cta">
          Comprar ahora
        </Link>
      </div>
    </header>
  );
}

export default Header;