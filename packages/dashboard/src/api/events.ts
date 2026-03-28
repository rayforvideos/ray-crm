import { api } from './client';

export interface EventData {
  id: string;
  userId: string;
  name: string;
  properties: Record<string, unknown>;
  timestamp: string;
  user?: { externalId: string };
}

export async function getEvents(appId: string, page = 1) {
  const { data } = await api.get<[EventData[], number]>('/events', { params: { appId, page } });
  return data;
}

export async function getEventsByUser(userId: string, page = 1) {
  const { data } = await api.get<[EventData[], number]>('/events/by-user', { params: { userId, page } });
  return data;
}
