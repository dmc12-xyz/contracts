import { expect } from "chai";
import { ethers } from "hardhat";
import {BadContract, GoodContract} from "../typechain-types";
import {beforeEach} from "mocha";

import {parseEther} from "ethers/lib/utils";

describe("Attack", function () {
  let goodContract: GoodContract;
  let badContract: BadContract;

  describe("Good vs Bad", function () {
    beforeEach(async () => {
      const good = await ethers.getContractFactory("GoodContract");
      goodContract = await good.deploy();
      await goodContract.deployed();

      const bad = await ethers.getContractFactory("BadContract");
      badContract = await bad.deploy(goodContract.address);
      await badContract.deployed();
    });

    it('should allow good contract to accept amount', async () => {
      const [_, user] = await ethers.getSigners();
      // transferring 10 eth to good contract
      const tx = await goodContract.connect(user).addBalance({
        value: parseEther("10")
      });
      await tx.wait();

      const balance = await ethers.provider.getBalance(goodContract.address);
      expect(balance).to.eql(parseEther("10"));
    });

    it('should attack good contract and withdraw all funds', async () => {
      const [_, user, attacker] = await ethers.getSigners();
      let tx = await goodContract.connect(user).addBalance({
        value: parseEther("10")
      });
      await tx.wait();

      // start attack by transferring 1 eth to good contract
      tx = await badContract.connect(attacker).attack({
        value: parseEther("1")
      });
      await tx.wait();

      const balance = await ethers.provider.getBalance(goodContract.address);
      expect(balance).to.eql(parseEther("0"));

      const stolen = await ethers.provider.getBalance(badContract.address);
      expect(stolen).to.eql(parseEther("11")); // 10 stolen from good contract + 1 attack starter
    })
  });
});
