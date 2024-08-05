import { useCallback, useEffect, useState } from 'react'

type useAsyncTaskResult<T> =
  | { value: T; loading: false; error: undefined; refresh: () => void }
  | { value: undefined; loading: true; error: undefined; refresh: () => void }
  | { value: undefined; loading: false; error: Error; refresh: () => void }

export const useAsnycTask = <T>(
  promiseCallback: (abort: AbortController) => Promise<T>
): useAsyncTaskResult<T> => {
  const [value, setValue] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh = useCallback(() => {
    setRefreshCounter(refreshCounter + 1)
  }, [refreshCounter])

  useEffect(() => {
    setLoading(true)

    const abortController = new AbortController()

    promiseCallback(abortController)
      .then(abortController.signal.aborted ? () => {} : setValue)
      .catch(e =>
        abortController.signal.aborted
          ? () => {}
          : e instanceof Error
          ? setError(e)
          : setError(new Error('Unknown Error Occured'))
      )
      .finally(() => (abortController.signal.aborted ? {} : setLoading(false)))

    return () => {
      abortController.abort()
    }
  }, [promiseCallback, refreshCounter])

  if (loading) {
    return { value: undefined, loading: true, error: undefined, refresh }
  }

  if (value !== undefined) {
    return { value, loading: false, error: undefined, refresh }
  }

  if (error !== undefined) {
    return { value: undefined, loading: false, error, refresh }
  }

  throw new Error('No Error!')
}
