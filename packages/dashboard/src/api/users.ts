import { api } from './client';

export interface UserData {
  id: string;
  externalId: string;
  properties: Record<string, unknown>;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  createdAt: string;
}

export async function getUsers(appId: string, page = 1) {
  const { data } = await api.get<[UserData[], number]>('/users', { params: { appId, page } });
  return data;
}

export async function getUser(id: string) {
  const { data } = await api.get<UserData>(`/users/${id}`);
  return data;
}
