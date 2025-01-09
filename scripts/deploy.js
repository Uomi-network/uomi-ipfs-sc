const hre = require("hardhat");


async function main() {

  const uomiEngine = "0x687528e4BC4040DC9ADBA05C1f00aE3633faa731"
  
  const lock = await hre.ethers.deployContract("IPFSStorage", [uomiEngine]);

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
