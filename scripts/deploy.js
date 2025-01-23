const hre = require("hardhat");

const UOMI_ENGINE_ADDRESS = "0x687528e4BC4040DC9ADBA05C1f00aE3633faa731";

async function main() {
  const lock = await hre.ethers.deployContract("IPFSStorage", [UOMI_ENGINE_ADDRESS]);

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
