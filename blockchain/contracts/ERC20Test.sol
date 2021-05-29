// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Test is ERC20 {
    constructor(uint256 supply) ERC20("ERC20Test", "TST") {
        _mint(msg.sender, supply);
    }
}
