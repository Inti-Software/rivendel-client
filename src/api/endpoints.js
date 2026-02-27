import HttpRepository from "./httpRepository";

export const RECORDS_PER_PAGE = 15;

export const ACTION_CREATE = "create";

export const ACTION_UPDATE = "update";

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
