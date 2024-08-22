import { hasProp, isObject } from './helper'

export type TokenDto = {
  token: string
  refreshToken: string
}

export const isTokenDto = (value: unknown): value is TokenDto =>
  isObject(value) &&
  hasProp<TokenDto, 'token'>(value, 'token', 'string') &&
  hasProp<TokenDto, 'refreshToken'>(value, 'refreshToken', 'string')
