import { expect } from "chai";
import { ethers, network } from "hardhat";
import { POOL_ADDRESS_PROVIDER, DAI, DAI_WHALE} from './setup';
import {FlashLoan, IERC20} from "../typechain-types";

describe("FlashLoan", async () => {
  let flashLoan: FlashLoan;
  describe("Deployment", async () => {
    it("should deploy the contract", async () => {
    const contract = await ethers.getContractFactory("FlashLoan");
    flashLoan = await contract.deploy(POOL_ADDRESS_PROVIDER);
    await flashLoan.deployed();
    });
  });
  describe("Execute Flash loan", async () => {
    it("should be able to execute the transaction", async () => {
      const token = await ethers.getContractAt("IERC20", DAI) as any;
      const balance = ethers.utils.parseEther("2000");

      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [DAI_WHALE]
      });
      const signer = await ethers.getSigner(DAI_WHALE);
      await token.connect(signer).transfer(flashLoan.address, balance);

      const tx = await flashLoan.createFlashLoan(DAI, 1000);
      await tx.wait();
      const remainingBal = await token.balanceOf(flashLoan.address);
      expect(remainingBal.lt(balance)).to.be.true;

      // original balance = 2000
      // after flash loan = 2000 + 1000 = 3000
      // loan is repaid with some premium = 3000 - 1000 - pre = <2000
    })
  })
});
