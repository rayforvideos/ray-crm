import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getApps, createApp } from '@/api/apps';

export function SettingsPage() {
  const { appId, setAppId } = useAuthStore();
  const queryClient = useQueryClient();
  const [newAppName, setNewAppName] = useState('');

  const { data: apps } = useQuery({ queryKey: ['apps'], queryFn: getApps });

  const createMutation = useMutation({
    mutationFn: () => createApp(newAppName),
    onSuccess: (app) => { queryClient.invalidateQueries({ queryKey: ['apps'] }); setAppId(app.id); setNewAppName(''); },
  });

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Settings</h2>
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Active App</h3>
      {apps && apps.length > 0 ? (
        <select value={appId ?? ''} onChange={(e) => setAppId(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db', width: '100%', marginBottom: 16 }}>
          <option value="">Select app...</option>
          {apps.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}
        </select>
      ) : (
        <p style={{ color: '#6b7280', marginBottom: 16 }}>No apps yet. Create one below.</p>
      )}
      {appId && apps && (
        <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8, marginBottom: 24 }}>
          <p style={{ fontSize: 14 }}><strong>App Key:</strong> <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: 4 }}>{apps.find((a) => a.id === appId)?.appKey}</code></p>
        </div>
      )}
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Create New App</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="App name" value={newAppName} onChange={(e) => setNewAppName(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db', flex: 1 }} />
        <button onClick={() => createMutation.mutate()} disabled={!newAppName || createMutation.isPending} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Create</button>
      </div>
    </div>
  );
}
