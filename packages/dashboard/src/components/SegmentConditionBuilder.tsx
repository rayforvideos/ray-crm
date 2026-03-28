interface Condition { field: string; op: string; value: string; }

interface Props {
  conditions: Condition[];
  operator: 'AND' | 'OR';
  onOperatorChange: (op: 'AND' | 'OR') => void;
  onConditionsChange: (conditions: Condition[]) => void;
}

const inputStyle: React.CSSProperties = { padding: 6, borderRadius: 6, border: '1px solid #d1d5db' };

export function SegmentConditionBuilder({ conditions, operator, onOperatorChange, onConditionsChange }: Props) {
  const addCondition = () => onConditionsChange([...conditions, { field: '', op: 'eq', value: '' }]);
  const updateCondition = (index: number, patch: Partial<Condition>) => {
    onConditionsChange(conditions.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };
  const removeCondition = (index: number) => onConditionsChange(conditions.filter((_, i) => i !== index));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>Match</span>
        <select value={operator} onChange={(e) => onOperatorChange(e.target.value as 'AND' | 'OR')} style={inputStyle}>
          <option value="AND">ALL (AND)</option>
          <option value="OR">ANY (OR)</option>
        </select>
      </div>
      {conditions.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Field (e.g. properties.plan)" value={c.field} onChange={(e) => updateCondition(i, { field: e.target.value })} style={{ ...inputStyle, flex: 2 }} />
          <select value={c.op} onChange={(e) => updateCondition(i, { op: e.target.value })} style={{ ...inputStyle, flex: 1 }}>
            <option value="eq">equals</option><option value="neq">not equals</option><option value="gt">greater than</option><option value="gte">greater or equal</option><option value="lt">less than</option><option value="lte">less or equal</option><option value="contains">contains</option><option value="not_contains">not contains</option>
          </select>
          <input placeholder="Value" value={c.value} onChange={(e) => updateCondition(i, { value: e.target.value })} style={{ ...inputStyle, flex: 2 }} />
          <button onClick={() => removeCondition(i)} style={{ padding: '4px 8px', border: 'none', background: '#fecaca', borderRadius: 4, cursor: 'pointer' }}>x</button>
        </div>
      ))}
      <button onClick={addCondition} style={{ padding: '6px 12px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer', alignSelf: 'flex-start' }}>+ Add condition</button>
    </div>
  );
}
