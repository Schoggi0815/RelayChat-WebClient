import { Alert } from '@mantine/core'
import React from 'react'
import { ApiResponse } from '../../models/ApiResponse'
import { useGetApiRequestWithError } from '../../hooks/useGetApiRequestWithError'
import { FiAlertCircle } from 'react-icons/fi'

type ToFunctionType<R> = (abort: AbortController) => ApiResponse<R>

export type ApiRequesterPassProps<R> = {
  apiCallback: ToFunctionType<R> | ToFunctionType<unknown>[]
  children: (
    value:
      | { data: R | unknown[]; loading: false }
      | { data: undefined | R | unknown[]; loading: true },
    refresh: () => void,
    setValue: (value: R | unknown[]) => void
  ) => React.ReactNode
}

export type ApiRequesterPassPropsSingle<R> = {
  apiCallback: ToFunctionType<R>
  children: (
    value: { data: R; loading: false } | { data: undefined | R; loading: true },
    refresh: () => void,
    setValue: (value: R) => void
  ) => React.ReactNode
}

export function ApiRequesterPass<R1, R2, R3>(props: {
  apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>, ToFunctionType<R3>]
  children: (
    value:
      | { data: [R1, R2, R3]; loading: false }
      | { data: [R1, R2, R3] | undefined; loading: true },
    refresh: () => void,
    setValue: (value: [R1, R2, R3]) => void
  ) => React.ReactNode
}): React.ReactNode

export function ApiRequesterPass<R1, R2>(props: {
  apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>]
  children: (
    value:
      | { data: [R1, R2]; loading: false }
      | { data: [R1, R2] | undefined; loading: true },
    refresh: () => void,
    setValue: (value: [R1, R2]) => void
  ) => React.ReactNode
}): React.ReactNode

export function ApiRequesterPass<R>(
  props: ApiRequesterPassPropsSingle<R>
): React.ReactNode

export function ApiRequesterPass<R>(
  props: ApiRequesterPassProps<R>
): React.ReactNode

export function ApiRequesterPass<R>({
  apiCallback,
  children,
}: ApiRequesterPassProps<R>) {
  const { value, loading, refresh, setValue, error } =
    useGetApiRequestWithError(apiCallback)

  if (error !== undefined) {
    return (
      <Alert color="red" icon={<FiAlertCircle />} title={error.name}>
        {error.message}
      </Alert>
    )
  }

  if (loading) {
    return children({ data: value, loading }, refresh, setValue)
  }

  return children({ data: value, loading }, refresh, setValue)
}
