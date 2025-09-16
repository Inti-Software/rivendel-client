import { useNotification } from "../../../contexts/Constants";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACTION_CREATE } from "../../../utils/constants";
import { useParams } from "react-router-dom";

export function useResolucion(request, accion, getRequest) {
	const [descripcion, setDescripcion] = useState("");
	const [detalle, setDetalle] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { showSuccess } = useNotification();
	const { id } = useParams();

	useEffect(() => {
		if (isNaN(id)) return;

		try {
			const fetchData = async () => {
				const response = await getRequest(id);
				if (response.ok) {
					const data = await response.json();
					setDescripcion(data.descripcion);
					setDetalle(data.detalle);
				} else {
					const msg = await response.json();
					setError([msg.code + ": " + msg.message]);
				}
			};
			fetchData();
		} catch (err) {
			setError(["Error de conexión: " + err.message]);
		}
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await request({id, detalle, descripcion});
			if (response.ok) {
				showSuccess(
					"La resolución " +
						descripcion.substring(0, 25) +
						(descripcion.length > 25 ? "..." : "") +
						` se ${
							accion === ACTION_CREATE ? "creó" : "actualizó"
						} correctamente.`
				);
				setDetalle("");
				setDescripcion("");
				setError(null);
				navigate("/resoluciones");
			} else {
				const body = await response.json();
				setError(body.message);
			}
		} catch (error) {
			console.log("Error de conexión: " + error.message);
			setError(["Error al intentar ejecutar la transacción."]);
		}
	};

	return {
		fields: { detalle, setDetalle, descripcion, setDescripcion },
		error,
		handleSubmit,
	};
}
