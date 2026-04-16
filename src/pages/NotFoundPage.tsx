import { Link } from 'react-router-dom'
import { ui } from '../utils/ui'

export function NotFoundPage() {
  return (
    <main className={ui.pageNarrow}>
      <p className={ui.eyebrow}>404</p>
      <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">That route is not in the garage.</h1>
      <p className={ui.muted}>
        The page you requested does not exist in this scaffold yet, or the URL is incorrect.
      </p>
      <Link className={ui.buttonPrimary} to="/">
        Return to dashboard
      </Link>
    </main>
  )
}
