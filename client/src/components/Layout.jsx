import PropTypes from 'prop-types';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorState from './ErrorState';

const LOGO_URL = 'https://i.postimg.cc/xTKKv8pb/Layout-trama-png.png';

const Layout = ({
  children,
  editorias,
  editoriasLoading,
  editoriasError,
  onReloadEditorias,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const getNavLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-container">
          <Link className="brand" to="/">
            <img src={LOGO_URL} alt="TRAMA" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-name">TRAMA</span>
              <span className="brand-subtitle">Cinema &amp; Comunicação</span>
            </div>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen((state) => !state)}
            aria-expanded={menuOpen}
            aria-controls="principal-navigation"
          >
            Menu
          </button>
          
          <nav
            id="principal-navigation"
            aria-label="Navegação principal"
            className={`site-nav${menuOpen ? ' is-open' : ''}`}
          >
            <ul>
              <li>
                <NavLink className={getNavLinkClass} end to="/">
                  Início
                </NavLink>
              </li>
              {editoriasLoading ? (
                <li className="nav-status">Carregando...</li>
              ) : null}
              {!editoriasLoading && editorias?.length > 0
                ? editorias.map((editoria) => (
                    <li key={editoria._id || editoria.slug}>
                      <NavLink className={getNavLinkClass} to={`/editorias/${editoria.slug}`}>
                        {editoria.title}
                      </NavLink>
                    </li>
                  ))
                : null}
              {editoriasError ? (
                <li className="nav-error">
                  <ErrorState
                    compact
                    title="Erro ao carregar."
                    error={editoriasError}
                    onRetry={onReloadEditorias}
                  />
                </li>
              ) : null}
              <li>
                <NavLink className={getNavLinkClass} to="/quem-somos">
                  Quem Somos
                </NavLink>
              </li>
            </ul>
          </nav>
          
          {/* Botão Acessar adicionado aqui */}
          <div className="header-actions">
            <a href="/acesso/admin" className="secondary-button" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>
              Acessar
            </a>
          </div>

        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="container footer-content">
          {/* Links das editorias no rodapé */}
          {editorias && editorias.length > 0 && (
            <nav className="footer-nav" aria-label="Editorias">
              <ul className="footer-nav-list">
                {editorias.map(e => (
                  <li key={e._id}>
                    <Link to={`/editorias/${e.slug}`}>{e.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <p>
            © {new Date().getFullYear()} TRAMA RP — Um coletivo universitário apaixonado por cinema, comunicação e roleplay.
          </p>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  editorias: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  editoriasLoading: PropTypes.bool,
  editoriasError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onReloadEditorias: PropTypes.func,
};

Layout.defaultProps = {
  editorias: [],
  editoriasLoading: false,
  editoriasError: undefined,
  onReloadEditorias: undefined,
};

export default Layout;
