import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getEvents } from '@/api/events';

export function EventListPage() {
  const appId = useAuthStore((s) => s.appId);
  const { data, isLoading } = useQuery({ queryKey: ['events', appId], queryFn: () => getEvents(appId!), enabled: !!appId, refetchInterval: 5000 });
  if (isLoading) return <p>Loading...</p>;
  const [events, total] = data ?? [[], 0];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Events ({total})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}><th style={{ padding: 8 }}>Event</th><th style={{ padding: 8 }}>User</th><th style={{ padding: 8 }}>Properties</th><th style={{ padding: 8 }}>Time</th></tr></thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: 8, fontWeight: 500 }}>{e.name}</td>
              <td style={{ padding: 8, color: '#3b82f6' }}>{e.user?.externalId ?? e.userId.slice(0, 8)}</td>
              <td style={{ padding: 8, fontSize: 12, color: '#6b7280' }}>{JSON.stringify(e.properties).slice(0, 60)}</td>
              <td style={{ padding: 8, fontSize: 12 }}>{new Date(e.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
