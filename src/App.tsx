import { Button } from "@mantine/core";
import "./App.css";
import { postStartRegister } from "./api/common";

function App() {
  const startRegistration = async () => {
    const result = await postStartRegister(
      "matt.bossi@bluewin.ch",
      "Schoggi",
      "Schoggi"
    );
    if (result.ok) {
      console.log(result.data);
      await navigator.credentials.create({ publicKey: result.data });
    }
  };

  return <Button onClick={startRegistration}>Register</Button>;
}

export default App;
