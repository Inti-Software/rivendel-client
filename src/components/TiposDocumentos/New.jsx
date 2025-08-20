import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const NewTipoDocumento = () => {
  const [sintetico, setSintetico] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/tipdocs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sintetico, descripcion }),
      });
      if (response.ok) {
        let s = sintetico;
        setSintetico("");
        setDescripcion("");
        setTimeout(() => navigate("/tiposdocumentos"), 
            { state: { mensaje: "El tipo de documento " + s + " se creó correctamente." } });
      } else {
        const msg = await response.json();
        console.log(msg);
        setError(msg.code + ": " + msg.message);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    }
  };

  return (
    <div className="container col-md-6 text-justify-center">
      <h2>Nuevo Tipo de Documento</h2>
      {error && <span className="text-danger bg-body-secondary rounded-2 border border-danger mb-2 d-block text-center">{error}</span>}
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
