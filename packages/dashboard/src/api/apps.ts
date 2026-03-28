import { api } from './client';

export interface AppData {
  id: string;
  name: string;
  appKey: string;
  createdAt: string;
}

export async function getApps() {
  const { data } = await api.get<AppData[]>('/apps');
  return data;
}

export async function createApp(name: string) {
  const { data } = await api.post<AppData>('/apps', { name });
  return data;
}
