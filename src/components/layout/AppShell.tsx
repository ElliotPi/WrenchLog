import { NavLink, Outlet } from 'react-router-dom'
import { ui } from '../../utils/ui'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/settings', label: 'Settings' },
]

export function AppShell() {
  return (
    <div className="min-h-screen px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-7xl">
      <header className={`${ui.panel} flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between`}>
        <div>
          <p className={ui.eyebrow}>DIY vehicle maintenance tracker</p>
          <NavLink to="/" className="inline-block text-2xl font-black tracking-[0.03em] text-stone-900 sm:text-3xl">
            WrenchLog
          </NavLink>
        </div>
        <nav className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-gradient-to-r from-orange-100 to-amber-50 px-4 py-3 text-center text-sm font-semibold text-stone-900 ring-1 ring-orange-200'
                  : 'rounded-full px-4 py-3 text-center text-sm font-semibold text-stone-600 transition hover:bg-white/80 hover:text-stone-900'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="w-full py-5 sm:py-8">
        <Outlet />
      </main>
      </div>
    </div>
  )
}
