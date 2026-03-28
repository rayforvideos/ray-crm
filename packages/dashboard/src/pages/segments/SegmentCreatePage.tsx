import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { createSegment } from '@/api/segments';
import { SegmentConditionBuilder } from '@/components/SegmentConditionBuilder';

export function SegmentCreatePage() {
  const appId = useAuthStore((s) => s.appId);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [operator, setOperator] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<Array<{ field: string; op: string; value: string }>>([]);

  const mutation = useMutation({
    mutationFn: () => createSegment(appId!, { name, conditions: { operator, conditions } }),
    onSuccess: () => navigate('/segments'),
  });

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>New Segment</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input placeholder="Segment name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db', width: '100%' }} />
        <SegmentConditionBuilder conditions={conditions} operator={operator} onOperatorChange={setOperator} onConditionsChange={setConditions} />
        <button onClick={() => mutation.mutate()} disabled={!name || conditions.length === 0 || mutation.isPending} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, alignSelf: 'flex-start' }}>
          {mutation.isPending ? 'Creating...' : 'Create Segment'}
        </button>
      </div>
    </div>
  );
}
