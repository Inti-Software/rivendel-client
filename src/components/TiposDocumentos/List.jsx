import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ListTiposDocumentos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [mensaje, setMensaje] = useState(location.state?.mensaje || null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/tipdocs?page=${currentPage}&limit=${recordsPerPage}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedData = await response.json();

        const totalRecords = fetchedData.totalRecords;
        setTotalPages(Math.ceil(totalRecords / recordsPerPage));

        setData(fetchedData.data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, recordsPerPage]);

  useEffect(() => {
    console.log("mensaje: " + mensaje);
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
        navigate(location.pathname, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, navigate, location.pathname]);
  
  useEffect(() => {
    console.log("Data fetched:", data);
  }, [data]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Link
          to="/tipos-documentos/new"
          className="btn btn-outline-primary mb-2"
        >
          Nuevo tipo de documento
        </Link>
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <div>{error}</div>
        </div>
      </>
    );
  }

  function getMessage(message) {
    let cssClass =
      "badge m-auto p-2 fw-normal" +
      (message ? " text-bg-information" : " text-bg-none");
    return <span className={cssClass}>{message || "."}</span>;
  }

  const deleteRecord = async (e, id) => {
    e.preventDefault();
    if (window.confirm("¿Está seguro de eliminar este tipo de documento?")) {
      try {
        const response = await fetch(`http://localhost:3000/tipdocs/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        //const result = await response.json();
        setMensaje("Tipo de documento eliminado exitosamente.");
        setData((prevData) => prevData.filter((doc) => doc.id !== id));
      } catch (error) {
        setMensaje(`Error al eliminar: ${error.message}`);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div>
        <div className="col-8 d-inline-block">
          <h1>Tipos de Documentos</h1>
        </div>
        <div className="col-4 d-inline-flex justify-content-end">
          <Link
            to="/tipos-documentos/new"
            className="btn btn-outline-primary mb-2"
          >
            Nuevo
          </Link>
        </div>
      </div>
      <div
        id="mensaje"
        className="d-flex justify-content-between align-items-center"
      >
        {getMessage(location.state?.mensaje || null)}
      </div>
      <table className="table table-striped mb-3">
        <thead>
          <tr>
            <th>Sintético</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                <span className="badge text-bg-warning fw-normal">
                  No hay datos disponibles
                </span>
              </td>
            </tr>
          ) : (
            data.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.sintetico}</td>
                <td>{doc.descripcion}</td>
                <td>
                  <Link
                    to={`/tipos-documentos/${doc.id}/edit`}
                    className="btn btn-outline-secondary btn-sm ms-2"
                  >
                    Editar
                  </Link>
                  <a
                    href={"/#"}
                    onClick={(e) => deleteRecord(e, doc.id)}
                    className="btn btn-outline-danger btn-sm ms-2"
                  >
                    Eliminar
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          {" "}
          Página {currentPage} de {totalPages}{" "}
        </span>
        <button
          className="btn btn-primary"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListTiposDocumentos;
