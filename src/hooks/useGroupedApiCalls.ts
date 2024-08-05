import { useCallback } from 'react'
import { ApiResponse } from '../models/ApiResponse'

type ToFunctionType<R> = (abort: AbortController) => ApiResponse<R>

export const useGroupedApiCalls = (
  ...apiCalls: ToFunctionType<unknown>[]
): ToFunctionType<unknown[]> => {
  const getAllApiRequests: (abort: AbortController) => ApiResponse<unknown[]> =
    useCallback(
      async (abort: AbortController) => {
        const results = await Promise.all(apiCalls.map(a => a(abort)))
        const failed = results.filter(r => !r.ok)
        if (failed[0] != undefined) {
          return failed[0]
        }
        try {
          return {
            ok: true,
            data: results.map(r => {
              if (!r.ok) {
                throw new Error(r.error)
              }
              return r.data
            }),
          }
        } catch (error) {
          return {
            ok: false,
            error: typeof error === 'string' ? error : 'Something went wrong',
            status: 0,
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...apiCalls]
    )

  return getAllApiRequests
}
