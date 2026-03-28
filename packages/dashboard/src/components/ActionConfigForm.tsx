interface Props {
  type: string;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

const inputStyle: React.CSSProperties = {
  padding: 8,
  borderRadius: 6,
  border: '1px solid #d1d5db',
  width: '100%',
};

export function ActionConfigForm({ type, config, onChange }: Props) {
  const set = (key: string, value: unknown) => onChange({ ...config, [key]: value });

  switch (type) {
    case 'inapp_toast':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Message" value={(config.message as string) ?? ''} onChange={(e) => set('message', e.target.value)} style={inputStyle} />
          <select value={(config.toastType as string) ?? 'info'} onChange={(e) => set('toastType', e.target.value)} style={inputStyle}>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <input type="number" placeholder="Duration (seconds)" value={(config.duration as number) ?? 5} onChange={(e) => set('duration', parseInt(e.target.value))} style={inputStyle} />
        </div>
      );
    case 'inapp_modal':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Title" value={(config.title as string) ?? ''} onChange={(e) => set('title', e.target.value)} style={inputStyle} />
          <textarea placeholder="Body" value={(config.body as string) ?? ''} onChange={(e) => set('body', e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
          <input placeholder="Image URL (optional)" value={(config.imageUrl as string) ?? ''} onChange={(e) => set('imageUrl', e.target.value)} style={inputStyle} />
          <input placeholder="Button 1 text" value={((config.buttons as any)?.[0]?.text as string) ?? ''} onChange={(e) => set('buttons', [{ text: e.target.value, url: ((config.buttons as any)?.[0]?.url) ?? '' }, ...((config.buttons as any)?.slice(1) ?? [])])} style={inputStyle} />
          <input placeholder="Button 1 URL (optional)" value={((config.buttons as any)?.[0]?.url as string) ?? ''} onChange={(e) => set('buttons', [{ text: ((config.buttons as any)?.[0]?.text) ?? '', url: e.target.value }, ...((config.buttons as any)?.slice(1) ?? [])])} style={inputStyle} />
        </div>
      );
    case 'inapp_banner':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Text" value={(config.text as string) ?? ''} onChange={(e) => set('text', e.target.value)} style={inputStyle} />
          <input placeholder="Background color (#hex)" value={(config.backgroundColor as string) ?? '#3b82f6'} onChange={(e) => set('backgroundColor', e.target.value)} style={inputStyle} />
          <input placeholder="Link URL (optional)" value={(config.linkUrl as string) ?? ''} onChange={(e) => set('linkUrl', e.target.value)} style={inputStyle} />
          <select value={(config.position as string) ?? 'top'} onChange={(e) => set('position', e.target.value)} style={inputStyle}>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={(config.dismissible as boolean) ?? true} onChange={(e) => set('dismissible', e.target.checked)} />
            Dismissible
          </label>
        </div>
      );
    case 'webhook':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="URL" value={(config.url as string) ?? ''} onChange={(e) => set('url', e.target.value)} style={inputStyle} />
          <select value={(config.method as string) ?? 'POST'} onChange={(e) => set('method', e.target.value)} style={inputStyle}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <textarea placeholder='Headers JSON: {"Authorization": "Bearer ..."}' value={(config.headers as string) ?? ''} onChange={(e) => set('headers', e.target.value)} style={{ ...inputStyle, minHeight: 60 }} />
          <textarea placeholder='Body template: {"userId": "{{userId}}"}' value={(config.bodyTemplate as string) ?? ''} onChange={(e) => set('bodyTemplate', e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
        </div>
      );
    case 'kakao':
      return <p style={{ color: '#6b7280' }}>Kakao integration coming soon.</p>;
    default:
      return null;
  }
}
