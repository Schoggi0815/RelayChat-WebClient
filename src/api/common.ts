import { post } from "../apiHelper";
import { PublicKeyCredentialJson } from "../models/auth/PublicKeyCredentialJson";

export const base = '/api/v1/'

export const postStartRegister = (email: string, username: string, displayname: string) =>
    post<PublicKeyCredentialCreationOptions>(`${base}/auth/registration/1`, {email, username, displayname})

export const postFinishRegister = (credential: PublicKeyCredentialJson) =>
    post(`${base}/auth/registration/2`, credential)