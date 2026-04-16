import type { AppState } from '../types/app'

const STORAGE_KEY = 'wrenchlog:app-state'

export function loadAppState(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    return JSON.parse(raw) as AppState
  } catch {
    return null
  }
}

export function saveAppState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
