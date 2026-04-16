import { createContext, useEffect, useMemo, useReducer, type Dispatch, type PropsWithChildren } from 'react'
import type { AppAction, AppState, UserSettings } from '../types/app'
import { buildSeedState } from '../utils/demoData'
import { loadAppState, saveAppState } from '../utils/storage'

interface AppStateContextValue {
  state: AppState
  dispatch: Dispatch<AppAction>
}

const defaultSettings: UserSettings = {
  preferredMileageUnit: 'mi',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
}

const initialState: AppState = {
  vehicles: [],
  serviceRecords: [],
  settings: defaultSettings,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'vehicle/add':
      return { ...state, vehicles: [action.payload, ...state.vehicles] }
    case 'vehicle/update':
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle) => (vehicle.id === action.payload.id ? action.payload : vehicle)),
      }
    case 'vehicle/delete':
      return {
        ...state,
        vehicles: state.vehicles.filter((vehicle) => vehicle.id !== action.payload.id),
        serviceRecords: state.serviceRecords.filter((record) => record.vehicleId !== action.payload.id),
      }
    case 'service/add':
      return { ...state, serviceRecords: [action.payload, ...state.serviceRecords] }
    case 'service/update':
      return {
        ...state,
        serviceRecords: state.serviceRecords.map((record) => (record.id === action.payload.id ? action.payload : record)),
      }
    case 'service/delete':
      return {
        ...state,
        serviceRecords: state.serviceRecords.filter((record) => record.id !== action.payload.id),
      }
    case 'settings/update':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'app/import':
      return action.payload
    case 'app/reset':
      return initialState
    default:
      return state
  }
}

export const AppStateContext = createContext<AppStateContextValue | null>(null)

function initState() {
  const savedState = loadAppState()

  if (!savedState) {
    return buildSeedState()
  }

  if (savedState.vehicles.length === 0 && savedState.serviceRecords.length === 0) {
    return buildSeedState()
  }

  return savedState
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, initialState, initState)

  useEffect(() => {
    saveAppState(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
