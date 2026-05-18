import { PLUSCIRCLE } from "../../Shared/Icons";
import ParteItem from "./ParteItem";

const PartesList = ({ state, esReclamante, setField, onAddParte }) => {

	const partes = esReclamante ? state.reclamantes : state.reclamados;
	const title = esReclamante ? "Reclamantes" : "Reclamados";
	return (
			<div className="mb-3">
				<div className="border-1 border-bottom border-secondary text-primary mb-1 h6 d-flex">
					<div className="pt-2">
						<span className="pe-2">{title}</span>							
						<span>|</span>
						<span className="p-2 rounded text-secondary" id="agregar-parte" onClick={onAddParte}>
							{PLUSCIRCLE(12, 12)} Añadir
						</span>
					</div>
				</div>
				<table className="w-100">
					<tbody>
						{partes.map((p) => 
							<>
								<ParteItem key={p.id} p={p} esReclamante={esReclamante} state={state} setField={setField} />
							</>
						)}
					</tbody>
				</table>
			</div>
	);
}

export default PartesList;