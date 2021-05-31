import { ethers } from "hardhat";

async function main() {
    const TimeLocked = await ethers.getContractFactory('TimeLocked');
    const timeLocked = await TimeLocked.deploy()
    await timeLocked.deployed();
    console.log(`TimeLocked deployed to: ${timeLocked.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });