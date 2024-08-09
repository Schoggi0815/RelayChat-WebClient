import { create, get } from "@github/webauthn-json";
import { Button } from "@mantine/core";
import "./App.css";
import {
  postFinishLogin,
  postFinishRegister,
  postStartLogin,
  postStartRegister,
} from "./api/common";

function App() {
  const startRegistration = async () => {
    const result = await postStartRegister(
      "matt.bossi@bluewin.ch",
      "Schoggi",
      "Schoggi"
    );
    if (result.ok) {
      console.log(result.data);
      const created = await create(result.data.options);
      console.log(created);
      const result2 = await postFinishRegister(
        created,
        result.data.registrationCeremonyId
      );
      console.log(result2);
    }
  };

  const logIn = async () => {
    const result = await postStartLogin();
    console.log(result);
    if (!result.ok) {
      return;
    }

    const getResult = await get(result.data.options);
    const result2 = await postFinishLogin(
      getResult,
      result.data.authenticationCeremonyId
    );
    console.log(result2);
  };

  return (
    <>
      <Button onClick={startRegistration}>Register</Button>
      <Button onClick={logIn}>Login</Button>
    </>
  );
}

export default App;
