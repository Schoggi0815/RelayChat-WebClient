import { ApiResponse } from '../models/ApiResponse'
import { useGetApiRequestWithError } from './useGetApiRequestWithError'

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
    }
  | {
      value: R | undefined
      loading: true
    }
)

export function useGetApiRequest<R>(
  apiCallback: ToFunctionType<R>
): useGetApiRequestReturn<R>
export function useGetApiRequest<R1, R2>(
  apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>]
): useGetApiRequestReturn<[R1, R2]>
export function useGetApiRequest<R1, R2, R3>(
  apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>, ToFunctionType<R3>]
): useGetApiRequestReturn<[R1, R2, R3]>
export function useGetApiRequest<R>(
  apiCallback: useGetApiRequestProps<R>
): useGetApiRequestReturn<R | unknown[]>
export function useGetApiRequest<R>(
  apiCallback: useGetApiRequestProps<R>
): useGetApiRequestReturn<R | unknown[]> {
  const { value, loading, refresh, setValue, error } =
    useGetApiRequestWithError(apiCallback)

  if (error !== undefined) {
    throw error
  }

  if (loading) {
    return {
      value,
      loading,
      refresh,
      setValue,
    }
  }

  return {
    value,
    loading,
    refresh,
    setValue,
  }
}
