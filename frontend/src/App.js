import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "./hooks/useWallet";
import { signExecution } from "./utils/signer";
import { executeViaRelayer } from "./services/relayer";

function App() {
  const { provider, signer, connect } = useWallet();
  const [status, setStatus] = useState("");

  async function signAndExecute() {
    try {
      setStatus("Signing...");

      const payload = await signExecution({
        signer,
        provider,
        actionData: ethers.toUtf8Bytes("HELLO_BLOCKCHAIN"),
        nonce: 0
      });

      setStatus("Sending to relayer...");

      const result = await executeViaRelayer(payload);

      if (result.success) {
        setStatus(`Success: ${result.txHash}`);
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Gasless Signed Execution</h2>

      {!signer && (
        <button onClick={connect}>
          Connect Wallet
        </button>
      )}

      {signer && (
        <button onClick={signAndExecute}>
          Sign & Execute
        </button>
      )}

      <p>{status}</p>
    </div>
  );
}

export default App;
