export default function ReportData(data) {
	let reclamante = "";
	if (data.reclamantes && data.reclamantes.length > 1) {
		reclamante = data.reclamantes.slice(0, data.reclamantes.length - 1).map(r => r.nombre).join(', ') +
		" y " + data.reclamantes[data.reclamantes.length -1].nombre;
	} else {
		reclamante = data.reclamantes?.length === 1 ? data.reclamantes[0].nombre : "No especificado";
	}

	return {
		titulo: `CERTIFICACIÓN DE FRACASO RECLAMO ${data.numero}`,
		reclamante: reclamante,
	}
}