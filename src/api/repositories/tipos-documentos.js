import BaseRepository from "./base-repository";

export const TiposDocumento = new BaseRepository({
  findAll: () => ({ method: "get", url: `/tipdocs` }),
});
