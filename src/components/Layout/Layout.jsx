import { Link } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-primary bg-body-tertiary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Conciliaciones
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
          <ul className="navbar-nav justify-content-end">
            <li className="nav-item">
              <Link className="nav-link active" to="/tiposdocumentos">
                Tipos de documentos
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container py-4">{children}</main>

      <footer className="bg-light text-center py-3 mt-auto footer">
        <p className="text-center text-body-secondary">© 2025 Inti Software</p>
      </footer>
    </>
  );
}

export default Layout;
