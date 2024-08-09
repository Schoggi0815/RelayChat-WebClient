import { CredentialRequestOptionsJSON } from "@github/webauthn-json";

export type StartLoginResponse = {
  options: CredentialRequestOptionsJSON;
  authenticationCeremonyId: string;
};
