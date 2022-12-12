import {ethers} from "hardhat";
import {MerkleTree} from "merkletreejs";
import keccak256 from "keccak256";
import {expect} from "chai";
import {Whitelist} from "../typechain-types";

const encodeLeaf = (address, allowance) => {
  // equivalent to `abi.encode(msg.sender, maxAllowanceToMint)`
  return ethers.utils.defaultAbiCoder.encode(
      ["address", "uint64"],
      [address.address, allowance]
  );
}

describe("Whitelist", async () => {
  let originalList;
  let whitelist: Whitelist;
  let merkleTree: MerkleTree;
  describe("Deployment", async () => {
    it("should deploy the contract", async () => {
      const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
      originalList = [
        encodeLeaf(owner, 2),
        encodeLeaf(addr1, 2),
        encodeLeaf(addr2, 2),
        encodeLeaf(addr3, 2),
        encodeLeaf(addr4, 2),
        encodeLeaf(addr5, 2),
      ];
      merkleTree = new MerkleTree(originalList, keccak256, {hashLeaves: true, sortPairs: true});
      const root = merkleTree.getHexRoot();
      console.log(merkleTree.toString());

      const factory = await ethers.getContractFactory("Whitelist");
      whitelist = await factory.deploy(root) as Whitelist;
      await whitelist.deployed();
    });
  });
  describe("Verify whitelist", async () => {
    it("should verify for existing whitelisted user", async () => {
      const leaf = keccak256(originalList[0]); // getting owner leaf
      const proof = merkleTree.getHexProof(leaf as string);

      const verified = await whitelist.isInWhitelist(proof, 2);
      expect(verified).to.be.true;

      const invalidAllowance = await whitelist.isInWhitelist(proof, 1);
      expect(invalidAllowance).to.be.false;
    });
    it('should not verify for no proof', async () => {
      const result = await whitelist.isInWhitelist([], 2);
      expect(result).to.be.false;
    })
  });
});
