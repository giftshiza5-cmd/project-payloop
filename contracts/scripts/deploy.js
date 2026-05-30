const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;

  console.log("Deploying PayLoop contracts with:", deployer.address);
  console.log("Network:", network, "Chain ID:", chainId);

  const CircleVault = await hre.ethers.getContractFactory("CircleVault");
  const circleVault = await CircleVault.deploy();
  await circleVault.waitForDeployment();
  const circleVaultAddress = await circleVault.getAddress();

  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy();
  await lendingPool.waitForDeployment();
  const lendingPoolAddress = await lendingPool.getAddress();

  const CreditScore = await hre.ethers.getContractFactory("CreditScore");
  const creditScore = await CreditScore.deploy();
  await creditScore.waitForDeployment();
  const creditScoreAddress = await creditScore.getAddress();

  const LoopToken = await hre.ethers.getContractFactory("LoopToken");
  const loopToken = await LoopToken.deploy();
  await loopToken.waitForDeployment();
  const loopTokenAddress = await loopToken.getAddress();

  await loopToken.setRewardMinter(circleVaultAddress, true);

  const addresses = {
    network,
    chainId,
    contracts: {
      CircleVault: circleVaultAddress,
      LendingPool: lendingPoolAddress,
      CreditScore: creditScoreAddress,
      LoopToken: loopTokenAddress,
    },
  };

  const configPath = path.join(__dirname, "..", "..", "dashboard", "src", "lib", "config.js");
  const config = `export const payLoopContracts = ${JSON.stringify(addresses, null, 2)};\n`;

  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, config);

  console.log("CircleVault:", circleVaultAddress);
  console.log("LendingPool:", lendingPoolAddress);
  console.log("CreditScore:", creditScoreAddress);
  console.log("LoopToken:", loopTokenAddress);
  console.log("Saved frontend config:", configPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
