import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';

export default function WeatherToolbar() {
  const { state, dispatch } = useFleet();
  const [dest, setDest] = useState('');

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div>
        <strong>Weather:</strong>
        <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: 'SET_WEATHER', payload: 'CLEAR' })}>
          Clear
        </button>
        <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: 'SET_WEATHER', payload: 'FOGGY' })}>
          Foggy
        </button>
        <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: 'SET_WEATHER', payload: 'STORMY' })}>
          Stormy
        </button>
        <span style={{ marginLeft: 12 }}>Current: {state.weatherCondition}</span>
      </div>

      <div style={{ marginLeft: 24 }}>
        <strong>New Flight:</strong>
        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" style={{ marginLeft: 8 }} />
        <button
          style={{ marginLeft: 8 }}
          onClick={() => {
            if (!dest) return;
            dispatch({ type: 'ADD_FLIGHT', payload: { destination: dest } });
            setDest('');
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
