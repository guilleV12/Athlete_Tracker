import api from "./api";

export async function loginRequest({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function registerRequest({ name, email, password }) {
  await api.post("/auth/register", { name, email, password });
}

export async function registerAndLogin({ name, email, password }) {
  await registerRequest({ name, email, password });
  return loginRequest({ email, password });
}

export async function forgotPasswordRequest({ email }) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPasswordRequest({ token, password }) {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
}
