import { Skeleton } from '@mantine/core'
import { ApiRequesterPass } from './ApiRequesterPass'
import { ApiResponse } from '../../models/ApiResponse'

type ToFunctionType<R> = (abort: AbortController) => ApiResponse<R>

type CommonApiRequesterProps = {
  skeleton?: boolean
}

type ApiRequesterProps<R> = {
  apiCallback: ToFunctionType<R> | ToFunctionType<unknown>[]
  children: (
    value: R | unknown[] | undefined[] | undefined,
    refresh: () => void,
    setValue: (value: R | unknown[]) => void
  ) => React.ReactNode
}

export type ApiRequesterPropsSingle<R> = {
  apiCallback: ToFunctionType<R>
  children: (
    value: R | undefined,
    refresh: () => void,
    setValue: (value: R) => void
  ) => React.ReactNode
}

export function ApiRequester<R1, R2, R3, R4>(
  props: {
    apiCallback: [
      ToFunctionType<R1>,
      ToFunctionType<R2>,
      ToFunctionType<R3>,
      ToFunctionType<R4>
    ]
    children: (
      value: [R1, R2, R3, R4] | undefined[],
      refresh: () => void,
      setValue: (value: [R1, R2, R3, R4]) => void
    ) => React.ReactNode
  } & CommonApiRequesterProps
): React.ReactNode

export function ApiRequester<R1, R2, R3>(
  props: {
    apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>, ToFunctionType<R3>]
    children: (
      value: [R1, R2, R3] | undefined[],
      refresh: () => void,
      setValue: (value: [R1, R2, R3]) => void
    ) => React.ReactNode
  } & CommonApiRequesterProps
): React.ReactNode

export function ApiRequester<R1, R2>(
  props: {
    apiCallback: [ToFunctionType<R1>, ToFunctionType<R2>]
    children: (
      value: [R1, R2] | undefined[],
      refresh: () => void,
      setValue: (value: [R1, R2]) => void
    ) => React.ReactNode
  } & CommonApiRequesterProps
): React.ReactNode

export function ApiRequester<R>(
  props: ApiRequesterPropsSingle<R> & CommonApiRequesterProps
): React.ReactNode

export function ApiRequester<R>({
  apiCallback,
  children,
  skeleton,
}: ApiRequesterProps<R> & CommonApiRequesterProps) {
  return (
    <ApiRequesterPass apiCallback={apiCallback}>
      {({ data, loading }, refresh, set) => {
        const rederedChildren = children(
          loading && Array.isArray(apiCallback) ? [] : data,
          refresh,
          set
        )
        if (skeleton) {
          return (
            <Skeleton visible={loading && data === undefined}>
              {rederedChildren}
            </Skeleton>
          )
        }
        return rederedChildren
      }}
    </ApiRequesterPass>
  )
}
