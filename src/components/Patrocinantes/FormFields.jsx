import { Link } from "react-router-dom";

const FormFields = ({nombre, setNombre, nroMatricula, setNroMatricula, domicilio, setDomicilio, 
  localidad, setLocalidad, nroCasillero, setNroCasillero}) => {
    return (
        <>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input id="nombre" className="form-control" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="nroMatricula" className="form-label">Nº Matrícula</label>
            <input id="nroMatricula" type="number" className="form-control" value={nroMatricula} onChange={(e) => setNroMatricula(e.target.value)} />
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
            <label htmlFor="nroCasillero" className="form-label">Nº Casillero</label>
            <input id="nroCasillero" type="number" className="form-control" value={nroCasillero} onChange={(e) => setNroCasillero(e.target.value)} />
          </div>
          <div className="mb-3">
              <button type="submit" className="btn btn-primary me-2">Grabar</button>
              <Link to="/patrocinantes" className="btn btn-outline-primary">Cancelar</Link>
          </div>
        </>
    );
}

export default FormFields;