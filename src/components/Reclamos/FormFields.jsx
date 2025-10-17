import { Link } from "react-router-dom";
import { useState } from "react";
import SearchParteDialog from "../Partes/SearchParteDialog";

const FormFields = ({numero, setNumero, reclamantes, setReclamantes,
  reclamados, setReclamados
}) => {
    const [showSearchPartes, setShowSearchPartes] = useState(false);

    const onAcceptSearchParte = (e, parte) => {
      e.preventDefault();
      if (reclamantes.find(r => r.id === parte.id)) {
        console.log("La parte ya está agregada como reclamante.");
        return;
      }
      setReclamantes([...reclamantes, parte]);
      setShowSearchPartes(false);
    }
  
    return (
        <>
          {showSearchPartes && (
            <SearchParteDialog handleAccept={onAcceptSearchParte} 
              handleCancel={() => setShowSearchPartes(false)} />
            ) }
          <h3 className="mb-3">Formulario de Reclamo</h3>
          <div className="mb-3">
            <label htmlFor="numero" className="form-label">Número</label>
            <input id="numero" className="form-control text-end" type="number" value={numero} onChange={(e) => setNumero(e.target.value)} required />
          </div>
          <div className="mb-3">
            <div className="mb-3">
              <span className="h5 text-primary">Partes Involucradas</span>
            </div>
            <div className="mb-3">
              <table className="table table-sm text-center">
                <thead>
                  <tr>
                    <th colSpan={3} className="fw-bold text-bg-secondary rounded-top-pill">Reclamantes</th>
                  </tr>
                  <tr>
                    <th className="text-bg-secondary rounded border-1">CUIL</th>
                    <th className="text-bg-secondary rounded border-1">Nombre</th>
                    <th className="text-bg-secondary rounded border-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {reclamantes.map((p) => (
                    <tr key={p.id}>
                      <td>{p.cuil}</td>
                      <td>{p.nombre}</td>
                      <td className="text-danger" >
                        <button type="button" className="btn btn-sm btn-outline-danger"
                          onClick={() => setReclamantes(reclamantes.filter(r => r.id !== p.id))}>
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>
                      <button type="button" className="btn btn-sm btn-outline-secondary"
                        onClick={() => setShowSearchPartes(true)}>
                        Agregar Reclamante
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="reclamados" className="form-label">Reclamados</label>
            <input id="reclamados" className="form-control" type="text" value={reclamados} onChange={(e) => setReclamados(e.target.value)} />
          </div>
          <div className="mb-3">
              <button type="submit" className="btn btn-primary me-2">Grabar</button>
              <Link to="/reclamos" className="btn btn-outline-primary">Cancelar</Link>
          </div>
        </>
    );
}

export default FormFields;