import { RECORDS_PER_PAGE } from "./constants";

export const Patrocinantes = {
  get: async (id) => {
    return fetch(`http://localhost:3000/patrocinantes/${id}`);
  },
  findAll: async ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) =>
    fetch(
      `http://localhost:3000/patrocinantes?page=${currentPage}&limit=${recordsPerPage}`
    ),
  create: async ({
    nombre,
    nroMatricula,
    domicilio,
    localidad,
    nroCasillero,
  }) => {
    return fetch(`http://localhost:3000/patrocinantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        nroMatricula,
        domicilio,
        localidad,
        nroCasillero,
      }),
    });
  },
  update: async ({
    id,
    nombre,
    nroMatricula,
    domicilio,
    localidad,
    nroCasillero,
  }) => {
    return fetch(`http://localhost:3000/patrocinantes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        nroMatricula,
        domicilio,
        localidad,
        nroCasillero,
      }),
    });
  },
  delete: async (id) =>
    fetch(`http://localhost:3000/patrocinantes/${id}`, {
      method: "DELETE",
    }),
};

export const TiposDocumento = {
  get: async (id) => {
    return fetch(`http://localhost:3000/tipdocs/${id}`);
  },
  findAll: async (currentPage) => {
    let filter = ""
    if (currentPage) {
      filter += `?page=${currentPage}&limit=${RECORDS_PER_PAGE}`
    }
    return fetch(`http://localhost:3000/tipdocs` + filter);
  },
  create: async ({ sintetico, descripcion }) => {
    return fetch(`http://localhost:3000/tipdocs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sintetico, descripcion }),
    });
  },
  update: async ({ id, sintetico, descripcion }) => {
    return fetch(`http://localhost:3000/tipdocs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sintetico, descripcion }),
    });
  },
  delete: async (id) =>
    fetch(`http://localhost:3000/tipdocs/${id}`, {
      method: "DELETE",
    }),
};

export const Partes = {
  get: async (id) => {
    return fetch(`http://localhost:3000/partes/${id}`);
  },
  findAll: async ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) =>
    fetch(
      `http://localhost:3000/partes?page=${currentPage}&limit=${recordsPerPage}`
    ),
  create: async ({
    nombre,
    idTipoDocumento,
    nroDocumento,
    cuil,
    idPatrocinante,
    nroWhatsapp,
    localidad,
  }) => {
    return fetch(`http://localhost:3000/parte`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        idTipoDocumento,
        nroDocumento,
        cuil,
        idPatrocinante,
        nroWhatsapp,
        localidad,
      }),
    });
  },
  update: async ({
    id,
    nombre,
    nroMatricula,
    domicilio,
    localidad,
    nroCasillero,
  }) => {
    return fetch(`http://localhost:3000/patrocinantes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        nroMatricula,
        domicilio,
        localidad,
        nroCasillero,
      }),
    });
  },
  delete: async (id) =>
    fetch(`http://localhost:3000/patrocinantes/${id}`, {
      method: "DELETE",
    }),
};
