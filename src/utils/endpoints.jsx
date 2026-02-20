import { RECORDS_PER_PAGE } from "./constants";

export const Patrocinantes = {
  get: (id) => ({ method: 'get', url: `/patrocinantes/${id}` }),
  findAll: ({ query, currentPage, recordsPerPage }) => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (currentPage) params.append("page", currentPage);
    if (recordsPerPage) params.append("limit", recordsPerPage);
    return { 
      method: "get", 
      url: `/patrocinantes?${params}`
    };
  },
  create: ({
    nombre,
    nroMatricula,
    domicilio,
    localidad,
    nroCasillero,
  }) => ({
      method: "POST",
      url: `/patrocinantes`,
      headers: { "Content-Type": "application/json" },
      data: {
        nombre,
        nroMatricula,
        domicilio,
        localidad,
        nroCasillero,
      },
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
      data: {
        nombre,
        nroMatricula,
        domicilio,
        localidad,
        nroCasillero,
      },
    }
  ),
  delete: (id) =>({ method: 'delete', url: `/patrocinantes/${id}` }),
};

export const TiposDocumento = {
  get: async (id) => {
    return fetch(`http://localhost:3000/tipdocs/${id}`);
  },  
  findAll: () => ({ method: 'get', url: `/tipdocs` }),
  create: async ({ sintetico, descripcion }) => {
    return fetch(`http://localhost:3000/tipdocs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sintetico, 
        descripcion }),
    });
  },
  update: async ({ id, sintetico, descripcion }) => {
    return fetch(`http://localhost:3000/tipdocs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sintetico, 
        descripcion }),
      });
    },
  delete: (id) => ({ method: "delete", url: `/tipdocs/${id}` })
};

export const Partes = {
  get: async (id) => {
    return fetch(`http://localhost:3000/partes/${id}`);
  },
  findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) =>
    ({ method: "get", url: `/partes?page=${currentPage}&limit=${recordsPerPage}` }),
  create: async ({
    nombre,
    idTipoDocumento,
    nroDocumento,
    cuil,
    domicilio,
    idPatrocinante,
    esApoderado,
    localidad,
  }) => {
    return fetch(`http://localhost:3000/partes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        idTipoDocumento,
        nroDocumento,
        cuil,
        domicilio,
        idPatrocinante,
        esApoderado,
        localidad,
      }),
    });
  },
  update: async ({
    id,
    nombre,
    idTipoDocumento,
    nroDocumento,
    cuil,
    domicilio,
    idPatrocinante,
    esApoderado,
    localidad,
  }) => {
    return fetch(`http://localhost:3000/partes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        idTipoDocumento,
        nroDocumento,
        cuil,
        domicilio,
        idPatrocinante,
        esApoderado,
        localidad,
      }),
    });
  },
  delete: (id) => ({ method: 'delete', url: `/partes/${id}` }),
  search: async ({ q, currentPage, recordsPerPage = RECORDS_PER_PAGE }) => {
    return fetch(`http://localhost:3000/partes/search?q=${q}&page=${currentPage}&limit=${recordsPerPage}`);
  }
};

export const Resoluciones = {
  get: async (id) => {
    return fetch(`http://localhost:3000/resoluciones/${id}`);
  },
  findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => 
    ({ method: "get", url: `/resoluciones?page=${currentPage}&limit=${recordsPerPage}` }),
  create: async ({ descripcion, detalle }) => {
    return fetch(`http://localhost:3000/resoluciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descripcion,
        detalle,
      }),
    });
  },
  update: async ({ id, descripcion, detalle }) => {
    return fetch(`http://localhost:3000/resoluciones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descripcion,
        detalle,
      }),
    });
  },
  delete: (id) =>
    ({ method: 'delete', url: `/resoluciones/${id}` }),
};

export const Reclamos = {
  get: async (id) => {
    return fetch(`http://localhost:3000/reclamos/${id}`);
  },
  findAll: ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) =>
    ({ method: "get", url: `/reclamos?page=${currentPage}&limit=${recordsPerPage}` }),
  create: async ({
    numero,
    rubros,
    idResolucion,
    fechaHoraInicio,
    pospuesto,
    horaFin,
    proxFecha,
    reclamantes,
    reclamados
  }) => {
    return fetch(`http://localhost:3000/reclamos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero,
        rubros,
        idResolucion,
        fechaHoraInicio,
        pospuesto,
        horaFin,
        proxFecha,
        reclamantes,
        reclamados
      }),
    });
  },
  update: async ({
    id,
    numero,
    rubros,
    idResolucion,
    fechaHoraInicio,
    horaFin,
    reclamantes,
    reclamados
  }) => {
    return fetch(`http://localhost:3000/reclamos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        numero,
        rubros,
        idResolucion,
        fechaHoraInicio,
        horaFin,
        reclamantes,
        reclamados
      }),
    });
  },
  delete: (id) => ({ method: 'delete', url: `http://localhost:3000/reclamos/${id}` }),
};
