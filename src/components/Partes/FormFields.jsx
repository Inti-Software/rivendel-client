import { Link } from "react-router-dom";
import DataBindedSelect from "../Forms/DataBindedSelect";
import { useEffect, useState } from "react";
import SearchPatrocinanteDialog from "./SearchPatrocinanteDialog";

const FormFields = ({
  nombre,
  setNombre,
  idTipoDocumento,
  setIdTipoDocumento,
  nroDocumento,
  setNroDocumento,
  cuil,
  setCuil,
  patrocinante,
  setPatrocinante,
  nroWhatsapp,
  setNroWhatsapp,
  domicilio,
  setDomicilio,
  localidad,
  setLocalidad,
  tiposDocumento}) => {

  const [showSearchPatrocinante, setShowSearchPatrocinante] = useState(false);
  const [datosPatrocinante, setDatosPatrocinante] = useState("");

  const onAcceptSearchPatrocinante = (e, patrocinante) => {
    e.preventDefault();
    setPatrocinante(patrocinante);
    setShowSearchPatrocinante(false);
  }
  
  useEffect(() => {
    if (!patrocinante || patrocinante.id === 0) return;
    setDatosPatrocinante(`${patrocinante.nombre} - ${"Matr. Nº " + patrocinante.nroMatricula}`);
  }, [patrocinante]);

  return (
      <>
        {showSearchPatrocinante && (
          <SearchPatrocinanteDialog handleAccept={onAcceptSearchPatrocinante} 
            handleCancel={() => setShowSearchPatrocinante(false)} />
          ) }
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
          <span className="form-text d-block text-end">0 si es el mismo que el documento</span>
        </div>
        <div className="mb-3">
          <label htmlFor="domicilio" className="form-label">Domicilio</label>
          <input id="domicilio" className="form-control" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="localidad" className="form-label">Localidad</label>
          <input id="localidad" className="form-control" value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="patrocinante" className="form-label">Patrocinante</label>
          <div className="row g-3">
            <div className="col-10">
              <input id="patrocinante" className="form-control bg-dark-subtle" value={datosPatrocinante} readOnly={true} tabIndex={-1}/>
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-outline-primary me-2" onClick={() => setShowSearchPatrocinante(true)} >Buscar</button>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="nroWhatsapp" className="form-label">Nº WhatsApp</label>
          <input id="nroWhatsapp" type="number" className="form-control" value={nroWhatsapp} onChange={(e) => setNroWhatsapp(e.target.value)} />
        </div>
        <div className="mb-3">
            <button type="submit" className="btn btn-primary me-2">Grabar</button>
            <Link to="/partes" className="btn btn-outline-primary">Cancelar</Link>
        </div>
      </>
  );
}

export default FormFields;