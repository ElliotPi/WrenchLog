import { Link } from 'react-router-dom'
import type { Vehicle } from '../../types/app'
import { ui } from '../../utils/ui'

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const primaryPhoto = vehicle.photos.find((photo) => photo.isPrimary) ?? vehicle.photos[0]
  const title = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')

  return (
    <article className={`${ui.card} overflow-hidden bg-gradient-to-b from-white to-stone-50`}>
      <div className="aspect-[16/10] bg-gradient-to-br from-slate-900 via-slate-700 to-stone-500">
        {primaryPhoto ? (
          <img className="h-full w-full object-cover" src={primaryPhoto.dataUrl} alt={title} />
        ) : (
          <div className="grid h-full w-full place-items-center text-3xl font-black text-white">{vehicle.make.slice(0, 1) || 'V'}</div>
        )}
      </div>
      <div className="grid gap-2 px-4 py-5 sm:px-5">
        <p className={ui.eyebrow}>{vehicle.nickname || 'Garage vehicle'}</p>
        <h3 className="text-xl font-black tracking-tight text-stone-900">{title || 'Untitled vehicle'}</h3>
        <p className="text-sm leading-6 text-stone-600">VIN ending {vehicle.vin.slice(-6) || 'pending'}</p>
        <Link className="mt-2 text-sm font-semibold text-orange-800 hover:text-orange-900" to={`/vehicles/${vehicle.id}`}>
          Open vehicle
        </Link>
      </div>
    </article>
  )
}
