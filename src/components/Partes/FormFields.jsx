import { Link } from "react-router-dom";
import DataBindedSelect from "../Forms/DataBindedSelect";

const FormFields = ({
  nombre,
  setNombre,
  idTipoDocumento,
  setIdTipoDocumento,
  nroDocumento,
  setNroDocumento,
  cuil,
  setCuil,
  idPatrocinante,
  setIdPatrocinante,
  nroWhatsapp,
  setNroWhatsapp,
  localidad,
  setLocalidad,
  tiposDocumento}) => {

  return (
      <>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input id="nombre" className="form-control" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
            <label htmlFor="nroDocumento" className="form-label">Documento</label>
          <div className="row g-3">
            <div className="col">
              <DataBindedSelect data={tiposDocumento} selectedValue={idTipoDocumento} setSelectedValue={setIdTipoDocumento} />
            </div>
            <div className="col">
              <input id="nroDocumento" type="number" className="form-control" value={nroDocumento} onChange={(e) => setNroDocumento(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="cuil" className="form-label">CUIL</label>
          <input id="cuil" className="form-control" value={cuil} onChange={(e) => setCuil(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="nroWhatsapp" className="form-label">Nº Casillero</label>
          <input id="nroWhatsapp" type="number" className="form-control" value={nroWhatsapp} onChange={(e) => setNroWhatsapp(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="localidad" className="form-label">Localidad</label>
          <input id="localidad" className="form-control" value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
        </div>
        <div className="mb-3">
            <button type="submit" className="btn btn-primary me-2">Grabar</button>
            <Link to="/patrocinantes" className="btn btn-outline-primary">Cancelar</Link>
        </div>
      </>
  );
}

export default FormFields;