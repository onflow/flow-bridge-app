// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "./MyOFT.sol";

contract MyOFTFungi is MyOFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) MyOFT(_name, _symbol, _lzEndpoint, _delegate) {
    }
}
