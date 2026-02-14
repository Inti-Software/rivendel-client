import { Link, useLocation } from "react-router-dom";
import "./Layout.css";
import { DEAL } from "../../utils/Icons";

const NavLink = ({relativeUrl, text}) => {
  const location = useLocation()
  const pn = location.pathname
  const classes = 'nav-link' + (pn.includes(relativeUrl)? ' active': '');

  return (
    <Link className={classes} to={relativeUrl} aria-current="page">
      <span>{text}</span>      
      <span className="active"></span>
    </Link>
  );
}

function Layout({ children }) {
  const items = [
    { relativeUrl: '/tipos-documentos', text: 'Tipos de documentos' },
    { relativeUrl: '/patrocinantes', text: 'Patrocinantes' },
    { relativeUrl: '/partes', text: 'Partes' },
    { relativeUrl: '/resoluciones', text: 'Resoluciones' },
    { relativeUrl: '/reclamos', text: 'Reclamos' }
  ]

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            {DEAL}
            <span className="ms-2">Conciliaciones</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {items.map((item, k) => (
                <li className="nav-item" key={k}>
                  <NavLink relativeUrl={item.relativeUrl} text={item.text} />
                </li>
              )) }
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">{children}</main>

      <footer className="text-center py-3 mt-auto footer">
        <p className="text-center text-body-secondary">© 2025 Inti Software</p>
      </footer>
    </>
  );
}

export default Layout;
