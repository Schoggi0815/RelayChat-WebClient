export const createLock = () => {
  const queue: (() => Promise<void>)[] = []
  let active = false
  return <T>(fn: () => Promise<T>) => {
    let deferredResolve: (value: T) => void
    let deferredReject: (value: T) => void
    const deferred = new Promise<T>((resolve, reject) => {
      deferredResolve = resolve
      deferredReject = reject
    })
    const exec = async () => {
      await fn().then(deferredResolve, deferredReject)
      if (queue.length > 0) {
        queue.shift()?.().catch(console.error)
      } else {
        active = false
      }
    }
    if (active) {
      queue.push(exec)
    } else {
      active = true
      exec().catch(console.error)
    }
    return deferred
  }
}

export const parseJwt = (token: string): unknown => {
  const split = token.split('.')
  if (split.length < 2) {
    return undefined
  }

  const base64Url = split[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )

  return JSON.parse(jsonPayload)
}

export const hasExpiryDate = (data: unknown): data is { exp: number } =>
  typeof data === 'object' &&
  data != null &&
  'exp' in data &&
  typeof data.exp === 'number'

export const isListOf =
  <T>(isFunction: (value: unknown) => value is T) =>
  (value: unknown): value is T[] =>
    Array.isArray(value) && value.every(v => isFunction(v))
