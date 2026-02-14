import { http } from '../api/http';

export async function login(email, password) {
  const res = await http.post('/auth/login', { email, password });
  const { accessToken } = await res.data;
  console.log("Login response:", accessToken);
  return res.data;
}

export async function refresh() {
  const res = await http.post('/auth/refresh');
  return res.data; // accessToken
}

export async function logout() {
  await http.post('/auth/logout');
}
