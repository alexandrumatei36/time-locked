import { ethers } from "hardhat";

async function main() {
    const ERC20Test = await ethers.getContractFactory('ERC20Test');
    const erc20Test = await ERC20Test.deploy(ethers.utils.parseEther("100000000"))
    await erc20Test.deployed();
    console.log(`ERC20Test deployed to: ${erc20Test.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });