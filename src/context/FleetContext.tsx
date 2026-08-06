import React, { createContext, useReducer, Dispatch } from 'react';

type Weather = 'CLEAR' | 'STORMY' | 'FOGGY';
type FlightStatus = 'SCHEDULED' | 'IN_FLIGHT' | 'LANDED';

export type Flight = {
  id: string;
  destination: string;
  status: FlightStatus;
  altitude: number;
  fuelPercent: number;
};

export type Alert = { id: string; message: string; type: 'WARNING' | 'DANGER' };

type State = {
  weatherCondition: Weather;
  filterStatus: 'ALL' | FlightStatus;
  selectedFlightId: string | null;
  alerts: Alert[];
  flights: Flight[];
};

const initialState: State = {
  weatherCondition: 'CLEAR',
  filterStatus: 'ALL',
  selectedFlightId: 'FL-101',
  alerts: [],
  flights: [
    { id: 'FL-101', destination: 'Tokyo (NRT)', status: 'IN_FLIGHT', altitude: 32000, fuelPercent: 65 },
    { id: 'FL-204', destination: 'London (LHR)', status: 'SCHEDULED', altitude: 0, fuelPercent: 100 },
    { id: 'FL-309', destination: 'New York (JFK)', status: 'IN_FLIGHT', altitude: 28000, fuelPercent: 15 },
    { id: 'FL-412', destination: 'Paris (CDG)', status: 'LANDED', altitude: 0, fuelPercent: 40 }
  ]
};

type Action =
  | { type: 'SELECT_FLIGHT'; payload: string }
  | { type: 'UPDATE_STATUS'; payload: { flightId: string; status: FlightStatus } }
  | { type: 'ADJUST_ALTITUDE'; payload: { flightId: string; amount: number } }
  | { type: 'CONSUME_FUEL'; payload: { flightId: string; amount: number } }
  | { type: 'SET_WEATHER'; payload: Weather }
  | { type: 'ADD_FLIGHT'; payload: { destination: string } }
  | { type: 'DISMISS_ALERT'; payload: string };

function makeAlert(type: 'WARNING' | 'DANGER', message: string): Alert {
  return { id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, type, message };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_FLIGHT':
      return { ...state, selectedFlightId: action.payload };

    case 'UPDATE_STATUS': {
      const { flightId, status } = action.payload;
      const flights = state.flights.map(f => (f.id !== flightId ? f : { ...f, status, altitude: status === 'LANDED' ? 0 : f.altitude }));
      return { ...state, flights };
    }

    case 'ADJUST_ALTITUDE': {
      const { flightId, amount } = action.payload;
      const flights = state.flights.map(f => {
        if (f.id !== flightId) return f;
        const newAltitude = Math.min(45000, Math.max(0, f.altitude + amount));
        return { ...f, altitude: newAltitude, status: newAltitude > 0 ? 'IN_FLIGHT' : f.status };
      });
      return { ...state, flights };
    }

    case 'CONSUME_FUEL': {
      const { flightId, amount } = action.payload;
      let newAlerts = state.alerts.slice();
      const flights = state.flights.map(f => {
        if (f.id !== flightId) return f;
        const newFuel = Math.max(0, f.fuelPercent - amount);
        // warning if below 20 and in flight
        if (newFuel < 20 && f.status === 'IN_FLIGHT') {
          newAlerts = newAlerts.concat(makeAlert('WARNING', `${f.id} low fuel: ${newFuel}%`));
        }
        if (newFuel === 0) {
          newAlerts = newAlerts.concat(makeAlert('DANGER', `${f.id} fuel exhausted`));
        }
        return { ...f, fuelPercent: newFuel };
      });
      return { ...state, flights, alerts: newAlerts };
    }

    case 'SET_WEATHER': {
      const weather = action.payload;
      let alerts = state.alerts.slice();
      if (weather === 'STORMY') {
        alerts = alerts.concat(makeAlert('DANGER', 'Severe storm detected! All flights hold altitude.'));
      }
      return { ...state, weatherCondition: weather, alerts };
    }

    case 'ADD_FLIGHT': {
      const id = 'FL-' + Math.floor(100 + Math.random() * 900);
      const newFlight: Flight = { id, destination: action.payload.destination, status: 'SCHEDULED', altitude: 0, fuelPercent: 100 };
      return { ...state, flights: state.flights.concat(newFlight) };
    }

    case 'DISMISS_ALERT': {
      const alertId = action.payload;
      return { ...state, alerts: state.alerts.filter(a => a.id !== alertId) };
    }

    default:
      return state;
  }
}

const FleetContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

export const FleetProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <FleetContext.Provider value={{ state, dispatch }}>{children}</FleetContext.Provider>;
};

export function useFleet() {
  const ctx = React.useContext(FleetContext);
  if (!ctx) throw new Error('useFleet must be used within FleetProvider');
  return ctx;
}

export default FleetContext;
