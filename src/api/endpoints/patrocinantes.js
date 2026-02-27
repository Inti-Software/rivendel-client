import HttpRepository from "../httpRepository";

export const Patrocinantes = new HttpRepository({
  get: (id) => ({ method: "get", url: `/patrocinantes/${id}` }),
  findAll: (params) => ({
    method: "get",
    url: `/patrocinantes`,
    params: {
      query: params.query,
      page: params.currentPage || 1,
      limit: params.recordsPerPage,
    },
  }),
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
