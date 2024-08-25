import { get, post } from '../apiHelper'
import { isDirectMessage } from '../models/DirectMessage'
import { isListOf } from '../utils'
import { base } from './common'

export const getMessages = (otherId: string, abort: AbortSignal, jwt: string) =>
  get(`${base}messages/${otherId}`, { abort, jwt }, isListOf(isDirectMessage))

export const sendNewMessage = (
  toId: string,
  message: string,
  sentAt: string,
  jwt: string
) =>
  post(
    `${base}messages/${toId}`,
    { jwt, body: { message, sentAt } },
    isDirectMessage
  )
