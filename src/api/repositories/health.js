import BaseRepository from "./base-repository";

export const Health = new BaseRepository({
	get: () => ({ method: "GET", url: `/health` }),
});
