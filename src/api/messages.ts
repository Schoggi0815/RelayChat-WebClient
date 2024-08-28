import { get } from '../apiHelper'
import { isDirectMessage } from '../models/DirectMessage'
import { isPagination } from '../models/Pagination'
import { base } from './common'

export const getMessages = (
  otherId: string,
  offset: number,
  take: number,
  abort: AbortSignal,
  jwt: string
) =>
  get(
    `${base}messages/${otherId}?offset=${offset}&take=${take}`,
    { abort, jwt },
    isPagination(isDirectMessage)
  )
