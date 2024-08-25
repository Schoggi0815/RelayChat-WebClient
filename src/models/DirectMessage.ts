import { hasProp, hasPropObjectNullable, isObject } from './helper'
import { isUnrelateUser, UnrelatedUser } from './UnrelatedUser'

export type DirectMessage = {
  id: string
  senderId: string
  receiverId: string
  sender?: UnrelatedUser
  receiver?: UnrelatedUser
  sentAt: string
  message: string
  read: boolean
}

export const isDirectMessage = (value: unknown): value is DirectMessage =>
  isObject(value) &&
  hasProp<DirectMessage, 'id'>(value, 'id', 'string') &&
  hasProp<DirectMessage, 'senderId'>(value, 'senderId', 'string') &&
  hasProp<DirectMessage, 'receiverId'>(value, 'receiverId', 'string') &&
  hasPropObjectNullable<UnrelatedUser>(value, 'sender', isUnrelateUser) &&
  hasPropObjectNullable<UnrelatedUser>(value, 'receiver', isUnrelateUser) &&
  hasProp<DirectMessage, 'sentAt'>(value, 'sentAt', 'string') &&
  hasProp<DirectMessage, 'message'>(value, 'message', 'string') &&
  hasProp<DirectMessage, 'read'>(value, 'read', 'boolean')
