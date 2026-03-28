import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getCampaigns } from '@/api/campaigns';
import { getEvents } from '@/api/events';
import { getUsers } from '@/api/users';

export function HomePage() {
  const appId = useAuthStore((s) => s.appId);

  const { data: campaigns } = useQuery({
    queryKey: ['campaigns', appId],
    queryFn: () => getCampaigns(appId!),
    enabled: !!appId,
  });

  const { data: eventsData } = useQuery({
    queryKey: ['events', appId],
    queryFn: () => getEvents(appId!),
    enabled: !!appId,
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', appId],
    queryFn: () => getUsers(appId!),
    enabled: !!appId,
  });

  if (!appId) {
    return <p>Settings에서 앱을 먼저 설정해주세요.</p>;
  }

  const activeCampaigns = campaigns?.filter((c) => c.status === 'active').length ?? 0;
  const totalEvents = eventsData?.[1] ?? 0;
  const totalUsers = usersData?.[1] ?? 0;

  const stats = [
    { label: 'Active Campaigns', value: activeCampaigns },
    { label: 'Total Events', value: totalEvents },
    { label: 'Total Users', value: totalUsers },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: 24,
              background: '#f9fafb',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
