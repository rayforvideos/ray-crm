import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { getUsers } from '@/api/users';

export function UserListPage() {
  const appId = useAuthStore((s) => s.appId);
  const { data, isLoading } = useQuery({ queryKey: ['users', appId], queryFn: () => getUsers(appId!), enabled: !!appId });
  if (isLoading) return <p>Loading...</p>;
  const [users, total] = data ?? [[], 0];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Users ({total})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}><th style={{ padding: 8 }}>External ID</th><th style={{ padding: 8 }}>Properties</th><th style={{ padding: 8 }}>Last Seen</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: 8 }}><Link to={`/users/${u.id}`} style={{ color: '#3b82f6' }}>{u.externalId}</Link></td>
              <td style={{ padding: 8, fontSize: 12, color: '#6b7280' }}>{JSON.stringify(u.properties).slice(0, 80)}</td>
              <td style={{ padding: 8 }}>{u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
