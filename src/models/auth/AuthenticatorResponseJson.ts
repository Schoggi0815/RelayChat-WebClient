export type AuthenticatorResponseJson = {
    clientDataJson: string
    attestationObject: string
}

export const toAuthenticatorResponseJson = (response: AuthenticatorResponse): AuthenticatorResponseJson => {
    const dec = new TextDecoder()
    if ('attestationObject' in response) {
        return {
            clientDataJson: dec.decode(response.clientDataJSON),
            attestationObject: dec.decode(response.attestationObject as unknown as ArrayBuffer)
        }
    }
    throw new Error("No attestation object");
}