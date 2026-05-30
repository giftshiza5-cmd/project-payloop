import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

export const polygonChainId = "0x89";

export const polygonParams = {
  chainId: polygonChainId,
  chainName: "Polygon",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],
};

export const contractAddresses = {
  circleVault: process.env.EXPO_PUBLIC_CIRCLE_VAULT_ADDRESS || "",
  lendingPool: process.env.EXPO_PUBLIC_LENDING_POOL_ADDRESS || "",
  creditScore: process.env.EXPO_PUBLIC_CREDIT_SCORE_ADDRESS || "",
  loopToken: process.env.EXPO_PUBLIC_LOOP_TOKEN_ADDRESS || "",
};

export const circleVaultAbi = [
  "function contribute(uint256 groupId) payable",
  "function groups(uint256 groupId) view returns (string name, address creator, uint256 balance, uint256 totalContributions, uint256 signerCount, uint256 approvalThreshold, bool exists)",
  "function contributions(uint256 groupId, address member) view returns (uint256)",
];

export const lendingPoolAbi = [
  "function requestLoan(uint256 groupId, uint256 amount, string purpose) returns (uint256)",
  "function loans(uint256 loanId) view returns (uint256 groupId, address borrower, uint256 amount, string purpose, uint256 approvals, uint256 rejections, uint256 voteDeadline, uint8 status)",
];

export const creditScoreAbi = [
  "function calculateScore(address member) view returns (uint256)",
  "function profiles(address member) view returns (uint256 onTimeContributions, uint256 lateContributions, uint256 loansRepaid, uint256 loansDefaulted, uint256 score, bool exists)",
];

export function requireContractAddress(address, label) {
  if (!address) {
    throw new Error(`${label} address is missing. Add it to mobile/.env after Amoy deployment.`);
  }
}

export async function getSigner(provider) {
  const ethersProvider = new BrowserProvider(provider);
  return ethersProvider.getSigner();
}

export async function getReadWriteContract(provider, address, abi, label) {
  requireContractAddress(address, label);
  const signer = await getSigner(provider);
  return new Contract(address, abi, signer);
}

export async function getReadOnlyContract(provider, address, abi, label) {
  requireContractAddress(address, label);
  const ethersProvider = new BrowserProvider(provider);
  return new Contract(address, abi, ethersProvider);
}

export function toWei(amount) {
  return parseEther(amount || "0");
}

export function fromWei(amount) {
  return formatEther(amount || 0);
}
