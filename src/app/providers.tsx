import type { PropsWithChildren } from 'react'
import { AppStateProvider } from '../context/AppStateContext'

export function AppProviders({ children }: PropsWithChildren) {
  return <AppStateProvider>{children}</AppStateProvider>
}
