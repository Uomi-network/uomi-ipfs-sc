const hre = require("hardhat");


async function main() {

  const uomiEngine = "0xe0ae768C7aB413a10d07fDe2aC841C9F63793DD4"
  
  const lock = await hre.ethers.deployContract("IPFSStorage", [uomiEngine]);

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
