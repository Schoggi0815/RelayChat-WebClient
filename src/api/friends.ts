import { get2 } from '../apiHelper'
import { isUnrelateUser } from '../models/UnrelatedUser'
import { isListOf } from '../utils'
import { base } from './common'

export const searchUsers = (abort: AbortSignal, jwt: string) =>
  get2(`${base}/users`, { jwt, abort }, isListOf(isUnrelateUser))
