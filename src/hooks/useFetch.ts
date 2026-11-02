import { useEffect, useState } from 'react'
import type { FetchState } from '../types/fetchState'

// Only the finished outcomes are stored, together with the url they belong to
type SettledState<T> = Extract<FetchState<T>, { status: 'success' | 'error' }>
type Result<T> = { url: string; state: SettledState<T> }

export const useFetch = <T>(url: string | null): FetchState<T> => {
  const [result, setResult] = useState<Result<T> | null>(null)

  useEffect(() => {
    if (url === null) return

    // One controller per request, so cleanup can cancel exactly this request
    const controller = new AbortController()

    // The effect function can't be async (it must return a cleanup function or nothing),
    // so the async work lives in a function that the effect calls
    const load = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const json: unknown = await response.json()
        // The one cast: JSON from the network can't be checked against T at runtime
        setResult({ url, state: { status: 'success', data: json as T } })
      } catch (error) {
        // Aborting is expected (the url changed or the component unmounted), not a failure
        if (error instanceof DOMException && error.name === 'AbortError') return

        setResult({
          url,
          state: {
            status: 'error',
            error:
              error instanceof Error ? error.message : 'Something went wrong',
          },
        })
      }
    }
    void load()

    // Runs before the next effect and on unmount: cancels the request that is still in flight
    return () => controller.abort()
  }, [url])

  // idle and loading are derived during render, so the effect never calls setState synchronously
  if (url === null) return { status: 'idle' }
  if (result === null || result.url !== url) return { status: 'loading' }
  return result.state
}
