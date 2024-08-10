import {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json'
import { get, post } from '../apiHelper'
import { TokenDto } from '../models/TokenDto'

export const base = '/api/v1/'

export const postStartRegister = (email: string, displayname: string) =>
  post<CredentialCreationOptionsJSON>(`${base}auth/registration/1`, {
    email,
    displayname,
  })

export const postFinishRegister = (
  credential: PublicKeyCredentialWithAttestationJSON,
  tokenName: string
) =>
  post<TokenDto>(`${base}auth/registration/2`, {
    responseJson: credential,
    tokenDescription: tokenName,
  })

export const postStartLogin = () =>
  post<CredentialRequestOptionsJSON>(`${base}auth/login/1`, {})

export const postFinishLogin = (
  credential: PublicKeyCredentialWithAssertionJSON
) => post<TokenDto>(`${base}auth/login/2`, credential)

export const postRefresh = (token: string, refreshToken: string) =>
  post<TokenDto>(`${base}auth/refresh`, { token, refreshToken })

export const getUserInformation = (abort: AbortController, jwt: string) =>
  get<string>(`${base}user/me`, undefined, { jwt, abort })
