import useFormDialog from '../hooks/useForm.js';
import { lazy } from 'react';
import { formatCuil } from '../../Shared/utis.js';
import { handleKeyDown, onBlurAliasCuenta } from '../eventHandlers';

const DatePicker = lazy(() => import('../../Reclamos/components/DatePicker.jsx'));

export default function ClausulasTemplateFormDialog({ onAccept, onCancel, defaultValues, visible = true }) {
  if (!visible) return null;

  const { state, dispatch } = useFormDialog(visible, onCancel, defaultValues);
  const bgControlCuenta = state.cuenta.loading? "bg-dark-subtle" : "";

  const setField = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.id, value: e.target.value });
  };

  const setDateField = (field, value) => { dispatch({ type: "SET_FIELD", field, value }) };

  return (
    <div
      className="modal show modal-backdrop-50 d-flex align-items-center justify-content-center"
      tabIndex="-1"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-dialog w-50" style={{ height: '70vh', minHeight: '50vh', maxWidth: '50vw' }}>
        <div className="modal-content h-100 w-100 d-flex flex-column">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Datos para rellenar la plantilla</h5>
          </div>
          <div className="modal-body overflow-y-auto flex-grow-1">
            <div className="ps-1 pe-3">
              <div className="mb-3 row">
                <div className="col-sm-6">
                  <label htmlFor="puesto" className="form-label">Puesto</label>
                  <input type="text" className="form-control" id="puesto" name="puesto" value={state.puesto} 
                    onChange={setField} autoComplete="off" autoFocus />
                </div>
                <div className="col-sm-3">
                  <label htmlFor="fecha" className="form-label">Despido</label>
                  <DatePicker id="fecha" name="fecha" value={state.fecha} setField={setDateField} showTime={false} 
                    className="form-control text-center d-inline w-75" />
                </div>
                <div className="col-sm-3">
                  <label htmlFor="fechaTelegrama" className="form-label">Telegrama</label>
                  <DatePicker id="fechaTelegrama" name="fechaTelegrama" value={state.fechaTelegrama} setField={setDateField} 
                    showTime={false} className="form-control text-center d-inline w-75" />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="reclamado" className="form-label">Reclamado</label>
                <input type="text" className="form-control" id="reclamado" name="reclamado" value={state.reclamado} onChange={setField} autoComplete="off" />
              </div>
              <div className="mb-3 row">
                <label htmlFor="importe" className="col-sm-1 col-form-label">Importe</label>
                <div className="col-sm-6">
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" className="form-control text-end" id="importe" name="importe" value={state.importe} onChange={setField} autoComplete="off" />
                    <span className="input-group-text">.00</span>
                  </div>
                </div>
                <div className="col-sm-5 col-form-label bg-secondary-subtle text-start rounded text-primary fw-bold align-midle" style={{ fontSize: "0.7em" }}>
                  <label>{state.importeLetras}</label>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="rubros" className="form-label">Rubros</label>
                <textarea className="form-control" rows="3" id="rubros" name="rubros" value={state.rubros} onChange={setField}></textarea>
              </div>
              
              <div className="card mb-3">
                <div className="card-header bg-secondary-subtle h5 text-center">
                  <span className="card-title">Cuotas</span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-4">
                      <label htmlFor="cuotas.cantidad" className="form-label">Cantidad</label>
                      <input type="number" className="form-control text-end" id="cuotas.cantidad" name="cuotas.cantidad" value={state.cuotas.cantidad} 
                        onChange={setField} autoComplete="off" />
                    </div>
                    <div className="col-sm-4">
                      <label htmlFor="cuotas.importe" className="form-label">Importe</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input type="number" className="form-control text-end" id="cuotas.importe" name="cuotas.importe" value={state.cuotas.importe} onChange={setField} autoComplete="off" />
                        <span className="input-group-text">.00</span>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <label htmlFor="cuotas.fechaPrimera" className="form-label">1ª cuota</label>
                      <DatePicker id="cuotas.fechaPrimera" name="cuotas.fechaPrimera" value={state.cuotas.fechaPrimera} setField={setDateField} 
                        showTime={false} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-3">
                <div className="card-header bg-secondary-subtle h5 text-center">
                  <span className="card-title">Reclamante</span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="reclamante.dni" className="form-label">DNI</label>
                      <input type="number" className="form-control text-end" id="reclamante.dni" name="reclamante.dni" value={state.reclamante.dni} 
                        onChange={setField} autoComplete="off" />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="reclamante.nombre" className="form-label">Nombre</label>
                      <input type="text" className="form-control" id="reclamante.nombre" name="reclamante.nombre" value={state.reclamante.nombre} 
                        onChange={setField} autoComplete="off" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header bg-secondary-subtle h5 text-center">
                  <span className="card-title">Cuenta</span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="cuenta.alias" className="form-label">
                        Alias 
                      </label>
                      <div className="spinner-grow text-success ms-2" role="status" style={{ width: "0.75em", height: "0.75em", visibility: state.cuenta.loading?"visible":"hidden" }}>
                        <span className="visually-hidden">Cargando... </span>
                      </div>
                      <input type="text" className={ `form-control` } id="cuenta.alias" name="cuenta.alias" value={state.cuenta.alias} 
                        onChange={setField} autoComplete="off" onBlur={(e) => onBlurAliasCuenta(e, dispatch)} />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="cuenta.titular" className="form-label">Titular</label>
                      <input type="text" className={ `form-control ${bgControlCuenta}`} id="cuenta.titular" name="cuenta.titular" value={state.cuenta.titular} 
                        onChange={setField} autoComplete="off" />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-sm-6">
                      <label htmlFor="cuenta.cuilTitular" className="form-label">CUIL Titular</label>
                      <input type="text" className={`form-control text-start ${bgControlCuenta}`} id="cuenta.cuilTitular" name="cuenta.cuilTitular" value={formatCuil(state.cuenta.cuilTitular)}
                        onChange={setField} autoComplete="off" placeholder="  -        - " />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="cuenta.entidad" className="form-label">Entidad</label>
                      <input type="text" className={`form-control ${bgControlCuenta}`} id="cuenta.entidad" name="cuenta.entidad" value={state.cuenta.entidad} 
                        onChange={setField} autoComplete="off" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" class="btn btn-light me-auto" onClick={(e) => onAccept(e, null)} >
              Cargar plantilla vacía
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={(e) => onAccept(e, state)}
              disabled={state.loading}
            >
              Aceptar
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
