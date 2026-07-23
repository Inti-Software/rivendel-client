import "./Layout.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../auth/auth.api";
import { getUserName } from "../../auth/authState";
import { useNotification } from "../../contexts/Constants";
import { DEAL, PERSON, BOXARROWLEFT } from "../Shared/Icons";
import ReclamosPage from "../Reclamos/components/TourInicial";

const NavLink = ({relativeUrl, text, id}) => {
  const location = useLocation()
  const pn = location.pathname
  const classes = 'nav-link' + (pn.includes(relativeUrl)? ' active': '');

  return (
    <Link className={classes} to={relativeUrl} aria-current="page" id={id}>
      <span>{text}</span>      
      <span className="active"></span>
    </Link>
  );
}

function Layout({ children }) {
  const { showError } = useNotification();
  const [error, setError] = useState(false);

  useState(() => {
    if (error) {
      showError("Error al cerrar sesión. Intente nuevamente.");
      setError(false);
    }
  }, [error, showError]);

  const items = [
    { relativeUrl: '/patrocinantes', text: 'Patrocinantes', id: 'patrocinantes' },
    { relativeUrl: '/partes', text: 'Partes', id: 'partes' },
    { relativeUrl: '/reclamos', text: 'Reclamos', id: 'reclamos' }
  ]

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      window.location.href = "/";
    } catch {
      setError(true);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <span style={{ color: "#75FB4C", width: "24px" }} className="d-inline-block align-middle" ><DEAL /></span>
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
                  <NavLink relativeUrl={item.relativeUrl} text={item.text} id={item.id} />
                </li>
              )) }
              <li className="nav-item">
                <Link to={"/logout"} className="nav-link" title="Cerrar sesión" onClick={handleLogout}>
                  {BOXARROWLEFT}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">{children}</main>

      <footer className="pt-2 mt-auto footer d-flex justify-content-between align-items-center px-3">
        <div><ReclamosPage/></div>
        <p className="text-body-secondary ps-2 mb-0">© 2025 Inti Software</p>
        <p className="mb-0 text-success fw-bold">
          <span className="pe-1"><PERSON size="20px" /></span>
          <Link to={"/user/form"} title="Configurar datos" className="text-success text-decoration-none" id="username">
              {getUserName()} 
          </Link>
        </p>
      </footer>
    </>
  );
}

export default Layout;
