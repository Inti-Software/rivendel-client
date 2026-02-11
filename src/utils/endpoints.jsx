import { RECORDS_PER_PAGE } from "./constants";
import { http } from "../api/http.js";

export const Patrocinantes = {
  get: async (id) => {
    return fetch(`http://localhost:3000/patrocinantes/${id}`);
  },
  findAll: async ({ query, currentPage, recordsPerPage }) => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (currentPage) params.append("page", currentPage);
    if (recordsPerPage) params.append("limit", recordsPerPage);
    return fetch(
      `http://localhost:3000/patrocinantes?${params}`
    );
  },
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
  findAll: async () => {
    return fetch(`http://localhost:3000/tipdocs`);
  },
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
  delete: async (id) =>
    fetch(`http://localhost:3000/partes/${id}`, {
      method: "DELETE",
    }),
  search: async ({ q, currentPage, recordsPerPage = RECORDS_PER_PAGE }) => {
    return fetch(`http://localhost:3000/partes/search?q=${q}&page=${currentPage}&limit=${recordsPerPage}`);
  }
};

export const Resoluciones = {
  get: async (id) => {
    return fetch(`http://localhost:3000/resoluciones/${id}`);
  },
  findAll: async ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) => {
    console.log("Fetching resoluciones with page:", currentPage, "and limit:", recordsPerPage);
    return http.get(
      `/resoluciones?page=${currentPage}&limit=${recordsPerPage}`
    )
  },
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
  delete: async (id) =>
    fetch(`http://localhost:3000/resoluciones/${id}`, {
      method: "DELETE",
    }),
};

export const Reclamos = {
  get: async (id) => {
    return fetch(`http://localhost:3000/reclamos/${id}`);
  },
  findAll: async ({ currentPage, recordsPerPage = RECORDS_PER_PAGE }) =>
    fetch(
      `http://localhost:3000/reclamos?page=${currentPage}&limit=${recordsPerPage}`
    ),
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
  delete: async (id) =>
    fetch(`http://localhost:3000/reclamos/${id}`, {
      method: "DELETE",
    }),
};
