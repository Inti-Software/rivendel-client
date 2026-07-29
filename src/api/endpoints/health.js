import HttpRepository from "../httpRepository";

export const Health = new HttpRepository({
	get: () => ({ method: "GET", url: `/health` }),
});
