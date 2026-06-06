import HttpRepository from "../httpRepository";

export const Users = new HttpRepository({
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
