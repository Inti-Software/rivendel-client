import { useReducer, useEffect, use, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchParteDialog from "../Partes/SearchParteDialog";
import { Resoluciones } from "../../utils/endpoints";
import DataBindedSelect from "../Forms/DataBindedSelect";

// Estado inicial
const initialState = {
  id: 0,
  numero: 0,
  rubros: "",
  idResolucion: 0,
  fechaHoraInicio: "",
  horaFin: "",
  reclamantes: [],
  reclamados: [],
	searchPartes: {
		show: false,
		esReclamante: true
	},
  loading: false,
  errors: {}
};

// Reducer
function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: "" } // limpiar error al escribir
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors
      };

    case "SUBMIT_START":
      return { ...state, loading: true };

    case "SUBMIT_SUCCESS":
      return initialState;

    case "SUBMIT_FAIL":
      return { ...state, loading: false };

		case "SEARCH_PARTES":
			return { ...state, searchPartes: { show: action.show, esReclamante: action.esReclamante } };

    default:
      return state;
  }
}

export default function FormUseReducer() {
  const [state, dispatch] = useReducer(formReducer, initialState);
	const [resoluciones, setResoluciones] = useState([]);
	const navigate = useNavigate();	

	useEffect(() => {
		const fetchResoluciones = async () => {
			const response = await Resoluciones.findAll({currentPage: 1, recordsPerPage: 100});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const resolucionesData = data.data.map((r) => ({
				value: r.id,
				text: r.descripcion
			}));
			resolucionesData.unshift({ value: 0, text: "-- Seleccione una resolución --" });
			setResoluciones(resolucionesData);
		}
		fetchResoluciones();
	}, []);

  const validate = () => {
    const errors = {};
    if (state.numero <= 0) errors.numero = "Ingrese un número de conciliación válido";
    if (state.idResolucion <= 0) errors.idResolucion = "Seleccione una resolución válida";
    if (!state.fechaHoraInicio) errors.fechaHoraInicio = "Fecha y hora de inicio requerida";
    if (state.fechaHoraInicio && isNaN(Date.parse(state.fechaHoraInicio)))
      errors.fechaHoraInicio = "Ingrese una fecha y hora de inicio válidas";
    if (!state.horaFin) errors.horaFin = "Hora de fin requerida";
    if (state.horaFin && isNaN(Date.parse(state.horaFin)))
      errors.horaFin = "Ingrese una hora de fin válida";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    try {
      // Enviar a una API .NET (ejemplo)
      await fetch("https://localhost:5001/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password
        })
      });

      dispatch({ type: "SUBMIT_SUCCESS" });
			navigate("/reclamos");
      //alert("Usuario registrado");
    } catch (err) {
      //alert("Error con el servidor", err);
      dispatch({ type: "SUBMIT_FAIL" });
    }
  };

	const addParte = (isReclamante) => {
		dispatch({ type: "SEARCH_PARTES", show: true, esReclamante: isReclamante })
	}

	const removeParte = (id, isReclamante) => {
		const partes = isReclamante ? state.reclamantes : state.reclamados;
		const f = isReclamante ? "reclamantes" : "reclamados";
		const v = partes.filter(p => p.id !== id);
		dispatch({ type: "SET_FIELD", field: f, value: v });
	}

	const onAcceptSearchParte = (e, parte) => {
		e.preventDefault();
		const partes = state.searchPartes.esReclamante ? state.reclamantes : state.reclamados;
		if (!partes.find(r => r.id === parte.id)) {
			const f = state.searchPartes.esReclamante ? "reclamantes" : "reclamados";
			const v = [...partes, parte];
			dispatch({ type: "SET_FIELD", field: f, value: v });
		}
		dispatch({ type: "SEARCH_PARTES", show: false});
	}

	const partesTable = (esReclamante) => {
		const partes = esReclamante ? state.reclamantes : state.reclamados;
		const title = esReclamante ? "Reclamantes" : "Reclamados";
		return (
				<div className="mb-3">
					<table className="table table-sm text-center">
						<thead>
							<tr>
								<th colSpan={3} className="fw-bold text-bg-secondary rounded-top-pill">{title}</th>
							</tr>
							<tr>
								<th className="text-bg-secondary rounded border-1">CUIL</th>
								<th className="text-bg-secondary rounded border-1">Nombre</th>
								<th className="text-bg-secondary rounded border-1"></th>
							</tr>
						</thead>
						<tbody>
							{partes.map((p) => (
								<tr key={p.id}>
									<td>{p.cuil}</td>
									<td>{p.nombre}</td>
									<td className="text-danger" >
										<button type="button" className="btn btn-sm btn-outline-danger"
											onClick={() => removeParte(p.id, esReclamante)}>
											-
										</button>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={2}>
									<button type="button" className="btn btn-sm btn-outline-secondary"
										onClick={() => addParte(esReclamante)}>
										Agregar {title.slice(0, -1)}
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
		);
	}

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
			{state.searchPartes.show && (
				<SearchParteDialog handleAccept={onAcceptSearchParte} 
					handleCancel={() => dispatch({ type: "SEARCH_PARTES", show: false })} />
				) }

		  <h3 className="mb-3">Formulario de Reclamo</h3>
			<div className="row">
				<div className="col-md-2 mb-3">
					<label htmlFor="numero" className="form-label">Número</label>
					<input id="numero" placeholder="Número" className="form-control text-end" type="number" value={state.numero} 
						onChange={(e) => dispatch({ type: "SET_FIELD", field: "numero", value: parseInt(e.target.value) })} required />
				</div>
				<div className="col-md-3 mb-3">
					<label htmlFor="fechaHoraInicio" className="form-label">Fecha y Hora de Inicio</label>
					<input id="fechaHoraInicio" placeholder="AAAA-MM-DD HH:MM" className="form-control text-center" type="datetime-local" value={state.fechaHoraInicio} 
						onChange={(e) => dispatch({ type: "SET_FIELD", field: "fechaHoraInicio", value: e.target.value })} required />
				</div>
				<div className="col-md-1 mb-3">
					<label htmlFor="horaFin" className="form-label">Hora de Fin</label>
					<input id="horaFin" placeholder="HH:MM" className="form-control text-center" type="time" value={state.horaFin} 
						onChange={(e) => dispatch({ type: "SET_FIELD", field: "horaFin", value: e.target.value })} required />
				</div>
				<div className="col-md-5 mb-3">
					<label htmlFor="idResolucion" className="form-label">Resolución</label>
					<DataBindedSelect data={resoluciones} selectedValue={state.idResolucion} 
						setSelectedValue={(v) => dispatch({ type: "SET_FIELD", field: "idResolucion", value: parseInt(v) })} />
				</div>
			</div>

			<div className="mb-3">
				<label htmlFor="rubros" className="form-label">Rubros</label>
				<textarea className="form-control" id="rubros" rows="5" placeholder="Objetos del reclamo/rubros y períodos..."
					onChange={(e) => dispatch({ type: "SET_FIELD", field: "rubros", value: e.target.value })}>					
				</textarea>
			</div>

			<div className="mb-3">
				<div className="mb-3">
					<span className="h5 text-primary">Partes Involucradas</span>
				</div>
				{partesTable(true)}
				{partesTable(false)}
			</div>

    <pre>{JSON.stringify(state, null, 2)}</pre>
    </form>

  );
}
