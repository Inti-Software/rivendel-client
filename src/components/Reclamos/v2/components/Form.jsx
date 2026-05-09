import { useNavigate, Link, useParams } from "react-router-dom";
import SearchParteDialog from "../../../Partes/SearchParteDialog";
import DataBindedSelect from "../../../Forms/DataBindedSelect";
import ValidationErrors from "../../../Shared/ValidationErrors";
import { POSTERGADO, RESOLUCIONES } from "../../../Resoluciones/tiposResoluciones";
import useReclamoForm from "../hooks/useReclamoForm";
import PartesTable from "./PartesTable";
import useEventHandlers from "../hooks/useEventHandlers";
import { ProximaAudienciaInput } from "./ProximaAudienciaInput";

export default function ReclamosForm() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { state, setField, setErrors, submitStart, submitSuccess, 
		submitFail, searchPartes, hidePartesDialog } = useReclamoForm(id);
	const { handleOnChange, handleSubmit, onAcceptSearchParte } = useEventHandlers(state, setField,
		setErrors, submitStart, submitSuccess, submitFail, hidePartesDialog, navigate)
	const isCreateOperation = Number.isNaN(state.id) || !(state.id > 0);
	const searchDialogTitle = state.searchPartes.esReclamante? "Agregar reclamante" : "Agregar reclamado"
	const formTitle = `${isCreateOperation? "Nuevo " : "Edición de "} Reclamo`

  return (
    <form onSubmit={(e) => handleSubmit(e, isCreateOperation)} style={{ padding: 20 }}>
			<SearchParteDialog title={searchDialogTitle} visible={state.searchPartes.show}
				handleAccept={onAcceptSearchParte} handleCancel={hidePartesDialog} />
		  <h3 className="mb-3">{formTitle}</h3>
			<ValidationErrors errors={state.errors} />
			<div className="row mb-3">
				<div className="col-4">
					<label htmlFor="numero" className="form-label">Número</label>
					<input id="numero" placeholder="Número" className="form-control text-end w-auto" type="number" value={state.numero} 
						onChange={handleOnChange} required />
				</div>
				<div className="col">
					<label htmlFor="fechaHoraInicio" className="form-label d-block">Fecha y Hora</label>
					<input id="fechaHoraInicio" placeholder="AAAA-MM-DD HH:MM" className="form-control text-center d-inline-block w-auto" 
						type="datetime-local" value={state.fechaHoraInicio} onChange={handleOnChange} />
					<span className="mx-3">hasta</span>
					<input id="horaFin" placeholder="HH:MM" className="form-control d-inline text-center w-auto" type="time" value={state.horaFin} 
						onChange={handleOnChange} />
				</div>
			</div>

			<div className="row mb-3">
				<div className="col-4">
					<label htmlFor="idResolucion" className="form-label">Resolución</label>
					<DataBindedSelect data={RESOLUCIONES} selectedValue={state.idResolucion} 
						setSelectedValue={(v) => setField("idResolucion", parseInt(v))} />
				</div>

				<ProximaAudienciaInput visible={state.idResolucion === POSTERGADO} value={state.proxAudiencia} 
					handleOnChange={handleOnChange} />
			</div>

			<div className="mb-3">
				<label htmlFor="rubros" className="form-label">Rubros</label>
				<textarea className="form-control" id="rubros" rows="5" placeholder="Objetos del reclamo/rubros y períodos..."
					value={state.rubros} onChange={handleOnChange}>
				</textarea>
			</div>

			<div className="mb-3">
				<div className="mb-3">
					<span className="h5 text-primary">Partes Involucradas</span>
				</div>
				<PartesTable state={state} esReclamante={true} setField={setField} onAddParte={searchPartes} />
				<PartesTable state={state} esReclamante={false} setField={setField} onAddParte={searchPartes} />
			</div>

			<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
					<button disabled={state.loading || state.searchPartes.show } type="submit" className="btn btn-primary me-2">
						{state.loading? "Grabando...":"Grabar"}
					</button>
					<Link to="/reclamos" className="btn btn-outline-primary">Cancelar</Link>
			</div>
    
    </form>

  );
}
