import { FetchError } from './api/fetchError'

export const get = async <T>(
  url: string,
  options: { jwt?: string; body?: unknown; abort: AbortSignal },
  isT: (value: unknown) => value is T
): Promise<T> =>
  await handleResponse(await fetch(url, buildRequestInit('GET', options)), isT)

export const post = async <T>(
  url: string,
  options: {
    jwt?: string
    body?: unknown
  },
  isT: (value: unknown) => value is T
) =>
  await handleResponse(await fetch(url, buildRequestInit('POST', options)), isT)

export const buildRequestInit = (
  method: string,
  options: { jwt?: string; body?: unknown; abort?: AbortSignal }
) => {
  const init: RequestInit = { method }

  if (options.body != null) init.body = JSON.stringify(options.body)

  init.headers = {
    ...init.headers,
    'Content-Type': 'application/json',
  }

  init.signal = options.abort

  if (options.jwt)
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${options.jwt}`,
    }

  return init
}

export const handleResponse = async <T>(
  response: Response,
  isT: (value: unknown) => value is T
): Promise<T> => {
  if (!response.ok) {
    throw new FetchError(response.statusText, response.status)
  }

  let json: unknown = undefined
  if (response.status !== 204) {
    json = await response.json()
  }
  if (!isT(json)) {
    throw new Error(
      'Response does not match expected Type. Make sure your client is up to date.'
    )
  }
  return json
}
