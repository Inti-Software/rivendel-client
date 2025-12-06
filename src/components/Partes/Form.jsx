import { useReducer, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import ValidationErrors from "../Shared/ValidationErrors";
import { useNotification } from "../../contexts/Constants";
import { Resoluciones, TiposDocumento } from "../../utils/endpoints";
import DataBindedSelect from "../Forms/DataBindedSelect";
import { SEARCH } from "../../utils/Icons";
import SearchPatrocinanteDialog from './SearchPatrocinanteDialog'

const initialState = {
  id: 0,
  nombre: "",
  idTipoDocumento: 0,
  nroDocumento: "",
  cuil: "",
  idPatrocinante: 0,
	patrocinante: "",
  nroWhatsapp: "",
  localidad: "",
  domicilio: "",
  initializing: true,
  loading: false,
  errors: [],
	isUpdate: false
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
				errors: []
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors
      };

    case "SUBMIT_START":
      return { 
				...state, 
				errors: [],
				loading: true 
			};

    case "SUBMIT_SUCCESS":
      return initialState;

    case "SUBMIT_FAIL": {
			const errors = (typeof action.errors === "string") ?
							[action.errors || "Error en la solicitud"] :
							action.errors || ["Error en la solicitud"];
      return { 
				...state,
				errors: errors,
				loading: false 
			};
		}

		case "INITIAL_LOAD":
			return { 
				...state,
				...action.payload,
				initializing: false,
				isUpdate: action.payload.id !== undefined
			};

    default:
      return state;
  }
}

export default function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
	const navigate = useNavigate();
	const { id } = useParams();
	const { showSuccess } = useNotification();
	const [showSearchPatrocinante, setShowSearchPatrocinante] = useState(false);
	const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
		const fetchTiposDocumento = async () => {
			const response = await TiposDocumento.findAll()
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json()
			const td = data.map(d => ({
				value: d.id,
				text: d.descripcion
			}));
			setTiposDocumento(td);
		}

		fetchTiposDocumento();
	}, []);

	useEffect(() => {
		if (isNaN(id)) return;

		try {
			const fetchData = async () => {
				const response = await Resoluciones.get(id);
				if (response.ok) {
					const data = await response.json();
					dispatch({ type: "INITIAL_LOAD", payload: {
						id: data.id,
						descripcion: data.descripcion,
						detalle: data.detalle
					}});
				} else {					
					console.error(await response.json());
					dispatch({ type: "INITIAL_LOAD", payload: {} });
				}
			};
			fetchData();
		} catch (err) {
			console.error(err);
			dispatch({ type: "INITIAL_LOAD", payload: {} });
		}
	}, [id]);

	const validate = () => {
		const errors = [];
		if (state.descripcion.trim() === "") errors.push("Ingrese la descripción.");
		if (state.detalle.trim() === "") errors.push("Ingrese un detalle.")
		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const errors = validate();
		if (errors.length > 0) {
			dispatch({ type: "SET_ERRORS", errors });
			return;
		}

		dispatch({ type: "SUBMIT_START" });

		try {
			const patrocinante = {
				id: state.id, 
				descripcion: state.descripcion,
				detalle: state.detalle
			};

			let result;
			if (isNaN(id))
				result = await Resoluciones.create(patrocinante);
			else
				result = await	Resoluciones.update(patrocinante);

			if (result.ok) {
				const descripcion = state.descripcion.substring(0, 25) +
						(state.descripcion.length > 25 ? "..." : "");
				showSuccess(`La resolución ${descripcion} se ${state.isUpdate ? "actualizó" : "creó"} correctamente.`);
				dispatch({ type: "SUBMIT_SUCCESS" });
				navigate("/resoluciones");
			} else {				
				const errorData = await result.json();
				dispatch({ type: "SUBMIT_FAIL", errors: errorData.message });
			}
		} catch (err) {
			dispatch({ type: "SUBMIT_FAIL", errors: [err.message] });
		}
	};

  const onAcceptSearchPatrocinante = (e, patrocinante) => {
    e.preventDefault();
		state.idPatrocinante = parseInt(patrocinante.id);
		state.patrocinante = `${patrocinante.nroMatricula} - ${patrocinante.nombre}`
    setShowSearchPatrocinante(false);
  }
  
	const setField = (e) => {
		console.log(e.target.id, e.target.value)
		dispatch({ type: "SET_FIELD", field: e.target.id, value: e.target.value})
	}

	return (
		<form onSubmit={handleSubmit} style={{ padding: 20 }}>
		  <h3 className="mb-3">{isNaN(id)? "Nuevo " : "Edición de "} Reclamo</h3>
			{state.errors.length > 0 && <ValidationErrors errors={state.errors} />}
			
			{showSearchPatrocinante && (
          <SearchPatrocinanteDialog handleAccept={onAcceptSearchPatrocinante} 
            handleCancel={() => setShowSearchPatrocinante(false)} />
          ) }
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input id="nombre" className="form-control" type="text" value={state.nombre} onChange={setField} required />
        </div>
        <div className="mb-3">
            <label htmlFor="nroDocumento" className="form-label">Documento</label>
          <div className="row g-3">
            <div className="col">
              <DataBindedSelect id={"idTipoDocumento"} data={tiposDocumento} selectedValue={state.idTipoDocumento} 
								setSelectedValue={(v) => dispatch({ type: "SET_FIELD", field: "idTipoDocumento", value: parseInt(v) }) } />
            </div>
            <div className="col">
              <input id="nroDocumento" type="number" className="form-control" value={state.nroDocumento} onChange={setField} />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="cuil" className="form-label">CUIL</label>
          <input id="cuil" className="form-control" value={state.cuil} onChange={setField} />
          <span className="form-text d-block text-end">0 si es el mismo que el documento</span>
        </div>
        <div className="mb-3">
          <label htmlFor="domicilio" className="form-label">Domicilio</label>
          <input id="domicilio" className="form-control" value={state.domicilio} onChange={setField} />
        </div>
        <div className="mb-3">
          <label htmlFor="localidad" className="form-label">Localidad</label>
          <input id="localidad" className="form-control" value={state.localidad} onChange={setField} />
        </div>
        <div className="mb-3">
          <label htmlFor="patrocinante" className="form-label">Patrocinante</label>
          <div className="row g-3">
            <div className="col-10">
              <input id="patrocinante" className="form-control bg-dark-subtle" value={state.patrocinante} readOnly={true} tabIndex={-1}/>
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-outline-primary me-2" onClick={() => setShowSearchPatrocinante(true)} >
								{SEARCH} Buscar
							</button>							
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="nroWhatsapp" className="form-label">Nº WhatsApp</label>
          <input id="nroWhatsapp" type="number" className="form-control" value={state.nroWhatsapp} onChange={setField} />
        </div>

				<div className="mb-3 d-flex justify-content-end border-top pt-2 border-primary-subtle">
						<button disabled={state.loading} type="submit" className="btn btn-primary me-2">{state.loading? "Grabando...":"Grabar"}</button>
						<Link to="/resoluciones" className="btn btn-outline-primary">Cancelar</Link>
				</div>


				<pre>{JSON.stringify(state, null, 2)}</pre>

		</form>
	);
}