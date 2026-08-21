import { Partes } from '../../api/endpoints/partes';
import { getDomicilio } from "../Patrocinantes/utils";
import SearchDialogContainer from '../Shared/SearchDialogContainer';

const template = (p, isSelected, selectRow) => (
	<tr key={p.id} onClick={() => selectRow(p.id)} style={{ cursor: "pointer" }}>
		<td id={p.id}>
			<div className={'border border-secondary mx-0 rounded-1 p-2 mb-1 ' + (isSelected? 'bg-warning-subtle' : 'bg-secondary-subtle') }
				style={{ fontSize: "0.9em" }}>
				<div className='row'>
					<div className='col-3'>
						<span className="fw-bold">{p.tipoDocumento}: </span>
						<span aria-label='cuil'>{p.nroDocumento}</span>
					</div>
					<div className='col'>
						<span className="fw-bold">Nombre: </span>
						<span aria-label='nombre'>{p.nombre}</span>
					</div>
				</div>
				<div>
					<span className="text-secondary d-flex border-bottom border-secondary-subtle small fw-medium">Patrocinante</span>
					<div className="row">
						{(p.patrocinante == null) ? (
						<div className="col-12 d-flex p-2">
							<span className="border rounded border-warning bg-warning-subtle m-auto p-1" 
								style={{"fontSize": "0.75em"}}>No hay datos para mostrar.</span>
						</div>
						):(
						<>
							<div className="col-2">
								<span className="fw-bold">Nº Matr.: </span> {p.patrocinante?.nroMatricula}
							</div>
							<div className="col-4">
								<span className="fw-bold">Nombre: </span>{p.patrocinante?.nombre}
							</div>
							<div className="col-6">
								<span className="fw-bold">Domicilio: </span>{getDomicilio(p.patrocinante)}
							</div>
						</>
						)}
					</div>
				</div>
			</div>
		</td>
	</tr> 
);	

const SearchParteDialog = ({ title, handleAccept, handleCancel }) => (
	<SearchDialogContainer
		title={title}
		placeholder="Nombre o CUIL"
		template={template}
		searchFn={(term) => Partes.findAll({ query: term })}
		onAccept={handleAccept}
		onCancel={handleCancel}
	/>
);

export default SearchParteDialog;