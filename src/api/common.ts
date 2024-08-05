import { post } from "../apiHelper";

export const base = '/api/v1/'

export const postStartRegister = (email: string, username: string, displayname: string) =>
    post<CredentialCreationOptions>(`${base}/auth/registration/1`, {email, username, displayname})