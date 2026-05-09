import { useSyncExternalStore } from 'react'

/**
 * Returns false on the server (SSR) and true on the client after hydration.
 * Prefer this over `useState(false) + useEffect(() => setState(true))` —
 * that pattern triggers two renders; useSyncExternalStore resolves in one.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
