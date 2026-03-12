import HttpRepository from "../httpRepository";

export const Users = new HttpRepository({
	get: () => ({ method: "get", url: `/users/getCurrent` }),
	update: ({
		nombre,
		currentPassword,
		newPassword,
		passwordConfirmation
	}) => ({
		method: "PATCH",
		url: `/users`,
		headers: { "Content-Type": "application/json" },
		data: { nombre, currentPassword, newPassword, passwordConfirmation },
	})
});
