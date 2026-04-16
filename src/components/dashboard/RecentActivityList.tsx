import { Link } from 'react-router-dom'
import { ui } from '../../utils/ui'
import type { ActivityItem } from '../../utils/vehicle'

interface RecentActivityListProps {
  items: ActivityItem[]
}

export function RecentActivityList({ items }: RecentActivityListProps) {
  if (items.length === 0) {
    return <p className={ui.muted}>Recent activity will appear here after you add your first service record.</p>
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-3 border-b border-stone-200 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-stone-900">{item.title}</p>
            <p className={ui.muted}>{item.subtitle} • {item.dateLabel}</p>
          </div>
          <Link className="text-sm font-medium text-orange-800 hover:text-orange-900" to={`/vehicles/${item.vehicleId}`}>
            View
          </Link>
        </li>
      ))}
    </ul>
  )
}
