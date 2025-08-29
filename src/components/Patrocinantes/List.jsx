import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "../../contexts/Constants";
import NotificationDisplay from "../NotificationDisplay";

const ListPatrocinantes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { showSuccess, showError } = useNotification();
  const RECORDS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/patrocinantes?page=${currentPage}&limit=${RECORDS_PER_PAGE}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedData = await response.json();

        const totalRecords = fetchedData.totalRecords;
        setTotalPages(Math.ceil(totalRecords / RECORDS_PER_PAGE));

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
  }, [currentPage]);

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

  const displayError = () => {
    return (
      <div className="row" style={{ minHeight: "30px" }}>
				<div id="mensaje" className="d-flex justify-content-between align-items-center">
					<span className={`badge m-auto p-2 fw-normal text-bg-danger`}>
						{error}
					</span>
        </div>
      </div>
      );
  };

  const displayData = () => {
    return (
      <>
        <NotificationDisplay />
        <table className="table table-striped mb-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Domicilio</th>
              <th>Localidad</th>
              <th>Casillero</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center">
                  <span className="badge text-secondary bg-body-secondary rounded-2 border border-secondary">
                    No hay datos para mostrar.
                  </span>
                </td>
              </tr>
            ) : (
              data.map((pat) => (
                <tr key={pat.id}>
                  <td>{pat.nombre}</td>
                  <td className="text-center">{pat.nroMatricula}</td>
                  <td>{pat.domicilio}</td>
                  <td>{pat.localidad}</td>
                  <td className="text-center">{pat.nroCasillero}</td>
                  <td>
                    <Link
                      to={`/tipos-documentos/edit/${pat.id}`}
                      className="btn btn-outline-secondary btn-sm ms-2"
                    >
                      Editar
                    </Link>
                    <a
                      href={"/#"}
                      onClick={(e) => deleteRecord(e, pat.id)}
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
      </>
    );
  };

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
        setData((prevData) => prevData.filter((doc) => doc.id !== id));
        showSuccess("Se eliminó un tipo de documento.");
      } catch (error) {
        showError(`Error al eliminar: ${error.message}`);
      }
    }
  };

  const container = (body) => {
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
      {body}
    </div>
    );
  }

  if (error) {
    const content = displayError();
    displayError();
    return container(content);
  } else {
    return container(displayData());
  }
};

export default ListPatrocinantes;
