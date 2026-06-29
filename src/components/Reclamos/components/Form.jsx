import { useNavigate, Link, useParams } from "react-router-dom";
import SearchParteDialog from "../../Partes/SearchParteDialog";
import DataBindedSelect from "../../Forms/DataBindedSelect";
import ValidationErrors from "../../Shared/ValidationErrors";
import { CON_ARREGLO, POSTERGADO, RESOLUCIONES } from "../tiposResoluciones";
import useReclamoForm from "../hooks/useReclamoForm";
import PartesList from "./PartesList";
import { handleOnChange, handleSubmit, onAcceptSearchParte } from '../eventHandlers.utils';
import { ProximaAudienciaInput } from "./ProximaAudienciaInput";
import { RichTextEditor } from '../../CustomTipTap/RichTextEditor';

export default function Form() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { state, setField, setErrors, submitStart, submitSuccess, 
		submitFail, searchPartes, hidePartesDialog } = useReclamoForm(id);
	const isCreateOperation = Number.isNaN(state.id) || !(state.id > 0);
	const searchDialogTitle = state.searchPartes.esReclamante? "Agregar reclamante" : "Agregar reclamado"
	const formTitle = `${isCreateOperation? "Nuevo " : "Edición de "} Reclamo`

  return (
    <form onSubmit={(e) => handleSubmit(e, isCreateOperation, state, setErrors, submitStart, 
			submitSuccess, submitFail, navigate)} style={{ padding: 20 }}>
			<SearchParteDialog title={searchDialogTitle} visible={state.searchPartes.show}
				handleAccept={(e, id) => onAcceptSearchParte(e, id, state, hidePartesDialog, setField, setErrors)} handleCancel={hidePartesDialog} />
		  <h3 className="mb-3">{formTitle}</h3>
			
			<ValidationErrors errors={state.errors} />

			<div className="row mb-3">
				<div className="col-2">
					<label htmlFor="numero" className="form-label">Número</label>
					<input id="numero" placeholder="Número" className="form-control text-end" type="number" value={state.numero} 
						onChange={(e) => handleOnChange(e, setField)} required autoFocus />
				</div>
				<div className="col-4">
					<label htmlFor="fechaHoraInicio" className="form-label d-block">Fecha y Hora</label>
					<input id="fechaHoraInicio" placeholder="AAAA-MM-DD HH:MM" className="form-control text-center d-inline-block w-auto" 
						type="datetime-local" value={state.fechaHoraInicio} onChange={(e) => handleOnChange(e, setField)} />
					<span className="mx-3">hasta</span>
					<input id="horaFin" placeholder="HH:MM" className="form-control d-inline text-center w-25" type="time" value={state.horaFin} 
						onChange={(e) => handleOnChange(e, setField)} />
				</div>
				<div className="col-2">
					<label htmlFor="idResolucion" className="form-label">Resolución</label>
					<DataBindedSelect data={RESOLUCIONES} selectedValue={state.idResolucion} 
						setSelectedValue={(v) => setField("idResolucion", parseInt(v))} />
				</div>

				<ProximaAudienciaInput visible={state.idResolucion === POSTERGADO} value={state.proxAudiencia} 
					handleOnChange={(e) => handleOnChange(e, setField)} />
			</div>

			<div className="mb-3">
				<label htmlFor="rubros" className="form-label">Rubros</label>
				<textarea className="form-control" id="rubros" rows="5" placeholder="Objetos del reclamo/rubros y períodos..."
					value={state.rubros} onChange={(e) => handleOnChange(e, setField)}>
				</textarea>
			</div>

			<div className="mb-3">
				<div className="mb-3">
					<span className="h5 text-primary">Partes Involucradas</span>
				</div>
				<PartesList state={state} esReclamante={true} setField={setField} onAddParte={searchPartes} />
				<PartesList state={state} esReclamante={false} setField={setField} onAddParte={searchPartes} />
			</div>

			{(state.idResolucion === CON_ARREGLO)?
				<div className="mb-3">
					<div className="mb-3">
						<span className="h5 text-primary">Cláusulas</span>
					</div>
					<RichTextEditor initialContent={state.clausulas} onChange={(doc) => setField('clausulas', doc)} visible={state.idResolucion === CON_ARREGLO} />
				</div>
				:
				<></>
			}

			<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
					<button disabled={state.loading || state.searchPartes.show } type="submit" className="btn btn-primary me-2">
						{state.loading? "Grabando...":"Grabar"}
					</button>
					<Link to="/reclamos" className="btn btn-outline-primary">Cancelar</Link>
			</div>    

    </form>

  );
}
