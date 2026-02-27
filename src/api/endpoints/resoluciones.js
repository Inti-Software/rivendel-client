import HttpRepository from "../httpRepository";
import { RECORDS_PER_PAGE } from "../endpoints";

export const Resoluciones = new HttpRepository({
	get: (id) => ({ method: "get", url: `/resoluciones/${id}` }),
	findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
		method: "get",
		url: `/resoluciones`,
		params: {
			page: currentPage || 1,
			limit: recordsPerPage,
		}
	}),
	create: ({ descripcion, detalle }) => ({
		method: "POST",
		url: `/resoluciones`,
		headers: { "Content-Type": "application/json" },
		data: { descripcion, detalle },
	}),
	update: ({ id, descripcion, detalle }) => ({
		method: "PATCH",
		url: `/resoluciones/${id}`,
		headers: { "Content-Type": "application/json" },
		data: { descripcion, detalle },
	}),
	delete: (id) => ({ method: "delete", url: `/resoluciones/${id}` }),
});