import { useCallback, useContext } from 'react'
import { LoginContext } from '../LoginContext'

type OmitJwt<P> = P extends [...infer R, jwt: string] ? R : never

export const useAuthedRequest = <
  RestP extends OmitJwt<[...unknown[], jwt: string]>,
  R
>(
  apiFunction: ((...args: [...RestP, jwt: string]) => R) | undefined
): ((...args: RestP) => Promise<Awaited<R>>) => {
  const loginContext = useContext(LoginContext)

  const callback = useCallback(
    async (...args: RestP): Promise<Awaited<R>> => {
      if (!apiFunction) {
        throw new Error('No Function defined')
      }
      return await Promise.resolve(
        apiFunction(...args, await loginContext.getJwt())
      )
    },
    [loginContext, apiFunction]
  )

  return callback
}
