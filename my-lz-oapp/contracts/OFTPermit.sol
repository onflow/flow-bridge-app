// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

abstract contract OFTPermit is OFT, ERC20Permit {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _owner
    ) OFT(_name, _symbol, _lzEndpoint, _owner)
      ERC20Permit(_name) {}
}
