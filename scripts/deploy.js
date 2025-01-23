const hre = require("hardhat");


async function main() {

  const uomiEngine = "0xDB5e49D00321ACC34C76Af6fa02E7D9766b6e0F5"
  
  const lock = await hre.ethers.deployContract("IPFSStorage", [uomiEngine]);

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
