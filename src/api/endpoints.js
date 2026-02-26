import { HttpRepository } from "./httpRepository";

export const RECORDS_PER_PAGE = 15;

export const ACTION_CREATE = "create";

export const ACTION_UPDATE = "update";

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

export const TiposDocumento = new HttpRepository({
  get: (id) => ({ method: "get", url: `/tipdocs/${id}` }),
  findAll: () => ({ method: "get", url: `/tipdocs` }),
  create: ({ sintetico, descripcion }) => ({
    method: "POST",
    url: `/tipdocs`,
    headers: { "Content-Type": "application/json" },
    data: { sintetico, descripcion },
  }),
  update: ({ id, sintetico, descripcion }) => ({
    method: "PATCH",
    url: `/tipdocs/${id}`,
    headers: { "Content-Type": "application/json" },
    data: { sintetico, descripcion },
  }),
  delete: (id) => ({ method: "delete", url: `/tipdocs/${id}` }),
});

export const Partes = new HttpRepository({
  get: (id) => ({ method: "get", url: `/partes/${id}` }),
  findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
    method: "get",
    url: `/partes?page=${currentPage}&limit=${recordsPerPage}`,
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

export const Resoluciones = new HttpRepository({
  get: (id) => ({ method: "get", url: `/resoluciones/${id}` }),
  findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
    method: "get",
    url: `/resoluciones?page=${currentPage}&limit=${recordsPerPage}`,
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

export const Reclamos = new HttpRepository({
  get: (id) => ({ method: "get", url: `/reclamos/${id}` }),
  findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => ({
    method: "get",
    url: `/reclamos?page=${currentPage}&limit=${recordsPerPage}`,
  }),
  create: ({ numero, rubros, idResolucion, fechaHoraInicio, pospuesto,
    horaFin, proxFecha, reclamantes, reclamados }) => ({
      method: "POST",
      url: `/reclamos`,
      headers: { "Content-Type": "application/json" },
      data: { numero, rubros, idResolucion, fechaHoraInicio, pospuesto,
        horaFin, proxFecha, reclamantes, reclamados },
    }),
  update: ({ id, numero, rubros, idResolucion, fechaHoraInicio, horaFin, 
    reclamantes, reclamados }) => ({
      method: "PATCH",
      url: `/reclamos/${id}`,
      headers: { "Content-Type": "application/json" },
      data: { id, numero, rubros, idResolucion, fechaHoraInicio, horaFin, 
        reclamantes, reclamados },
    }),
  delete: (id) => ({ method: "delete", url: `/reclamos/${id}` }),
});
