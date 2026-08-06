# SkyControl Flight Fleet Dashboard 
**Topics Evaluated:** React `useReducer`, `createContext`, Global Dispatch, and State Validation  

---

## 1. Overview & Scenario

You are tasked with building SkyControl, a real-time air traffic management dashboard. The system allows flight operators to monitor a fleet of aircraft, update flight parameters (altitude, status, fuel), handle environmental conditions (weather), and respond to automated emergency alerts.

Your goal is to implement global state management using React's `useReducer` and `createContext` to handle all application logic cleanly and predictably without relying on external state management libraries.

## 2. Technical Requirements

1. **Global Context Setup:** Create a `FleetContext` and wrap your application in a `FleetProvider` component. The provider must supply state and dispatch to all child components.
2. **Pure Reducer State Management:** All state transformations and business logic validation must be handled exclusively inside your reducer function using immutable array operations (`map`, `filter`, `concat`).
3. **Component Decoupling:** Child components must read state using `useContext(FleetContext)` and trigger state changes strictly by dispatching action objects.

## 3. Global State Architecture

### Initial State Shape
Your reducer must be initialized with the following structure:

```typescript
const initialState = {
  weatherCondition: "CLEAR", // Options: 'CLEAR' | 'STORMY' | 'FOGGY'
  filterStatus: "ALL",       // Options: 'ALL' | 'SCHEDULED' | 'IN_FLIGHT' | 'LANDED'
  selectedFlightId: "FL-101",
  alerts: [],                // Array of { id: string, message: string, type: 'WARNING' | 'DANGER' }
  flights: [
    { id: "FL-101", destination: "Tokyo (NRT)", status: "IN_FLIGHT", altitude: 32000, fuelPercent: 65 },
    { id: "FL-204", destination: "London (LHR)", status: "SCHEDULED", altitude: 0, fuelPercent: 100 },
    { id: "FL-309", destination: "New York (JFK)", status: "IN_FLIGHT", altitude: 28000, fuelPercent: 15 },
    { id: "FL-412", destination: "Paris (CDG)", status: "LANDED", altitude: 0, fuelPercent: 40 }
  ]
};
```

## 4. Required Action Types & Reducer Rules
Your reducer must handle the following dispatch actions and enforce their validation rules:
Format: Action / Payload format / Expected validation rules

SELECT_FLIGHT
string (flightId)
Sets selectedFlightId in state to the provided ID.

UPDATE_STATUS
{ flightId: string, status: string }
Updates the status of the targeted flight ('SCHEDULED', 'IN_FLIGHT', or 'LANDED'). If status is changed to 'LANDED', automatically set its altitude to 0.

ADJUST_ALTITUDE
{ flightId: string, amount: number }
Adjusts altitude by amount (e.g., +2000 or -2000).• Enforce bounds: Minimum 0, Maximum 45000.• If altitude becomes > 0, automatically set status to 'IN_FLIGHT'.

CONSUME_FUEL
{ flightId: string, amount: number }
Reduces fuelPercent by amount (cannot drop below 0).• If fuel drops below 20 for an 'IN_FLIGHT' aircraft, automatically append a 'WARNING' alert to alerts.• If fuel reaches 0, automatically append a 'DANGER' alert to alerts.

SET_WEATHER
string ('CLEAR', 'STORMY', or 'FOGGY')
Updates weatherCondition. If set to 'STORMY', automatically generate and append a global 'DANGER' alert: ""Severe storm detected! All flights hold altitude.

ADD_FLIGHT
{ destination: string }
Appends a new flight object to flights with:• id: ""FL-"" + Math.floor(100 + Math.random() * 900)• status: ""SCHEDULED""• altitude: 0• fuelPercent: 100

DISMISS_ALERT
string (alertId)
Removes the target alert from the alerts array.


## 5. Recommended Component Hierarchy
src/
├── context/
│   └── FleetContext.tsx        # createContext, reducer function, and FleetProvider
├── components/
│   ├── WeatherToolbar.tsx      # Weather selection buttons + "New Flight" input form
│   ├── FlightTable.tsx         # Displays filtered flights; highlights selected flight
│   ├── ControlPanel.tsx        # Detailed controls for currently selected flight
│   └── AlertList.tsx           # Warning and danger banners with dismiss buttons
└── App.tsx                     # Shell layout wrapped inside <FleetProvider>


## 6. Maintaining State Immutability
Always return new object and array references from your reducer. Use .map() to update an item in an array without modifying the original array directly.
// Reference Example: Updating a flight inside your reducer
``` typescript
case "ADJUST_ALTITUDE": {
  const updatedFlights = state.flights.map(flight => {
    // If current flight is not the one we want, skip over it
    if (flight.id !== action.payload.flightId) return flight;

    // Return an updated flight with the new altitude
    const newAltitude = Math.min(45000, Math.max(0, flight.altitude + action.payload.amount));
    return {
      ...flight,
      altitude: newAltitude,
      status: newAltitude > 0 ? "IN_FLIGHT" : flight.status
    };
  });

  return { ...state, flights: updatedFlights };
}
```

## 7. Submission Checklist
Before submitting verify that:

1. Your application is wrapped in <FleetProvider> in App.tsx.

2. Changing weather, altitude, fuel, or status properly dispatches actions.

3. Altitude cannot go below 0 or above 45,000.

4. Fuel dropping below 20% automatically triggers an alert banner.

5. Clicking a flight in FlightTable updates ControlPanel to reflect that specific aircraft.

6. All list manipulations remain strictly 1D without nested arrays.