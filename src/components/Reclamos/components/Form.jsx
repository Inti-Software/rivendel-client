import { useNavigate, Link, useParams } from "react-router-dom";
import SearchParteDialog from "../../Partes/components/SearchParteDialog";
import DataBindedSelect from "../../Forms/DataBindedSelect";
import ValidationErrors from "../../Shared/ValidationErrors";
import { CON_ARREGLO, POSTERGADO, RESOLUCIONES } from "../tiposResoluciones";
import useReclamoForm from "../hooks/useReclamoForm";
import PartesList from "./PartesList";
import { handleOnChange, handleSubmit, onAcceptSearchParte } from '../eventHandlers.utils';
import { ProximaAudienciaInput } from "./ProximaAudienciaInput";
import { lazy, Suspense } from 'react';
import Spinner from "../../Shared/Spinner";
import { isNew } from '../../Shared/utis.js';

const RichTextEditor = lazy(() => import('../../CustomTipTap/RichTextEditor'));
const DatePicker = lazy(() => import('./DatePicker'));
const HourPicker = lazy(() => import('./HourPicker'));

export default function Form() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { state, setField, setErrors, submitStart, submitSuccess, 
		submitFail, searchPartes, hidePartesDialog } = useReclamoForm(id);
	const isCreateOperation = isNew(state.id);
	const searchDialogTitle = state.searchPartes.esReclamante? "Agregar reclamante" : "Agregar reclamado"
	const formTitle = `${isCreateOperation? "Nuevo " : "Edición de "} Reclamo`

  return (
    <form onSubmit={(e) => handleSubmit(e, isCreateOperation, state, setErrors, submitStart, 
			submitSuccess, submitFail, navigate)} style={{ padding: 20 }}>
				{state.searchPartes.show &&(
					<SearchParteDialog 
						title={searchDialogTitle} 
						handleAccept={(e, id) => onAcceptSearchParte(e, id, state, hidePartesDialog, setField, setErrors)} 
						handleCancel={hidePartesDialog} />
				)}

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
				  <Suspense fallback={<Spinner />}>
						<DatePicker id={"fechaHoraInicio"} name={"fechaHoraInicio"} value={state.fechaHoraInicio} setField={setField} />
						<span className="mx-3">hasta</span>
						<HourPicker id={"horaFin"} name={"horaFin"} value={state.horaFin} setField={setField} />
					</Suspense>
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
					<Suspense fallback={<Spinner />}>
						<RichTextEditor initialContent={state.clausulas} onChange={(doc) => setField('clausulas', doc)} visible={state.idResolucion === CON_ARREGLO} />
					</Suspense>
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
