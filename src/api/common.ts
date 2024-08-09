import {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json'
import { get, post } from '../apiHelper'

export const base = '/api/v1/'

export const postStartRegister = (email: string, displayname: string) =>
  post<CredentialCreationOptionsJSON>(`${base}auth/registration/1`, {
    email,
    displayname,
  })

export const postFinishRegister = (
  credential: PublicKeyCredentialWithAttestationJSON
) => post(`${base}auth/registration/2`, credential)

export const postStartLogin = () =>
  post<CredentialRequestOptionsJSON>(`${base}auth/login/1`, {})

export const postFinishLogin = (
  credential: PublicKeyCredentialWithAssertionJSON
) => post(`${base}auth/login/2`, credential)

export const postSignout = () => post(`${base}auth/signout`, {})

export const getUserInformation = () => get<string>(`${base}user/me`)
