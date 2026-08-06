import React from 'react';
import { useFleet } from '../context/FleetContext';

export default function AlertList() {
  const { state, dispatch } = useFleet();

  if (state.alerts.length === 0) return null;

  return (
    <div style={{ marginTop: 12 }}>
      {state.alerts.map(a => (
        <div key={a.id} style={{ padding: 8, marginBottom: 6, background: a.type === 'DANGER' ? '#fdd' : '#ffd', border: '1px solid #ccc' }}>
          <strong>{a.type}</strong>: {a.message}
          <button style={{ marginLeft: 12 }} onClick={() => dispatch({ type: 'DISMISS_ALERT', payload: a.id })}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}
