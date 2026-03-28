import { api } from './client';

export interface SegmentData {
  id: string;
  name: string;
  conditions: {
    operator: 'AND' | 'OR';
    conditions: Array<{ field: string; op: string; value: unknown }>;
  };
  createdAt: string;
}

export async function getSegments(appId: string) {
  const { data } = await api.get<SegmentData[]>('/segments', { params: { appId } });
  return data;
}

export async function createSegment(appId: string, payload: { name: string; conditions: SegmentData['conditions'] }) {
  const { data } = await api.post<SegmentData>(`/segments?appId=${appId}`, payload);
  return data;
}

export async function getSegmentCount(id: string, appId: string) {
  const { data } = await api.get<{ count: number }>(`/segments/${id}/count`, { params: { appId } });
  return data;
}
