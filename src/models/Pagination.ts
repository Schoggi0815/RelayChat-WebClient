import { hasArrayProp, hasProp, isObject } from './helper'

export type Pagination<T> = {
  offset: number
  take: number
  items: T[]
  hasMore: boolean
}

export const isPagination =
  <T>(isT: (value: unknown) => value is T) =>
  (value: unknown): value is Pagination<T> =>
    isObject(value) &&
    hasProp<Pagination<T>, 'offset'>(value, 'offset', 'number') &&
    hasProp<Pagination<T>, 'take'>(value, 'take', 'number') &&
    hasProp<Pagination<T>, 'hasMore'>(value, 'hasMore', 'boolean') &&
    hasArrayProp<T>(value, 'items', isT)
