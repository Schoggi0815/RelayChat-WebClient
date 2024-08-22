import { get } from '../apiHelper'
import { isUnrelateUser } from '../models/UnrelatedUser'
import { isListOf } from '../utils'
import { base } from './common'

export const searchUsers = (abort: AbortSignal, jwt: string) =>
  get(`${base}/users`, { jwt, abort }, isListOf(isUnrelateUser))
