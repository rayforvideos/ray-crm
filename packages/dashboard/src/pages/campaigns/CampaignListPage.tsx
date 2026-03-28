import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { getCampaigns, updateCampaignStatus } from '@/api/campaigns';

export function CampaignListPage() {
  const appId = useAuthStore((s) => s.appId);
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', appId],
    queryFn: () => getCampaigns(appId!),
    enabled: !!appId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateCampaignStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = { draft: '#6b7280', active: '#22c55e', paused: '#f59e0b' };
    return (
      <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, color: 'white', background: colors[status] ?? '#6b7280' }}>
        {status}
      </span>
    );
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Campaigns</h2>
        <Link to="/campaigns/new" style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
          + New Campaign
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Triggers</th>
            <th style={{ padding: 8 }}>Actions</th>
            <th style={{ padding: 8 }}>Controls</th>
          </tr>
        </thead>
        <tbody>
          {campaigns?.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: 8 }}><Link to={`/campaigns/${c.id}`} style={{ color: '#3b82f6' }}>{c.name}</Link></td>
              <td style={{ padding: 8 }}>{statusBadge(c.status)}</td>
              <td style={{ padding: 8 }}>{c.triggers.length}</td>
              <td style={{ padding: 8 }}>{c.actions.length}</td>
              <td style={{ padding: 8 }}>
                {c.status === 'draft' && (
                  <button onClick={() => statusMutation.mutate({ id: c.id, status: 'active' })} style={{ padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 4 }}>Activate</button>
                )}
                {c.status === 'active' && (
                  <button onClick={() => statusMutation.mutate({ id: c.id, status: 'paused' })} style={{ padding: '4px 8px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Pause</button>
                )}
                {c.status === 'paused' && (
                  <button onClick={() => statusMutation.mutate({ id: c.id, status: 'active' })} style={{ padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Resume</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
