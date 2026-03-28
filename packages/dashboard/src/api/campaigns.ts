import { api } from './client';

export interface CampaignData {
  id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused';
  triggers: Array<{
    id: string;
    type: 'event' | 'segment';
    eventName?: string;
    segmentId?: string;
    segment?: { id: string; name: string };
    eventConditions?: Record<string, unknown>;
  }>;
  actions: Array<{
    id: string;
    type: string;
    config: Record<string, unknown>;
    webhookConfig?: {
      url: string;
      method: string;
      headers: Record<string, string>;
      bodyTemplate: string | null;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export async function getCampaigns(appId: string, status?: string) {
  const params: Record<string, string> = { appId };
  if (status) params.status = status;
  const { data } = await api.get<CampaignData[]>('/campaigns', { params });
  return data;
}

export async function getCampaign(id: string) {
  const { data } = await api.get<CampaignData>(`/campaigns/${id}`);
  return data;
}

export async function createCampaign(appId: string, payload: {
  name: string;
  description?: string;
  triggers: Array<{ type: 'event' | 'segment'; eventName?: string; segmentId?: string; eventConditions?: Record<string, unknown> }>;
  actions: Array<{ type: string; config?: Record<string, unknown>; webhookConfig?: Record<string, unknown> }>;
}) {
  const { data } = await api.post<CampaignData>(`/campaigns?appId=${appId}`, payload);
  return data;
}

export async function updateCampaignStatus(id: string, status: string) {
  const { data } = await api.patch<CampaignData>(`/campaigns/${id}/status`, { status });
  return data;
}
