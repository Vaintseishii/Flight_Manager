import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';

export default function ControlPanel() {
  const { state, dispatch } = useFleet();
  const flight = state.flights.find(f => f.id === state.selectedFlightId) || null;
  const [fuelAmt, setFuelAmt] = useState('');

  if (!flight) return <div><h2>Control Panel</h2><div>No flight selected</div></div>;

  return (
    <div>
      <h2>Control Panel</h2>
      <div><strong>{flight.id}</strong> — {flight.destination}</div>
      <div>Status: {flight.status}</div>
      <div>Altitude: {flight.altitude} ft</div>
      <div>Fuel: {flight.fuelPercent}%</div>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => dispatch({ type: 'ADJUST_ALTITUDE', payload: { flightId: flight.id, amount: 2000 } })}>+2000</button>
        <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: 'ADJUST_ALTITUDE', payload: { flightId: flight.id, amount: -2000 } })}>-2000</button>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Set status: </label>
        <select value={flight.status} onChange={e => dispatch({ type: 'UPDATE_STATUS', payload: { flightId: flight.id, status: e.target.value as any } })}>
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="IN_FLIGHT">IN_FLIGHT</option>
          <option value="LANDED">LANDED</option>
        </select>
      </div>

      <div style={{ marginTop: 8 }}>
        <input value={fuelAmt} onChange={e => setFuelAmt(e.target.value)} placeholder="Fuel to consume" />
        <button style={{ marginLeft: 8 }} onClick={() => {
          const n = Number(fuelAmt) || 0;
          if (n <= 0) return;
          dispatch({ type: 'CONSUME_FUEL', payload: { flightId: flight.id, amount: n } });
          setFuelAmt('');
        }}>Consume</button>
      </div>
    </div>
  );
}
