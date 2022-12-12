import { expect } from "chai";
import { ethers } from "hardhat";
import {Attack, Good, Helper} from "../typechain-types";

describe("Attack", function () {
  let attack: Attack;
  let helper: Helper;
  let good: Good;

  beforeEach(async () => {
    const helperContract = await ethers.getContractFactory("Helper");
    helper = await helperContract.deploy();
    await helper.deployed();

    const goodContract = await ethers.getContractFactory("Good");
    good = await goodContract.deploy(helper.address);
    await good.deployed();

    const attackContract = await ethers.getContractFactory("Attack");
    attack = await attackContract.deploy(good.address);
    await attack.deployed();
  });

  it("should perform the attack", async () => {
    const tx = await attack.attack();
    await tx.wait();

    const owner = await good.owner();
    expect(owner).to.eql(attack.address);
  })
});
