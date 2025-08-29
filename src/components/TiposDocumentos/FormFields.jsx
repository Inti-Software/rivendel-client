import { Link } from "react-router-dom";

const FormFields = ({sintetico, setSintetico, descripcion, setDescripcion}) => {
    return (
        <>
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
        </>
    );
}

export default FormFields;