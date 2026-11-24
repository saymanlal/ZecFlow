// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ZecFlowToken} from "../src/ZecFlowToken.sol";
import {IZecFlowToken} from "../src/IZecFlowToken.sol";

contract ZecFlowTokenTest is Test {
    ZecFlowToken private token;
    address private dana = makeAddr("dana");

    function setUp() public {
        token = new ZecFlowToken();
    }

    function test_metadataDisclosesDemoToken() public view {
        assertEq(token.name(), "ZecFlowToken");
        assertEq(token.symbol(), "ZFT");
        assertEq(token.decimals(), 6);
    }

    function test_faucetMintsToCaller() public {
        vm.prank(dana);
        token.faucet(100e6);
        assertEq(token.balanceOf(dana), 100e6);
    }

    function test_faucetRejectsAboveLimit() public {
        uint256 limit = token.FAUCET_LIMIT();
        vm.expectRevert(
            abi.encodeWithSelector(IZecFlowToken.FaucetLimitExceeded.selector, limit + 1, limit)
        );
        vm.prank(dana);
        token.faucet(limit + 1);
    }
}
