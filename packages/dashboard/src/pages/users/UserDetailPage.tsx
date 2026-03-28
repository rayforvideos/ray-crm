import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/users';
import { getEventsByUser } from '@/api/events';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user } = useQuery({ queryKey: ['user', id], queryFn: () => getUser(id!), enabled: !!id });
  const { data: eventsData } = useQuery({ queryKey: ['events-by-user', id], queryFn: () => getEventsByUser(id!), enabled: !!id });
  if (!user) return <p>Loading...</p>;
  const [events] = eventsData ?? [[]];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{user.externalId}</h2>
      <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Properties</h3>
        <pre style={{ fontSize: 12 }}>{JSON.stringify(user.properties, null, 2)}</pre>
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>First seen: {user.firstSeenAt ? new Date(user.firstSeenAt).toLocaleString() : '-'} | Last seen: {user.lastSeenAt ? new Date(user.lastSeenAt).toLocaleString() : '-'}</p>
      </div>
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Event Timeline</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {events.map((e) => (
          <div key={e.id} style={{ padding: 12, background: '#f9fafb', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
            <div><span style={{ fontWeight: 500 }}>{e.name}</span><span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>{JSON.stringify(e.properties)}</span></div>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{new Date(e.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
