import { hasProp, hasPropObjectNullable, isObject } from './helper'
import { isUnrelateUser, UnrelatedUser } from './UnrelatedUser'

export type FriendRequest = {
  senderId: string
  receiverId: string
  sender?: UnrelatedUser
  receiver?: UnrelatedUser
}

export const isFriendRequest = (value: unknown): value is FriendRequest =>
  isObject(value) &&
  hasProp<FriendRequest, 'senderId'>(value, 'senderId', 'string') &&
  hasProp<FriendRequest, 'receiverId'>(value, 'receiverId', 'string') &&
  hasPropObjectNullable(value, 'sender', isUnrelateUser) &&
  hasPropObjectNullable(value, 'receiver', isUnrelateUser)
