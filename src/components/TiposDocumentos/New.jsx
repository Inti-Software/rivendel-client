import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/Constants";

const NewTipoDocumento = () => {
  const [sintetico, setSintetico] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    document.title = "Nuevo Tipo de Documento - Rivendel";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/tipdocs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sintetico, descripcion }),
      });
      if (response.ok) {
        setSintetico("");
        setDescripcion("");
        showNotification("El tipo de documento " + sintetico + " se creó correctamente.", "success");
        navigate("/tipos-documentos");
      } else {
        const body = await response.json();
        setError(body.message);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    }
  };

  const displayError = (errors) => {
    if (!errors) return null;
    return (
      <div className="card border-danger p-2 m-md-4">
        <ul className="mb-0">
          { errors.map((err, index) => <li key={index} className="text-danger">{err}</li>) }
        </ul>
      </div>
    );
  };

  return (
    <div className="container col-md-6 text-justify-center">
      <h2>Nuevo Tipo de Documento</h2>
      {displayError(error)}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="sintetico" className="form-label">Sintético</label>
          <input id="sintetico" className="form-control" type="text" value={sintetico} onChange={(e) => setSintetico(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <input id="descripcion" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className="mb-3">
            <button type="submit" className="btn btn-primary me-2">Grabar</button>
            <Link to="/tipos-documentos" className="btn btn-outline-primary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default NewTipoDocumento;
