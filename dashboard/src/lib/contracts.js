export const circleVaultAbi = [
  {
    type: "function",
    name: "createGroup",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "members", type: "address[]" },
      { name: "signers", type: "address[]" },
      { name: "approvalThreshold", type: "uint256" },
    ],
    outputs: [{ name: "groupId", type: "uint256" }],
  },
  {
    type: "function",
    name: "addMember",
    stateMutability: "nonpayable",
    inputs: [
      { name: "groupId", type: "uint256" },
      { name: "member", type: "address" },
      { name: "signer", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approveWithdrawal",
    stateMutability: "nonpayable",
    inputs: [{ name: "requestId", type: "uint256" }],
    outputs: [],
  },
];

export const circleVaultAddress = process.env.NEXT_PUBLIC_CIRCLE_VAULT_ADDRESS;
export const circleVaultBytecode = process.env.NEXT_PUBLIC_CIRCLE_VAULT_BYTECODE;
