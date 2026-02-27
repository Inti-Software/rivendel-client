import HttpRepository from "../httpRepository";

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
