// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TimeLocked is Ownable {
    struct Deposit {
        address token;
        uint256 amount;
        uint unlockTimestamp;
    }

    mapping(address => mapping(address => Deposit)) public deposits;

    function deposit(address tokenAddress, address unlocker, uint256 amount, uint unlockTimestamp) public onlyOwner {
        require(amount > 0, "Amount must be > 0");
        IERC20 token = IERC20(tokenAddress);
        deposits[unlocker][tokenAddress] = Deposit(tokenAddress, amount, unlockTimestamp);
        token.transferFrom(msg.sender, address(this), amount);
    }
}
