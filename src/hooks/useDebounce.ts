import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    // Every change of `value` clears the previous timer, so only the last one can fire
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
