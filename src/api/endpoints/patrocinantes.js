import { HttpRepository } from "../httpRepository";

export const Patrocinantes = new HttpRepository({
	get: (id) => ({ method: "get", url: `/patrocinantes/${id}` }),
	findAll: ({ query, currentPage, recordsPerPage }) => {
		const params = new URLSearchParams();
		if (query) params.append("query", query);
		if (currentPage) params.append("page", currentPage);
		if (recordsPerPage) params.append("limit", recordsPerPage);
		return {
			method: "get",
			url: `/patrocinantes?${params}`,
		};
	},
	create: ({ nombre, nroMatricula, domicilio, localidad, nroCasillero }) => ({
		method: "POST",
		url: `/patrocinantes`,
		headers: { "Content-Type": "application/json" },
		data: { nombre, nroMatricula, domicilio, localidad, nroCasillero },
	}),
	update: ({
		id,
		nombre,
		nroMatricula,
		domicilio,
		localidad,
		nroCasillero,
	}) => ({
		method: "PATCH",
		url: `/patrocinantes/${id}`,
		headers: { "Content-Type": "application/json" },
		data: { nombre, nroMatricula, domicilio, localidad, nroCasillero },
	}),
	delete: (id) => ({ method: "delete", url: `/patrocinantes/${id}` }),
});