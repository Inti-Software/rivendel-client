import { NO_ESPECIFICADO } from "../../../utils/constants";

/*
const result = {
	numero: 0,
	rubros: "",
	resolucion: "",
	fechaHoraInicio: "",
	horaFin: "",
	nombres: "",
	reclamantes: {
		nombre: "",
		dni: 0,
		cuil: 0,
		domicilio: "", //domicilio + localidad
		nroWhatsapp: "",
		patrocinante: {	//o null si coincide con el siguiente
			nombre: "",
			nroMatricula: "",
			domicilio: "", //completo
			nroCasillero: "",
			cantidadPatrocinados: 0 //cantidad de partes que patrocina
		}
	},
	reclamados: {
		nombre: "",
		dni: 0,
		cuil: 0,
		domicilio: "", //domicilio + localidad
		nroWhatsapp: "",
		patrocinante: {
			nombre: "",
			nroMatricula: "",
			domicilio: "", //completo
			nroCasillero: "",
			cantidadPatrocinados: 0 //cantidad de partes que patrocina
		}
	}
}
*/

function concatenarNombres(partes){
	let nombres = ""
	partes.forEach((d, i) => {
		if (nombres.trim() === "") {
			nombres = d.nombre
		} else if (i + 1 === partes.length) {
			nombres = nombres + " y " + d.nombre
		} else {
			nombres = nombres + ", " + d.nombre
		}
	});
	return nombres
}

function getReclamo(data) {
	let nombresReclamantes = concatenarNombres(data.reclamantes)
	let nombresReclamados = concatenarNombres(data.reclamados)

	return {
		numero: data.numero,
		rubros: data.rubros,
		resolucion: data.resolucion,
		fechaInicio: {
			dia: String(new Date(data.fechaHoraInicio).getDate()).padStart(2, '0'),
			mes: new Date(data.fechaHoraInicio).toLocaleString('es-AR', { month: 'long' }),
			anio: new Date(data.fechaHoraInicio).getFullYear(),
			hora: String(new Date(data.fechaHoraInicio).getHours()).padStart(2, '0') + ':' +
				  String(new Date(data.fechaHoraInicio).getMinutes()).padStart(2, '0')
		},
		horaFin: data.horaFin?	String(new Date(data.horaFin).getHours()).padStart(2, '0') + ':' +
				  String(new Date(data.horaFin).getMinutes()).padStart(2, '0') : NO_ESPECIFICADO,
		nombresReclamantes: nombresReclamantes,
		nombresReclamados: nombresReclamados
	}
}

function getPartes(partes) {
	let cantidadPatrocinados = 0
	let result = []
	for(let i = 0; i < partes.length; i++) {
		let siguiente = null
		let patrocinante = partes[i].patrocinante
		if (patrocinante !== null) {
			if (i + 1 < partes.length) {
				siguiente = partes[i + 1]
			}
			if (siguiente && (siguiente.patrocinante !== null) && 
					siguiente.patrocinante.nroMatricula === patrocinante.nroMatricula) {
				patrocinante = null
			}
			cantidadPatrocinados++

			const sintetico = partes[i].tipoDocumento.sintetico || "DNI";
			const nroDocumento = partes[i].nroDocumento || NO_ESPECIFICADO
			const cuil = partes[i].cuil || NO_ESPECIFICADO
			const domicilio = partes[i].domicilio;
			const localidad = partes[i].localidad;
			const nroWhatsapp = partes[i].nroWhatsapp || null
	
			const parte = {
				nombre: partes[i].nombre,
				sintetico: sintetico,
				nroDocumento: nroDocumento,
				cuil: cuil,
				domicilio: domicilio,
				localidad: localidad,
				nroWhatsapp: nroWhatsapp,
				patrocinante: !patrocinante? null : {...patrocinante, cantidadPatrocinados: cantidadPatrocinados}
			}
			result.push(parte)
		}
	}

	return result
}


export default function ReportData(data) {
	const result = {
		titulo: `CERTIFICACIÓN DE FRACASO RECLAMO ${data.numero}`,
		...getReclamo(data),
		reclamantes: getPartes(data.reclamantes),
		reclamados: getPartes(data.reclamados),
	}

	console.log(JSON.stringify(result))
	return result
}