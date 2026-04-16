import type { AppState, ServiceRecord, Vehicle, VehiclePhoto } from '../types/app'

function buildPhotoDataUrl(label: string, colorA: string, colorB: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)" />
      <circle cx="980" cy="190" r="145" fill="rgba(255,255,255,0.12)" />
      <rect x="120" y="420" width="960" height="170" rx="54" fill="rgba(17,24,39,0.72)" />
      <rect x="245" y="350" width="700" height="120" rx="44" fill="rgba(17,24,39,0.78)" />
      <circle cx="318" cy="622" r="86" fill="#101828" />
      <circle cx="886" cy="622" r="86" fill="#101828" />
      <text x="86" y="132" fill="white" font-size="68" font-family="Segoe UI, Arial, sans-serif" font-weight="700">${label}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function buildPhoto(id: string, name: string, label: string, colorA: string, colorB: string, isPrimary = true): VehiclePhoto {
  return {
    id,
    name,
    isPrimary,
    dataUrl: buildPhotoDataUrl(label, colorA, colorB),
  }
}

export function buildSeedState(): AppState {
  const settings = {
    preferredMileageUnit: 'mi' as const,
    currency: 'USD' as const,
    dateFormat: 'MM/DD/YYYY' as const,
  }

  const vehicles: Vehicle[] = [
    {
      id: 'vehicle-4runner',
      vin: 'JT3HN86R8V0123456',
      year: '1997',
      make: 'Toyota',
      model: '4Runner',
      trim: 'SR5',
      nickname: 'Trail Rig',
      description: 'Weekend camping and snow-run setup with a running maintenance log.',
      photos: [
        buildPhoto('photo-4runner-main', '4runner-main.svg', 'Trail Rig', '#2f4f4f', '#8d6e63'),
      ],
      createdAt: '2026-03-10T09:00:00.000Z',
      updatedAt: '2026-04-10T09:30:00.000Z',
    },
    {
      id: 'vehicle-es350',
      vin: '58ABK1GG4GU012345',
      year: '2016',
      make: 'Lexus',
      model: 'ES 350',
      trim: 'Base',
      nickname: 'Daily Driver',
      description: 'Comfort-focused commuter with routine service tracked for oil, tires, and filters.',
      photos: [
        buildPhoto('photo-es-main', 'es-main.svg', 'Daily Driver', '#3b4252', '#bf616a'),
      ],
      createdAt: '2026-03-15T08:30:00.000Z',
      updatedAt: '2026-04-12T14:10:00.000Z',
    },
  ]

  const serviceRecords: ServiceRecord[] = [
    {
      id: 'record-1',
      vehicleId: 'vehicle-es350',
      serviceType: 'Oil Change',
      date: '2026-04-05',
      mileage: 124500,
      cost: 74,
      notes: 'Full synthetic oil and OEM filter.',
      createdAt: '2026-04-05T18:10:00.000Z',
      updatedAt: '2026-04-05T18:10:00.000Z',
    },
    {
      id: 'record-2',
      vehicleId: 'vehicle-4runner',
      serviceType: 'Brake Pad Replacement',
      date: '2026-03-28',
      mileage: 218340,
      cost: 186,
      notes: 'Front pads replaced and rotors resurfaced.',
      createdAt: '2026-03-28T13:00:00.000Z',
      updatedAt: '2026-03-28T13:00:00.000Z',
    },
    {
      id: 'record-3',
      vehicleId: 'vehicle-4runner',
      serviceType: 'Coolant Flush',
      date: '2026-02-16',
      mileage: 217900,
      cost: 59,
      notes: 'Drained, flushed, and refilled with Toyota red coolant.',
      createdAt: '2026-02-16T16:20:00.000Z',
      updatedAt: '2026-02-16T16:20:00.000Z',
    },
    {
      id: 'record-4',
      vehicleId: 'vehicle-es350',
      serviceType: 'Tire Rotation',
      date: '2026-01-22',
      mileage: 122900,
      cost: 30,
      notes: 'Cross-rotation and pressure check.',
      createdAt: '2026-01-22T10:45:00.000Z',
      updatedAt: '2026-01-22T10:45:00.000Z',
    },
  ]

  return {
    vehicles,
    serviceRecords,
    settings,
  }
}
