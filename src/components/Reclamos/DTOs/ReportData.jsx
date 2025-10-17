export default function ReportData(data) {
	const getNombreParte = (partes) => {
		let nombre = "";
		if (partes && partes.length > 1) {
			nombre = partes.slice(0, partes.length - 1).map(r => r.nombre).join(', ') +
			" y " + partes[partes.length -1].nombre;
		} else {
			nombre = partes?.length === 1 ? partes[0].nombre : "No especificado";
		}
		return nombre;
	}

	let reclamante = getNombreParte(data.reclamantes);
	let reclamado = getNombreParte(data.reclamados);

	return {
		titulo: `CERTIFICACIÓN DE FRACASO RECLAMO ${data.numero}`,
		reclamante: reclamante,
		reclamado: reclamado
	}
}