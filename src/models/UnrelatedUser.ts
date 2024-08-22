import { hasProp, isObject } from './helper'

export type UnrelatedUser = {
  displayName: string
}

export const isUnrelateUser = (value: unknown): value is UnrelatedUser =>
  isObject(value) &&
  hasProp<UnrelatedUser, 'displayName'>(value, 'displayName', 'string')
