import HttpRepository from "../httpRepository";
import { RECORDS_PER_PAGE } from "../constants";

export const Patrocinantes = new HttpRepository({
  get: (id) => ({ method: "get", url: `/patrocinantes/${id}` }),
  findAll: ({ query, currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
    method: "get",
    url: `/patrocinantes`,
    params: {
      query,
      page: currentPage || 1,
      limit: recordsPerPage,
    },
  }),
  create: ({ nombre, nroMatricula, domicilio, localidad, nroCasillero }) => ({
    method: "POST",
    url: `/patrocinantes`,
    headers: { "Content-Type": "application/json" },
    data: { nombre, nroMatricula, domicilio, localidad, nroCasillero },
  }),
  update: ({ id, nombre, nroMatricula, domicilio, localidad, nroCasillero, }) => ({
    method: "PATCH",
    url: `/patrocinantes/${id}`,
    headers: { "Content-Type": "application/json" },
    data: { nombre, nroMatricula, domicilio, localidad, nroCasillero },
  }),
  delete: (id) => ({ method: "delete", url: `/patrocinantes/${id}` }),
});
