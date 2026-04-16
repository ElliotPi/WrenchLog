import type { ServiceRecord, Vehicle } from '../types/app'
import { formatDate } from './formatters'

export interface ActivityItem {
  id: string
  vehicleId: string
  title: string
  subtitle: string
  dateLabel: string
}

export function sortRecordsByDateDesc(records: ServiceRecord[]) {
  return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getVehicleDisplayName(vehicle: Vehicle) {
  return [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || vehicle.nickname || 'Untitled vehicle'
}

export function getVehicleById(vehicles: Vehicle[], vehicleId: string) {
  return vehicles.find((vehicle) => vehicle.id === vehicleId)
}

export function getTotalMaintenanceCost(records: ServiceRecord[]) {
  return records.reduce((sum, record) => sum + (record.cost ?? 0), 0)
}

export function getRecentActivity(vehicles: Vehicle[], records: ServiceRecord[]): ActivityItem[] {
  return sortRecordsByDateDesc(records)
    .slice(0, 5)
    .map((record) => {
      const vehicle = vehicles.find((item) => item.id === record.vehicleId)

      return {
        id: record.id,
        vehicleId: record.vehicleId,
        title: record.serviceType,
        subtitle: vehicle ? getVehicleDisplayName(vehicle) : 'Unknown vehicle',
        dateLabel: formatDate(record.date),
      }
    })
}

export function buildMonthlyCostSeries(records: ServiceRecord[]) {
  const monthlyTotals = new Map<string, { label: string; total: number }>()

  records.forEach((record) => {
    if (!record.cost) {
      return
    }

    const date = new Date(record.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
    const existing = monthlyTotals.get(key)
    monthlyTotals.set(key, {
      label,
      total: (existing?.total ?? 0) + record.cost,
    })
  })

  return Array.from(monthlyTotals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => ({
      month: value.label,
      total: value.total,
    }))
}
