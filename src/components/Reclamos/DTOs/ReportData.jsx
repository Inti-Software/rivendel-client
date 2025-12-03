export default function ReportData(data) {
	const getNombreParte = (partes) => {
		let nombre = "";
		if (partes && partes.length > 1) {
			nombre = partes.slice(0, partes.length - 1).map(r => r.nombre).join(', ') +
			" y " + partes[partes.length -1].nombre;
		} else {
			nombre = partes?.length === 1 ? partes[0].nombre : "No especificado";
		}
		return {...partes[0], nombre: nombre};
	}

	let reclamante = getNombreParte(data.reclamantes);
	let reclamado = getNombreParte(data.reclamados);

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