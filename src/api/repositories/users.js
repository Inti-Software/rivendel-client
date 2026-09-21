import BaseRepository from "./base-repository";

export const Users = new BaseRepository({
	get: () => ({ method: "GET", url: `/users` }),
	update: ({
		nombre,
		nroHabilitacion,
		currentPassword,
		newPassword,
		passwordConfirmation
	}) => ({
		method: "PATCH",
		url: `/users`,
		headers: { "Content-Type": "application/json" },
		data: { nombre, nroHabilitacion, currentPassword, newPassword, passwordConfirmation },
	})
});
