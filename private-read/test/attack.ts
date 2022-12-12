import { expect } from "chai";
import {Login} from "../typechain-types";
import {ethers} from "hardhat";

describe("Login", function () {
  let login: Login;

  beforeEach(async () => {
    const contract = await ethers.getContractFactory("Login");
    login = await contract.deploy(
        ethers.utils.formatBytes32String("secret"),
        ethers.utils.formatBytes32String("secretpassword")
    );
    await login.deployed();
  })

  it("should be able to read private vars from the node", async () => {
    const slot0 = await ethers.provider.getStorageAt(login.address, 0);
    const slot1 = await ethers.provider.getStorageAt(login.address, 1);

    expect(ethers.utils.parseBytes32String(slot0)).to.eql("secret");
    expect(ethers.utils.parseBytes32String(slot1)).to.eql("secretpassword");
  })
});
