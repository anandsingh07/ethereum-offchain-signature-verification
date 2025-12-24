import { useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  async function connect() {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const walletSigner = await browserProvider.getSigner();

    setProvider(browserProvider);
    setSigner(walletSigner);
     console.log("Connected wallet:", await walletSigner.getAddress());
  }

  return { provider, signer, connect };
}
