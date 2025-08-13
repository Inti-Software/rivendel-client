import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-primary bg-body-tertiary" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Conciliaciones</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link className="nav-link active" to="/tiposdocumentos/list">Tipos de documentos</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">{children}</main>
      <footer className="bg-light text-center py-3 mt-auto">
        <div className="container">
          <span className="text-muted">© 2025 Rivendel</span>
        </div>
      </footer>
    </>
  );
}

export default Layout;
