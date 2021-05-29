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
    address forwarder;

    function deposit(address tokenAddress, address unlocker, uint256 amount, uint unlockTimestamp) external onlyOwner {
        require(amount > 0, "Amount must be > 0");

        IERC20 token = IERC20(tokenAddress);
        Deposit storage d = deposits[unlocker][tokenAddress];
        d.token = tokenAddress;
        d.amount = amount;
        d.unlockTimestamp = unlockTimestamp;

        token.transferFrom(msg.sender, address(this), amount);
    }

    function claim(address tokenAddress) external {
        address sender = _sender();
        Deposit storage d = deposits[sender][tokenAddress];
        require(d.token != address(0), "No funds to claim");
        require(block.timestamp > d.unlockTimestamp, "Can't claim locked tokens");
        uint256 amount = d.amount;
        delete deposits[sender][tokenAddress];
        IERC20 token = IERC20(tokenAddress);
        token.transfer(sender, amount);
    }

    function setForwarder(address forwarderAddress) external onlyOwner {
        forwarder = forwarderAddress;
    }

    function isTrustedForwarder(address forwarderAddress) public view returns(bool) {
        return forwarderAddress == forwarder;
    }

    function _sender() internal view returns (address signer) {
        signer = msg.sender;

        if (msg.data.length >= 20 && isTrustedForwarder(msg.sender)) {
            assembly {
                signer := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        }
    }
}
