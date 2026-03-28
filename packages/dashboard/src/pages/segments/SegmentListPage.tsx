import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { getSegments } from '@/api/segments';

export function SegmentListPage() {
  const appId = useAuthStore((s) => s.appId);
  const { data: segments, isLoading } = useQuery({
    queryKey: ['segments', appId],
    queryFn: () => getSegments(appId!),
    enabled: !!appId,
  });
  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Segments</h2>
        <Link to="/segments/new" style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>+ New Segment</Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}><th style={{ padding: 8 }}>Name</th><th style={{ padding: 8 }}>Conditions</th><th style={{ padding: 8 }}>Created</th></tr></thead>
        <tbody>
          {segments?.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: 8, fontWeight: 500 }}>{s.name}</td>
              <td style={{ padding: 8 }}>{s.conditions.conditions.length} conditions ({s.conditions.operator})</td>
              <td style={{ padding: 8 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
