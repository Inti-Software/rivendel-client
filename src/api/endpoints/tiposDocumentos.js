import HttpRepository from "../httpRepository";

export const TiposDocumento = new HttpRepository({
  findAll: () => ({ method: "get", url: `/tipdocs` }),
});
