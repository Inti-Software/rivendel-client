import useClausulasDialog from '../hooks/useClausulasForm.js';
import { lazy, useEffect } from 'react';
import { formatCuil } from '../../Shared/utis.js';

const DatePicker = lazy(() => import('./DatePicker.jsx'));

export default function ClausulasTemplateFormDialog({ onAccept, onCancel, visible = true }) {
  if (!visible) return null;

  const { state, dispatch } = useClausulasDialog();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && visible) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onCancel]);  

  const setField = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.id, value: e.target.value });
  };

  const setDateField = (field, value) => { dispatch({ type: "SET_FIELD", field, value }) };

  function handleKeyDown(event) {
    if (event.key === "Enter") handleSubmit(event);
    if (event.key === "Escape") onCancel(event);
  }

  const validate = (state) => {
    const errors = [];
    if (state.nombre.trim() === '') errors.push('Ingrese el nombre del patrocinante');
    return errors;
  };

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(state);
    if (errors.length > 0) {
      dispatch({ type: 'SET_ERRORS', errors: validationErrors });
      return;
    }

    dispatch({ type: 'SUBMIT_START' });
    const { initializing, errors, redirect, loading, ...result } = state;
    dispatch({ type: 'SUBMIT_SUCCESS' });
    onAccept(event, result);
  }

  return (
    <div
      className="modal show modal-backdrop-50 dialog-centered d-flex"
      tabIndex="-1"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-dialog center-vertical min-vw-100">
        <div className="modal-content w-50">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Cláusulas</h5>
          </div>
          <div className="modal-body">
            <div style={{ maxHeight: "200px", overflowY: "scroll" }} className="pe-3">
              <div className="mb-3 row">
                <div className="col-sm-6">
                  <label htmlFor="puesto" className="form-label">Puesto</label>
                  <input type="text" className="form-control" id="puesto" name="puesto" value={state.puesto} onChange={setField} autoComplete="off" />
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
                    <span class="input-group-text">$</span>
                    <input type="number" className="form-control text-end" id="importe" name="importe" value={state.importe} onChange={setField} autoComplete="off" />
                    <span class="input-group-text">.00</span>
                  </div>
                </div>
                <div className="col-sm-5 col-form-label bg-secondary-subtle text-start rounded badge text-primary">
                  <label>{state.importeNros} xxx</label>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="rubros" className="form-label">Rubros</label>
                <textarea class="form-control" rows="3" id="rubros" name="rubros" value={state.rubros} onChange={setField}></textarea>
              </div>
              
              <div className="mb-3 border border-1 border-secondary-subtle rounded-2 p-2 bg-secondary-subtle">
                <h5>Cuotas</h5>
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="cuotas.cantidadCuotas" className="form-label">Cantidad</label>
                    <input type="number" className="form-control text-end" id="cuotas.cantidadCuotas" name="cuotas.cantidadCuotas" value={state.cuotas.cantidadCuotas} 
                      onChange={setField} autoComplete="off" />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="cuotas.importeCuotas" className="form-label">Importe</label>
                    <div className="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" className="form-control text-end" id="importe" name="cuotas.importeCuotas" value={state.cuotas.importeCuotas} onChange={setField} autoComplete="off" />
                      <span class="input-group-text">.00</span>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="cuotas.fechaPrimeraCuota" className="form-label">1ª cuota</label>
                    <DatePicker id="cuotas.fechaPrimeraCuota" name="cuotas.fechaPrimeraCuota" value={state.cuotas.fechaPrimeraCuota} setField={setDateField} 
                      showTime={false} />
                  </div>
                </div>
              </div>

              <div className="mb-3 border border-1 border-secondary-subtle rounded-2 p-2 bg-secondary-subtle">
                <h5>Reclamante</h5>
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

              <div className="mb-3 border border-1 border-secondary-subtle rounded-2 p-2 bg-secondary-subtle">
                <h5>Cuenta</h5>
                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="cuenta.titular" className="form-label">Titular</label>
                    <input type="text" className="form-control" id="cuenta.titular" name="cuenta.titular" value={state.cuenta.titular} 
                      onChange={setField} autoComplete="off" />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="cuenta.cuilTitular" className="form-label">CUIL Titular</label>
                    <input type="text" className="form-control text-start" id="cuenta.cuilTitular" name="cuenta.cuilTitular" value={formatCuil(state.cuil)}
                      onChange={setField} autoComplete="off" placeholder="  -        - " />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-sm-6">
                    <label htmlFor="cuenta.entidad" className="form-label">Entidad</label>
                    <input type="text" className="form-control" id="cuenta.entidad" name="cuenta.entidad" value={state.cuenta.entidad} 
                      onChange={setField} autoComplete="off" />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="cuenta.alias" className="form-label">Alias</label>
                    <input type="text" className="form-control" id="cuenta.alias" name="cuenta.alias" value={state.cuenta.alias} 
                      onChange={setField} autoComplete="off" />
                  </div>
                </div>
              </div>
              <pre>{JSON.stringify(state, null, ' ')}</pre>
            </div>
          </div>
          <div className="modal-footer">
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
