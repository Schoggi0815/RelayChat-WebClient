import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiResponse } from '../models/ApiResponse'
import { useGroupedApiCalls } from './useGroupedApiCalls'
import { useAsnycTask } from './useAsyncTask'

type ToFunctionType<R> = (abort: AbortController) => ApiResponse<R>

export type useGetApiRequestProps<R> =
  | ToFunctionType<R>
  | ToFunctionType<unknown>[]

export type useGetApiRequestReturn<R> = {
  setValue: (newValue: R) => void
  refresh: () => void
} & (
  | {
      value: R
      loading: false
      error: undefined
    }
  | {
      value: R | undefined
      loading: true
      error: undefined
    }
  | {
      value: R | undefined
      loading: false
      error: Error
    }
)

export function useGetApiRequestWithError<R>(
  apiCallback: ToFunctionType<R>
): useGetApiRequestReturn<R>
export function useGetApiRequestWithError<R1, R2>(
  apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>]
): useGetApiRequestReturn<[R1, R2]>
export function useGetApiRequestWithError<R1, R2, R3>(
  apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>, ToFunctionType<R3>]
): useGetApiRequestReturn<[R1, R2, R3]>
export function useGetApiRequestWithError<R>(
  apiCallback: useGetApiRequestProps<R>
): useGetApiRequestReturn<R | unknown[]>
export function useGetApiRequestWithError<R>(
  apiCallback: useGetApiRequestProps<R>
): useGetApiRequestReturn<R | unknown[]> {
  const memoizedApiCallback = useMemo(
    () => apiCallback,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...(Array.isArray(apiCallback) ? apiCallback : [apiCallback])]
  )

  const groupedRequest = useGroupedApiCalls(
    ...(Array.isArray(memoizedApiCallback)
      ? memoizedApiCallback
      : [memoizedApiCallback])
  )

  const resolveRequest = useCallback(
    async (abort: AbortController): Promise<R | unknown[]> => {
      const result = await groupedRequest(abort)
      if (result.ok) {
        return Array.isArray(memoizedApiCallback)
          ? result.data
          : (result.data[0] as R)
      }
      throw new Error(result.error)
    },
    [groupedRequest, memoizedApiCallback]
  )

  const { value, loading, error, refresh } = useAsnycTask(resolveRequest)

  const [actualValue, setActualValue] = useState(value)

  useEffect(() => {
    setActualValue(value)
  }, [value])

  if (error !== undefined) {
    return {
      error,
      value: actualValue ?? value,
      loading,
      refresh,
      setValue: setActualValue,
    }
  }

  if (loading) {
    return {
      value: actualValue ?? value,
      loading,
      refresh,
      setValue: setActualValue,
      error: undefined,
    }
  }

  return {
    value: actualValue ?? value,
    loading,
    refresh,
    setValue: setActualValue,
    error: undefined,
  }
}
