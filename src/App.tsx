import React from 'react';
import { FleetProvider } from './context/FleetContext';
import WeatherToolbar from './components/WeatherToolbar';
import FlightTable from './components/FlightTable';
import ControlPanel from './components/ControlPanel';
import AlertList from './components/AlertList';
import './index.css';

function App() {
  return (
    <FleetProvider>
      <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
        <h1>SkyControl Flight Fleet Dashboard</h1>
        <WeatherToolbar />
        <AlertList />
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <div style={{ flex: 1 }}>
            <FlightTable />
          </div>
          <div style={{ width: 360 }}>
            <ControlPanel />
          </div>
        </div>
      </div>
    </FleetProvider>
  );
}

export default App;
