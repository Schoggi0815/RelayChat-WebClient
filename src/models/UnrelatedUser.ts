import { hasProp, isObject } from './helper'

export type UnrelatedUser = {
  id: string
  displayName: string
}

export const isUnrelateUser = (value: unknown): value is UnrelatedUser =>
  isObject(value) &&
  hasProp<UnrelatedUser, 'id'>(value, 'id', 'string') &&
  hasProp<UnrelatedUser, 'displayName'>(value, 'displayName', 'string')
