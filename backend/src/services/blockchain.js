const { ethers } = require("ethers");

const circleVaultAbi = [
  "function contribute(uint256 groupId) external payable",
];

function amountToWei(amountKes) {
  const rate = Number(process.env.KES_TO_NATIVE_RATE || "0");
  if (!rate) {
    throw new Error("KES_TO_NATIVE_RATE is required to convert M-Pesa KES into native token value");
  }

  const nativeAmount = Number(amountKes) * rate;
  const decimal = nativeAmount.toFixed(18).replace(/0+$/, "").replace(/\.$/, "");
  return ethers.parseEther(decimal);
}

async function contributeToVault({ groupId, amountKes }) {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SERVER_WALLET_PRIVATE_KEY, provider);
  const vault = new ethers.Contract(process.env.CIRCLE_VAULT_ADDRESS, circleVaultAbi, wallet);
  const tx = await vault.contribute(groupId, { value: amountToWei(amountKes) });
  const receipt = await tx.wait(Number(process.env.CHAIN_CONFIRMATIONS || "1"));

  return { hash: tx.hash, blockNumber: receipt.blockNumber };
}

module.exports = { contributeToVault };
