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
        await timeLocked.deposit(
            token.address, 
            await accounts[1].getAddress(), 
            ethers.utils.parseEther("1"),
            Math.floor(Date.now() / 1000) + 10
        );
        const amount = (await timeLocked.deposits(await accounts[1].getAddress(), token.address)).amount
        expect(amount).to.eq(ethers.utils.parseEther("1"));
    })

    it("should not deposit 0 amount", async () => {
        await token.approve(timeLocked.address, ethers.utils.parseEther("1"));
        await expect(timeLocked.deposit(
            token.address, 
            await accounts[1].getAddress(), 
            ethers.utils.parseEther("0"), 
            Math.floor(Date.now() / 1000) + 10
        )).to.be.revertedWith("Amount must be > 0")
    })

    it("should reject if claimer has no tokens", async () => {
        await expect(timeLocked.connect(accounts[2]).claim(token.address)).to.be.revertedWith("No funds to claim");
    })

    it("should reject if tokens are locked", async () => {
        await expect(timeLocked.connect(accounts[1]).claim(token.address)).to.be.revertedWith("Can't claim locked tokens");
    })

    it("should claim tokens", async() => {
        await wait(10);
        await timeLocked.connect(accounts[1]).claim(token.address);
        const balance = (await token.balanceOf(await accounts[1].getAddress())).toString();
        expect(balance).to.eq(ethers.utils.parseEther("1"));
    })

    it("should not be able to claim tokens twice", async () => {
        await expect(timeLocked.connect(accounts[1]).claim(token.address)).to.be.revertedWith("No funds to claim");
        const balance = (await token.balanceOf(await accounts[1].getAddress())).toString()
    })
})

const wait = (seconds: number = 10) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}