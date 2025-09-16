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
  findAll: async (currentPage) =>
    fetch(
      `http://localhost:3000/tipdocs?page=${currentPage}&limit=${RECORDS_PER_PAGE}`
    ),
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
    domicilio,
    idPatrocinante,
    nroWhatsapp,
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
        nroWhatsapp,
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
    nroWhatsapp,
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
        nroWhatsapp,
        localidad,
      }),
    });
  },
  delete: async (id) =>
    fetch(`http://localhost:3000/partes/${id}`, {
      method: "DELETE",
    }),
};

export const Resoluciones = {
  get: async (id) => {
    return fetch(`http://localhost:3000/resoluciones/${id}`);
  },
  findAll: async ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) =>
    fetch(
      `http://localhost:3000/resoluciones?page=${currentPage}&limit=${recordsPerPage}`
    ),
  create: async ({
    descripcion,
    detalle,
  }) => {
    return fetch(`http://localhost:3000/resoluciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descripcion,
        detalle,
      }),
    });
  },
  update: async ({
    id,
    descripcion,
    detalle,
  }) => {
    return fetch(`http://localhost:3000/resoluciones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descripcion,
        detalle,
      }),
    });
  },
  delete: async (id) =>
    fetch(`http://localhost:3000/resoluciones/${id}`, {
      method: "DELETE",
    }),
};
