import { expect } from "chai";
import { ethers } from "hardhat";
import { TimeLocked, ERC20Test } from "../typechain/";;
import { Signer } from 'ethers';

describe("TimeLocked contract", () => {
    let token: ERC20Test;
    let timeLocked: TimeLocked;
    let accounts: Signer[];

    before(async () => {
        accounts = await ethers.getSigners();
        const ERC20Test = await ethers.getContractFactory("ERC20Test");
        token = await ERC20Test.deploy(ethers.utils.parseEther("1")) as ERC20Test;

        const TimeLocked = await ethers.getContractFactory("TimeLocked");
        timeLocked = await TimeLocked.deploy() as TimeLocked;
    })

    it("should deposit tokens", async () => {
        await token.approve(timeLocked.address, ethers.utils.parseEther("1"));
        const timestamp = Math.floor(Date.now() / 1000) + 10;
        await timeLocked.deposit(token.address, await accounts[1].getAddress(), ethers.utils.parseEther("1"), timestamp)
        const amount = (await timeLocked.deposits(await accounts[1].getAddress(), token.address)).amount
        expect(amount).to.eq(ethers.utils.parseEther("1"));
    })

    it("should not deposit 0 amount", async () => {
        await token.approve(timeLocked.address, ethers.utils.parseEther("1"));
        const timestamp = Math.floor(Date.now() / 1000) + 10;
        await expect(timeLocked.deposit(
            token.address, 
            await accounts[1].getAddress(), 
            ethers.utils.parseEther("0"), 
            timestamp.toString()
        )).to.be.revertedWith("Amount must be > 0")
    })
})