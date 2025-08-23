import { useEffect, useState } from "react";
import { Route, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/Constants";

const EditTipoDocumento = () => {
  const { id } = useParams();
  //  const [id, setId] = useState(idTipoDocumento);
  const [sintetico, setSintetico] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    document.title = "Editar Tipo de Documento - Rivendel";

    try {
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:3000/tipdocs/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setSintetico(data.sintetico);
          setDescripcion(data.descripcion);
        } else {
          const msg = await response.json();
          setError(msg.code + ": " + msg.message);
        }
      };
      fetchData();
    } catch (error) {
      setError("Error de conexión: " + error.message);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/tipdocs/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sintetico, descripcion }),
        }
      );
      if (response.ok) {
        showNotification(
          "El tipo de documento " + sintetico + " se actualizó correctamente.",
          "success"
        );
        navigate("/tipos-documentos");
      } else {
        const msg = await response.json();
        setError(msg.message);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    }
  };

  return (
    <div className="container col-md-6 text-justify-center">
      <h2>Nuevo Tipo de Documento</h2>
      {error && (
        <span className="text-danger bg-body-secondary rounded-2 border border-danger mb-2 d-block text-center">
          {error}
        </span>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="sintetico" className="form-label">
            Sintético
          </label>
          <input
            id="sintetico"
            className="form-control"
            type="text"
            value={sintetico}
            onChange={(e) => setSintetico(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <input
            id="descripcion"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">
            Grabar
          </button>
          <Link to="/tipos-documentos" className="btn btn-outline-primary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditTipoDocumento;
