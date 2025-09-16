import { Link } from "react-router-dom";

const FormFields = ({descripcion, setDescripcion, detalle, setDetalle}) => {
    return (
        <>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <input id="descripcion" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="detalle" className="form-label">Detalle</label>
            <textarea id="detalle" className="form-control" type="memo" value={detalle} onChange={(e) => setDetalle(e.target.value)} required rows={7} />
          </div>
          <div className="mb-3">
              <button type="submit" className="btn btn-primary me-2">Grabar</button>
              <Link to="/resoluciones" className="btn btn-outline-primary">Cancelar</Link>
          </div>
        </>
    );
}

export default FormFields;