import { CredentialCreationOptionsJSON } from "@github/webauthn-json";

export type StartRegisterResponse = {
  options: CredentialCreationOptionsJSON;
  registrationCeremonyId: string;
};
