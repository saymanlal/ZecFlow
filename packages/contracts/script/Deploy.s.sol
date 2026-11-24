// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {ZecFlowToken} from "../src/ZecFlowToken.sol";
import {ZecFlowProtocol} from "../src/ZecFlowProtocol.sol";

contract Deploy is Script {
    error UnsupportedChain(uint256 chainId);

    function run() external returns (ZecFlowToken token, ZecFlowProtocol protocol) {
        if (block.chainid != 888001 && block.chainid != 31337) {
            revert UnsupportedChain(block.chainid);
        }
        vm.startBroadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));
        token = new ZecFlowToken();
        protocol = new ZecFlowProtocol(address(token));
        vm.stopBroadcast();
    }
}
