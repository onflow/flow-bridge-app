// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyFungi is ERC20, Ownable {
    constructor() ERC20("MyFungi", "FUNGI") Ownable(msg.sender) {
        // Mint 10000 tokens to the deployer
        // Note: ERC20 uses 18 decimals by default, so we multiply by 10^18
        _mint(msg.sender, 10000 * 10**decimals());
    }
}
