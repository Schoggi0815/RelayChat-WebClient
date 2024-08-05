import { AuthenticatorResponseJson, toAuthenticatorResponseJson } from "./AuthenticatorResponseJson"

export type PublicKeyCredentialJson = {
    id: string
    rawId: string
    response: AuthenticatorResponseJson
    authenticatorAttachment: string | null
    type: string
    clientExtensionResults: AuthenticationExtensionsClientOutputs
}

export const toPublicKeyCredentialJson = (credential: PublicKeyCredential): PublicKeyCredentialJson => {
    const dec = new TextDecoder()
    return {
        authenticatorAttachment: credential.authenticatorAttachment,
        id: credential.id,
        rawId: dec.decode(credential.rawId),
        type: credential.type,
        response: toAuthenticatorResponseJson(credential.response),
        clientExtensionResults: credential.getClientExtensionResults()
    }
}