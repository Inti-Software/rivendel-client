import HttpRepository from "../httpRepository";
import { RECORDS_PER_PAGE } from "../endpoints";

export const Partes = new HttpRepository({
	get: (id) => ({ method: "get", url: `/partes/${id}` }),
	findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
		method: "get",
		url: `/partes`,
		params: {
			page: currentPage || 1,
			limit: recordsPerPage,
		}
	}),
	create: ({ nombre, idTipoDocumento, nroDocumento, cuil, domicilio, idPatrocinante,
		esApoderado, localidad }) => ({
			method: "POST",
			url: `/partes`,
			headers: { "Content-Type": "application/json" },
			data: { nombre, idTipoDocumento, nroDocumento, cuil, domicilio, idPatrocinante,
				esApoderado, localidad },
		}),
	update: ({ id, nombre, idTipoDocumento, nroDocumento, cuil, domicilio, idPatrocinante,
		esApoderado, localidad }) => ({
			method: "PATCH",
			url: `/partes/${id}`,
			headers: { "Content-Type": "application/json" },
			data: { nombre, idTipoDocumento, nroDocumento, cuil, domicilio, idPatrocinante,
				esApoderado, localidad },
		}),
	delete: (id) => ({ method: "delete", url: `/partes/${id}` }),
	search: ({ q, currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
		method: "get",
		url: `/partes/search?q=${q}&page=${currentPage}&limit=${recordsPerPage}`,
	}),
});
