import { api } from './client';

export async function login(username: string, password: string) {
  const { data } = await api.post<{ accessToken: string }>('/auth/login', {
    username,
    password,
  });
  return data;
}
