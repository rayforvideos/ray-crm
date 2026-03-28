import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCampaign } from '@/api/campaigns';

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => getCampaign(id!),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!campaign) return <p>Campaign not found.</p>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{campaign.name}</h2>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>{campaign.description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Triggers</h3>
          {campaign.triggers.map((t) => (
            <div key={t.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{t.type}: </span>
              {t.type === 'event' ? t.eventName : t.segment?.name}
            </div>
          ))}
        </div>
        <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Actions</h3>
          {campaign.actions.map((a) => (
            <div key={a.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{a.type}</span>
              <pre style={{ fontSize: 11, marginTop: 4, background: '#e5e7eb', padding: 8, borderRadius: 4, overflow: 'auto' }}>{JSON.stringify(a.config, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
