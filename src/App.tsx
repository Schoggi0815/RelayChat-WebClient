import { Button } from "@mantine/core";
import "./App.css";
import { postFinishRegister, postStartRegister } from "./api/common";
import { toPublicKeyCredentialJson } from "./models/auth/PublicKeyCredentialJson";

function App() {
  const startRegistration = async () => {
    const result = await postStartRegister(
      "matt.bossi@bluewin.ch",
      "Schoggi",
      "Schoggi"
    );
    if (result.ok) {
      const enc = new TextEncoder();
      result.data.user.id = enc.encode(
        result.data.user.id as unknown as string
      );
      result.data.challenge = enc.encode(
        result.data.challenge as unknown as string
      );

      console.log(result.data);
      const created = await navigator.credentials.create({
        publicKey: result.data,
      });
      console.log(created);

      if (created != null && created instanceof PublicKeyCredential) {
        const result2 = await postFinishRegister(
          toPublicKeyCredentialJson(created)
        );
        console.log(result2);
      }
    }
  };

  return <Button onClick={startRegistration}>Register</Button>;
}

export default App;
