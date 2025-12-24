require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const relayerWallet = new ethers.Wallet(
  process.env.RELAYER_PRIVATE_KEY,
  provider
);

const vaultAbi = require("./vaultAbi.json");
const vault = new ethers.Contract(
  process.env.VAULT_ADDRESS,
  vaultAbi,
  relayerWallet
);

app.post("/execute", async (req, res) => {
  try {
    const { signer, actionData, nonce, signature } = req.body;

    const tx = await vault.execute(
      signer,
      actionData,
      nonce,
      signature
    );

    const receipt = await tx.wait();

    res.json({
      success: true,
      txHash: receipt.hash,
      gasUsed: receipt.gasUsed.toString()
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.reason || err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Relayer running on port 3000");
});
