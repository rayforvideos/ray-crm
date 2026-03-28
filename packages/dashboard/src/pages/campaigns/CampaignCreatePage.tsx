import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { createCampaign } from '@/api/campaigns';
import { getSegments } from '@/api/segments';
import { ActionConfigForm } from '@/components/ActionConfigForm';

type Step = 'info' | 'trigger' | 'action' | 'confirm';

const inputStyle: React.CSSProperties = { padding: 8, borderRadius: 6, border: '1px solid #d1d5db', width: '100%' };
const btnStyle: React.CSSProperties = { padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 };

export function CampaignCreatePage() {
  const appId = useAuthStore((s) => s.appId);
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('info');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'event' | 'segment'>('event');
  const [eventName, setEventName] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [actionType, setActionType] = useState('inapp_toast');
  const [actionConfig, setActionConfig] = useState<Record<string, unknown>>({});

  const { data: segments } = useQuery({
    queryKey: ['segments', appId],
    queryFn: () => getSegments(appId!),
    enabled: !!appId,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const triggers = [{ type: triggerType, ...(triggerType === 'event' ? { eventName } : { segmentId }) }];
      const isWebhook = actionType === 'webhook';
      const actions = [{
        type: actionType,
        config: isWebhook ? {} : actionConfig,
        ...(isWebhook ? {
          webhookConfig: {
            url: actionConfig.url,
            method: actionConfig.method ?? 'POST',
            headers: actionConfig.headers ? JSON.parse(actionConfig.headers as string) : {},
            bodyTemplate: actionConfig.bodyTemplate,
          },
        } : {}),
      }];
      return createCampaign(appId!, { name, description, triggers, actions });
    },
    onSuccess: (data) => navigate(`/campaigns/${data.id}`),
  });

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>New Campaign</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['info', 'trigger', 'action', 'confirm'] as Step[]).map((s) => (
          <div key={s} style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: step === s ? 700 : 400, background: step === s ? '#3b82f6' : '#e5e7eb', color: step === s ? 'white' : '#6b7280' }}>{s}</div>
        ))}
      </div>

      {step === 'info' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="Campaign name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
          <button onClick={() => setStep('trigger')} disabled={!name} style={btnStyle}>Next</button>
        </div>
      )}

      {step === 'trigger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select value={triggerType} onChange={(e) => setTriggerType(e.target.value as 'event' | 'segment')} style={inputStyle}>
            <option value="event">Event</option>
            <option value="segment">Segment</option>
          </select>
          {triggerType === 'event' && <input placeholder="Event name (e.g. page_view, purchase)" value={eventName} onChange={(e) => setEventName(e.target.value)} style={inputStyle} />}
          {triggerType === 'segment' && (
            <select value={segmentId} onChange={(e) => setSegmentId(e.target.value)} style={inputStyle}>
              <option value="">Select segment...</option>
              {segments?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('info')} style={{ ...btnStyle, background: '#e5e7eb', color: '#374151' }}>Back</button>
            <button onClick={() => setStep('action')} style={btnStyle}>Next</button>
          </div>
        </div>
      )}

      {step === 'action' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select value={actionType} onChange={(e) => { setActionType(e.target.value); setActionConfig({}); }} style={inputStyle}>
            <option value="inapp_toast">Toast</option>
            <option value="inapp_modal">Modal</option>
            <option value="inapp_banner">Banner</option>
            <option value="webhook">Webhook</option>
            <option value="kakao">Kakao</option>
          </select>
          <ActionConfigForm type={actionType} config={actionConfig} onChange={setActionConfig} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('trigger')} style={{ ...btnStyle, background: '#e5e7eb', color: '#374151' }}>Back</button>
            <button onClick={() => setStep('confirm')} style={btnStyle}>Next</button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#f9fafb', padding: 16, borderRadius: 8 }}>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Trigger:</strong> {triggerType === 'event' ? `Event: ${eventName}` : `Segment: ${segments?.find((s) => s.id === segmentId)?.name}`}</p>
            <p><strong>Action:</strong> {actionType}</p>
            <pre style={{ fontSize: 12, background: '#e5e7eb', padding: 8, borderRadius: 4, overflow: 'auto' }}>{JSON.stringify(actionConfig, null, 2)}</pre>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('action')} style={{ ...btnStyle, background: '#e5e7eb', color: '#374151' }}>Back</button>
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending} style={btnStyle}>{mutation.isPending ? 'Creating...' : 'Create Campaign'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
