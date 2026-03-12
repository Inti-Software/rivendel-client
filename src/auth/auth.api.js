import axios from "axios";
import { http } from "../api/http";

export async function login(email, password) {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });
    const { data } = response;
    return { data: data };
  } catch {
    return { error: true };
  }
}

export async function refresh() {
  const res = await http({ method: "post", url: "/auth/refresh" });
  return res.data;
}

export async function logout() {
  await http.post("/auth/logout");
}
