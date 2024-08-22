import { ApiResponse } from './models/ApiResponse'

export const get2 = async <T>(
  url: string,
  options: { jwt?: string; body?: unknown; abort: AbortSignal },
  isT: (value: unknown) => value is T
): Promise<T> =>
  await handleResponse2(
    await fetch(url, buildRequestInit2('GET', options)),
    isT
  )

export const buildRequestInit2 = (
  method: string,
  options: { jwt?: string; body?: unknown; abort: AbortSignal }
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

export const handleResponse2 = async <T>(
  response: Response,
  isT: (value: unknown) => value is T
): Promise<T> => {
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json: unknown = await response.json()
  if (!isT(json)) {
    throw new Error('Response does not match expected Type!')
  }
  return json
}

export const get = async <T>(
  url: string,
  body?: object | string,
  options?: {
    formData?: boolean
    headers?: object
    jwt?: string
    abort?: AbortController
  }
) => {
  if (options?.abort?.signal.aborted) {
    throw new Error('Aborted')
  }
  const response = await fetch(
    url,
    buildRequestInit('get', body, options, options?.jwt)
  )

  return handleResponse<T>(response)
}

export const post = async <T>(
  url: string,
  body: object | string,
  options?: {
    formData?: boolean
    headers?: object
    jwt?: string
    abort?: AbortController
  }
) => {
  const response = await fetch(
    url,
    buildRequestInit('post', body, options, options?.jwt)
  )

  return handleResponse<T>(response)
}

export const put = async <T = unknown>(
  url: string,
  body: object | string | boolean | undefined,
  options?: { formData?: boolean; jwt?: string; abort?: AbortController }
): ApiResponse<T> => {
  const response = await fetch(
    url,
    buildRequestInit('put', body, options, options?.jwt)
  )

  return handleResponse<T>(response)
}

export const patch = async <T = unknown>(
  url: string,
  body: object | string,
  options?: { formData?: boolean; jwt?: string; abort?: AbortController }
): ApiResponse<T> => {
  const response = await fetch(
    url,
    buildRequestInit('PATCH', body, options, options?.jwt)
  )

  return handleResponse<T>(response)
}

export const del = async <T = unknown>(
  url: string,
  options?: { jwt?: string; abort?: AbortController }
): ApiResponse<T> => {
  const response = await fetch(
    url,
    buildRequestInit('delete', undefined, undefined, options?.jwt)
  )

  return handleResponse<T>(response)
}

const handleResponse = async <T>(response: Response): ApiResponse<T> => {
  if (response.ok)
    return {
      ok: true,
      data: (await parseData(response)) as T,
    }

  let error = 'Unknowm error'
  if (response.status === 401) error = 'Incorrect Password'
  else error = await parseError(response.text())

  return {
    ok: false,
    error: error,
    status: response.status,
  }
}

const parseError = async (textPromise: Promise<string>) =>
  (await textPromise) || 'Unknowm error'

const parseData = async (response: Response) => {
  let data: unknown = undefined

  const isBlob =
    response.headers.get('content-type')?.startsWith('image/') ||
    response.headers
      .get('content-type')
      ?.startsWith(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
  const isText = response.headers.get('content-type')?.startsWith('text/plain')
  const isJson = response.headers
    .get('content-type')
    ?.startsWith('application/json')

  if (isBlob) data = await response.blob()
  if (isText) data = await response.text()
  if (isJson) data = await response.json()

  return data
}

const buildRequestInit = (
  method: string,
  body?: object | string | boolean | null,
  options?: {
    formData?: boolean
    headers?: object
    abort?: AbortController
  },
  jwt?: string
) => {
  const init: RequestInit = { method }

  if (body != null)
    init.body = options?.formData ? (body as BodyInit) : JSON.stringify(body)

  if (options?.headers) {
    init.headers = {
      ...options.headers,
    }
  }

  if (!options?.formData)
    init.headers = {
      ...init.headers,
      'Content-Type': 'application/json',
    }

  if (options?.abort) {
    init.signal = options.abort.signal
  }

  if (jwt)
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${jwt}`,
    }

  return init
}
