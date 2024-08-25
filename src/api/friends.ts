import { get, post } from '../apiHelper'
import { isFriendRequest } from '../models/FriendRequest'
import { isUnrelateUser } from '../models/UnrelatedUser'
import { isListOf } from '../utils'
import { base } from './common'

export const getFriends = (abort: AbortSignal, jwt: string) =>
  get(`${base}users/friends`, { jwt, abort }, isListOf(isUnrelateUser))

export const searchUsers = (abort: AbortSignal, jwt: string) =>
  get(`${base}users`, { jwt, abort }, isListOf(isUnrelateUser))

export const postFriendRequest = (receiverId: string, jwt: string) =>
  post(`${base}users/${receiverId}/friends`, { jwt }, isFriendRequest)

export const getSentFriendRequests = (abort: AbortSignal, jwt: string) =>
  get(
    `${base}users/friend-requests/sent`,
    { jwt, abort },
    isListOf(isFriendRequest)
  )

export const getReceivedFriendRequests = (abort: AbortSignal, jwt: string) =>
  get(
    `${base}users/friend-requests/received`,
    { jwt, abort },
    isListOf(isFriendRequest)
  )

export const postAcceptFriendRequest = (senderId: string, jwt: string) =>
  post(
    `${base}users/friend-requests/${senderId}/accept`,
    { jwt },
    isUnrelateUser
  )

export const getUnreadFriendRequests = (abort: AbortSignal, jwt: string) =>
  get(
    `${base}users/friend-requests/unread`,
    { jwt, abort },
    isListOf(isFriendRequest)
  )

export const markAllFriendRequestsAsRead = (jwt: string) =>
  post(
    `${base}users/friend-requests/read`,
    { jwt },
    (value: unknown): value is undefined => value === undefined
  )
