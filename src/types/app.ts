export interface VehiclePhoto {
  id: string
  name: string
  dataUrl: string
  isPrimary: boolean
}

export interface Vehicle {
  id: string
  vin: string
  year: string
  make: string
  model: string
  trim?: string
  nickname?: string
  description?: string
  photos: VehiclePhoto[]
  createdAt: string
  updatedAt: string
}

export interface ServiceRecord {
  id: string
  vehicleId: string
  serviceType: string
  date: string
  mileage: number
  cost?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  preferredMileageUnit: 'mi'
  currency: 'USD'
  dateFormat: 'MM/DD/YYYY'
}

export interface AppState {
  vehicles: Vehicle[]
  serviceRecords: ServiceRecord[]
  settings: UserSettings
}

export type AppAction =
  | { type: 'vehicle/add'; payload: Vehicle }
  | { type: 'vehicle/update'; payload: Vehicle }
  | { type: 'vehicle/delete'; payload: { id: string } }
  | { type: 'service/add'; payload: ServiceRecord }
  | { type: 'service/update'; payload: ServiceRecord }
  | { type: 'service/delete'; payload: { id: string } }
  | { type: 'settings/update'; payload: Partial<UserSettings> }
  | { type: 'app/import'; payload: AppState }
  | { type: 'app/reset' }
