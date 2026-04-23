import { NO_ESPECIFICADO } from "../../Shared/constants";

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
	const unidades = [
		"", "", "dos", "tres", "cuatro", 
		"cinco", "seis", "siete", "ocho", "nueve"
	];
	let nombresReclamantes = concatenarNombres(data.reclamantes)
	let nombresReclamados = concatenarNombres(data.reclamados)

	return {
		numero: data.numero,
		rubros: data.rubros,
		idResolucion: data.idResolucion,
		fechaInicio: {
			dia: String(new Date(data.fechaHoraInicio).getDate()).padStart(2, '0'),
			mes: new Date(data.fechaHoraInicio).toLocaleString('es-AR', { month: 'long' }),
			anio: new Date(data.fechaHoraInicio).getFullYear(),
			hora: String(new Date(data.fechaHoraInicio).getHours()).padStart(2, '0') + ':' +
				  String(new Date(data.fechaHoraInicio).getMinutes()).padStart(2, '0')
		},
		horaFin: data.horaFin?	String(new Date(data.horaFin).getHours()).padStart(2, '0') + ':' +
				  String(new Date(data.horaFin).getMinutes()).padStart(2, '0') : NO_ESPECIFICADO,
		proximaAudiencia: data.proximaAudiencia? {
			dia: String(new Date(data.proximaAudiencia).getDate()).padStart(2, '0'),
			mes: new Date(data.proximaAudiencia).toLocaleString('es-AR', { month: 'long' }),
			anio: new Date(data.proximaAudiencia).getFullYear(),
			hora: String(new Date(data.proximaAudiencia).getHours()).padStart(2, '0') + ':' +
				  String(new Date(data.proximaAudiencia).getMinutes()).padStart(2, '0')
		} : null,
		nombresReclamantes: nombresReclamantes,
		nombresReclamados: nombresReclamados,
		cantidad: unidades[data.cantidad]
	}
}

function getPartes(partes) {
	let result = []
	for(let i = 0; i < partes.length; i++) {
		let siguiente = null
		let patrocinante = partes[i].patrocinante
		if (patrocinante) {
			if (i + 1 < partes.length) {
				siguiente = partes[i + 1]
			}
			if (!!siguiente?.patrocinante && 
					siguiente.patrocinante.nroMatricula === patrocinante.nroMatricula) {
				patrocinante = null
			}
		}

		const sintetico = partes[i].tipoDocumento.sintetico;
		const nroDocumento = partes[i].nroDocumento || NO_ESPECIFICADO
		const cuil = partes[i].cuil || NO_ESPECIFICADO
		const domicilio = partes[i].domicilio;
		const localidad = partes[i].localidad;
		const nroWhatsappParte = partes[i].nroWhatsappParte || null
		const nroWhatsappPatrocinante = partes[i].nroWhatsappPatrocinante || null
		const postergo = partes[i].postergo || false
		const incomparendo = partes[i].incomparendo || false
		const multado = partes[i].multado || false

		if (patrocinante) {
			patrocinante.domicilio = patrocinante?.domicilio || NO_ESPECIFICADO
			patrocinante.localidad = patrocinante?.localidad || NO_ESPECIFICADO
			patrocinante.nroCasillero = patrocinante?.nroCasillero || NO_ESPECIFICADO
		}

		const parte = {
			nombre: partes[i].nombre,
			sintetico: sintetico,
			nroDocumento: nroDocumento,
			cuil: cuil,
			domicilio: domicilio,
			localidad: localidad,
			nroWhatsappParte: nroWhatsappParte,
			nroWhatsappPatrocinante: nroWhatsappPatrocinante,
			patrocinante: patrocinante,
			esApoderado: partes[i].esApoderado,
			postergo: postergo,
			incomparendo: incomparendo,
			multado: multado
		}
		result.push(parte)
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

	return result
}