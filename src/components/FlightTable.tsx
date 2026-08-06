import React from 'react';
import { useFleet } from '../context/FleetContext';

export default function FlightTable() {
  const { state, dispatch } = useFleet();
  const flights = state.flights.filter(f => (state.filterStatus === 'ALL' ? true : f.status === state.filterStatus));

  return (
    <div>
      <h2>Flights</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>ID</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Alt</th>
            <th>Fuel</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(f => (
            <tr
              key={f.id}
              onClick={() => dispatch({ type: 'SELECT_FLIGHT', payload: f.id })}
              style={{ background: f.id === state.selectedFlightId ? '#eef' : 'transparent', cursor: 'pointer' }}
            >
              <td>{f.id}</td>
              <td>{f.destination}</td>
              <td>{f.status}</td>
              <td>{f.altitude}</td>
              <td>{f.fuelPercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
