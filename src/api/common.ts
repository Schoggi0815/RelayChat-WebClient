import {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json'
import { get, post } from '../apiHelper'
import { isTokenDto } from '../models/TokenDto'

export const base = '/api/v1/'

export const postStartRegister = (email: string, displayname: string) =>
  post(
    `${base}auth/registration/1`,
    {
      body: {
        email,
        displayname,
      },
    },
    (value): value is CredentialCreationOptionsJSON =>
      typeof value === 'object' &&
      value != null &&
      'publicKey' in value &&
      typeof value.publicKey === 'object'
  )

export const postFinishRegister = (
  credential: PublicKeyCredentialWithAttestationJSON,
  tokenName: string
) =>
  post(
    `${base}auth/registration/2`,
    {
      body: {
        responseJson: credential,
        tokenDescription: tokenName,
      },
    },
    isTokenDto
  )

export const postStartLogin = () =>
  post(
    `${base}auth/login/1`,
    {},
    (value): value is CredentialRequestOptionsJSON =>
      typeof value === 'object' && value != null
  )

export const postFinishLogin = (
  credential: PublicKeyCredentialWithAssertionJSON
) => post(`${base}auth/login/2`, { body: credential }, isTokenDto)

export const postRefresh = (token: string, refreshToken: string) =>
  post(`${base}auth/refresh`, { body: { token, refreshToken } }, isTokenDto)

export const getUserInformation = (abort: AbortSignal, jwt: string) =>
  get(
    `${base}user/me`,
    { jwt, abort },
    (value: unknown) => typeof value === 'string'
  )
