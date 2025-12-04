import { NO_ESPECIFICADO } from "../../../utils/constants";

export default function ReportData(data) {
	const getParte = (partes) => {
		let nombre = "";
		if (partes && partes.length > 1) {
			nombre = partes.slice(0, partes.length - 1).map(r => r.nombre).join(', ') +
			" y " + partes[partes.length -1].nombre;
		} else {
			nombre = partes?.length === 1 ? partes[0].nombre : NO_ESPECIFICADO;
		}

		const sintetico = partes[0].tipoDocumento.sintetico || "DNI";
		const nroDocumento = partes[0].nroDocumento || NO_ESPECIFICADO
		const cuil = partes[0].cuil || NO_ESPECIFICADO
		const domicilio = partes[0].domicilio;
		const localidad = partes[0].localidad;
		const patrocinante = partes[0].patrocinante || {};

		if (patrocinante && Object.keys(patrocinante).length > 0) {
			const nombre = patrocinante.nombre?.trim() === "" ? NO_ESPECIFICADO : patrocinante.nombre;
			const nroMatricula = patrocinante.nroMatricula > 0? patrocinante.nroMatricula : NO_ESPECIFICADO
			const domicilio = patrocinante.domicilio?.trim() === "" ? NO_ESPECIFICADO : patrocinante.domicilio;
			const localidad = patrocinante.localidad?.trim() === "" ? NO_ESPECIFICADO : patrocinante.localidad;
			const nroCasillero = patrocinante.nroCasillero > 0? patrocinante.nroCasillero : NO_ESPECIFICADO;

			patrocinante.nombre = nombre;
			patrocinante.nroMatricula = nroMatricula;
			patrocinante.domicilio = domicilio;
			patrocinante.localidad = localidad;
			patrocinante.nroCasillero = nroCasillero;
		}

		return {...partes[0], 
			nombre: nombre,
			sintetico: sintetico,
			nroDocumento: nroDocumento,
			cuil: cuil,
			domicilio: domicilio,
			localidad: localidad,
			patrocinante: patrocinante
		};
	}

	let reclamante = getParte(data.reclamantes);
	let reclamado = getParte(data.reclamados);

	console.log("Reclamante:", reclamante);
	console.log("Reclamado:", reclamado);

	return {
		titulo: `CERTIFICACIÓN DE FRACASO RECLAMO ${data.numero}`,
		reclamante: reclamante,
		reclamado: reclamado,
		rubros: data.rubros,
		resolucion: data.resolucion,
		fechaInicio: {
			dia: String(new Date(data.fechaHoraInicio).getDate()).padStart(2, '0'),
			mes: new Date(data.fechaHoraInicio).toLocaleString('es-AR', { month: 'long' }),
			anio: new Date(data.fechaHoraInicio).getFullYear(),
			hora: String(new Date(data.fechaHoraInicio).getHours()).padStart(2, '0') + ':' +
				  String(new Date(data.fechaHoraInicio).getMinutes()).padStart(2, '0')
		},
		horaFin: String(new Date(data.horaFin).getHours()).padStart(2, '0') + ':' +
				  String(new Date(data.horaFin).getMinutes()).padStart(2, '0')
	}
}