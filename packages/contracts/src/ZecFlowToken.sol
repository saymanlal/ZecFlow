// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IZecFlowToken} from "./IZecFlowToken.sol";

contract ZecFlowToken is ERC20, IZecFlowToken {
    uint256 public constant FAUCET_LIMIT = 1_000 * 10 ** 6;

    constructor() ERC20("ZecFlowToken", "ZFT") {}

    function decimals() public pure override(ERC20, IERC20Metadata) returns (uint8) {
        return 6;
    }

    function faucet(uint256 amount) external {
        if (amount > FAUCET_LIMIT) revert FaucetLimitExceeded(amount, FAUCET_LIMIT);
        _mint(msg.sender, amount);
    }
}
