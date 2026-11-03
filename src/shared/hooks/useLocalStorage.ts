import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): readonly [T, Dispatch<SetStateAction<T>>] => {
  // Lazy initialiser: localStorage is read once, on the first render only
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored === null) return initialValue

      const parsed: unknown = JSON.parse(stored)
      // The stored JSON can't be checked against T at runtime; we trust what we saved
      return parsed as T
    } catch {
      // Unreadable storage or broken JSON: start from the default
      return initialValue
    }
  })

  // Runs after render, and again only when the key or the value changed
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be full or blocked; the app keeps working without saving
    }
  }, [key, value])

  return [value, setValue] as const
}
