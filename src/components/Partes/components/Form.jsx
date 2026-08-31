import { useNavigate, Link } from "react-router-dom";
import ValidationErrors from "../../Shared/ValidationErrors";
import DataBindedSelect from "../../Forms/DataBindedSelect";
import { DELETE, SEARCH } from "../../Shared/Icons";
import SearchPatrocinanteDialog from "../../Patrocinantes/components/SearchPatrocinanteDialog";
import useForm from "../hooks/useForm";
import { handleSubmit, onAcceptSearchPatrocinante } from '../eventHandlers.js';
import { getPatrocinante, formatCuil } from '../utils.js';

export default function Form() {
	const { state, tiposDocumento, dispatch, setField, toogleEnableCuil, toogleEnableNroDocumento,
		toogleSearchPatrocinante,  } = useForm();
	const navigate = useNavigate();

	const backgroundNroDocumento = state.enableNroDocumento? "#fff" : "#aaa";
	const backgroundCuil = state.enableCuil? "#fff" : "#aaa";

	return (
		<div className="w-50 m-auto">
			<form onSubmit={(e) => handleSubmit(e, state, dispatch, navigate)} style={{ padding: 20 }}>
				<h3 className="mb-3">{isNaN(state.id)? "Nueva " : "Edición de "} Parte</h3>
				{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
				
				{state.searchPatrocinante && (
						<SearchPatrocinanteDialog handleAccept={(e, patrocinante) => onAcceptSearchPatrocinante(e, patrocinante, dispatch, toogleSearchPatrocinante)} 
							handleCancel={toogleSearchPatrocinante} />
						) }
				<div className="mb-3">
					<label htmlFor="nombre" className="form-label">Nombre</label>
					<input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} 
						required autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="nroDocumento" className="form-label" onClick={toogleEnableNroDocumento}>						
						<input id="enableNroDocumento" type="checkbox" checked={state.enableNroDocumento} onChange={() => {}} /> Documento
					</label>
					<div className="row g-3">
						<div className="col">
							<DataBindedSelect id={"idTipoDocumento"} data={tiposDocumento} selectedValue={state.idTipoDocumento} 
								setSelectedValue={(v) => dispatch({ type: "SET_FIELD", field: "idTipoDocumento", value: parseInt(v) }) } 
								props={{ autoComplete: "off", visible: !state.enableNroDocumento, 
									style: { backgroundColor: backgroundNroDocumento } }}
								/>
						</div>
						<div className="col">
							<input id="nroDocumento" type="number" className="form-control" value={state.nroDocumento} 
								onChange={setField} autoComplete="off" disabled={!state.enableNroDocumento} 
								style={{ backgroundColor: backgroundNroDocumento }}/>
						</div>
					</div>
				</div>
				<div className="mb-3">
					<label htmlFor="cuil" className="form-label" onClick={toogleEnableCuil}>
							<input id="enableCuil" type="checkbox" checked={state.enableCuil} onChange={() => {}} /> CUIL
					</label>
					<input id="cuil" className="form-control text-start" placeholder="  -        - "
						value={formatCuil(state.cuil)} onChange={setField} disabled={!state.enableCuil} 
						style={{ backgroundColor: backgroundCuil }} autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="domicilio" className="form-label">Domicilio</label>
					<input id="domicilio" className="form-control" value={state.domicilio} 
						onChange={setField} autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="localidad" className="form-label">Localidad</label>
					<input id="localidad" className="form-control" value={state.localidad} 
						onChange={setField} autoComplete="off" />
				</div>
				<div className="mb-3">
					<label htmlFor="patrocinante" className="form-label">Patrocinante</label>
					<div className="row g-3">
						<div className="col-10">
							<input id="patrocinante" className="form-control bg-dark-subtle" 
								value={getPatrocinante(state.patrocinante)}
								readOnly={true} tabIndex={-1}/>
						</div>
						<div className="col">
							<button type="button" className="btn btn-outline-primary me-1" onClick={toogleSearchPatrocinante} >
								{SEARCH}
							</button>
							<button type="button" className="btn btn-outline-secondary" 
								onClick={() => dispatch({ type: "SET_FIELD", field: "patrocinante", value: { id: 0, nombre: "", nroMatricula: 0 } })} >
								{DELETE}
							</button>							
						</div>
					</div>
					<div className="d-flex mt-1">
						<label className="me-2 small">
								<input id="esApoderado" type="checkbox" checked={state.esApoderado} onChange={setField} /> Es apoderado
						</label>
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading || state.searchPatrocinante} type="submit" className="btn btn-primary me-2">
							{state.loading? "Grabando...":"Grabar"}
						</button>
						<Link to="/partes" className="btn btn-outline-primary">Cancelar</Link>
				</div>

			</form>

	</div>
	);
}