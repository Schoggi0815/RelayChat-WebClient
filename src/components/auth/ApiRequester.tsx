import { Skeleton } from '@mantine/core'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type ToFunctionType<R> = (abort: AbortSignal) => Promise<R>

export type ApiRequesterProps<R> = {
  apiCallback: ToFunctionType<R>
  children: (
    value: R | undefined,
    setValue: (value: R) => void,
    refresh: () => void
  ) => React.ReactNode
  skeleton?: boolean
  queryKey: string[]
}

export function ApiRequester<R>({
  apiCallback,
  children,
  skeleton,
  queryKey,
}: ApiRequesterProps<R>) {
  const queryClient = useQueryClient()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: ({ signal }) => apiCallback(signal),
  })

  if (error != null) {
    throw error
  }

  return (
    <Skeleton visible={skeleton && isLoading}>
      {children(data, v => queryClient.setQueryData<R>(queryKey, v), refetch)}
    </Skeleton>
  )
}
