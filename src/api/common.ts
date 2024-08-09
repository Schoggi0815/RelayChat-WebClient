import {
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
} from "@github/webauthn-json";
import { post } from "../apiHelper";
import { StartRegisterResponse } from "../models/StartRegisterResponse";
import { StartLoginResponse } from "../models/StartloginResponse";

export const base = "/api/v1/";

export const postStartRegister = (
  email: string,
  username: string,
  displayname: string
) =>
  post<StartRegisterResponse>(`${base}auth/registration/1`, {
    email,
    username,
    displayname,
  });

export const postFinishRegister = (
  credential: PublicKeyCredentialWithAttestationJSON,
  registrationCeremonyId: string
) =>
  post(`${base}auth/registration/2`, {
    responseJson: credential,
    registrationCeremonyId,
  });

export const postStartLogin = () =>
  post<StartLoginResponse>(`${base}auth/login/1`, {});

export const postFinishLogin = (
  credential: PublicKeyCredentialWithAssertionJSON,
  authenticationCeremonyId: string
) =>
  post(`${base}auth/login/2`, {
    responseJson: credential,
    authenticationCeremonyId,
  });
