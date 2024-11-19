// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

// import SuperTokenV1Library
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

using SuperTokenV1Library for ISuperToken;

/**
 * @title FlowForwarder
 * @dev can be used to credibly lock and flow-forward tokens
 */
contract FlowStarter {
    function startFlow(ISuperToken superToken, uint256 amount, address receiver, int96 flowRate) external {
        // get from sender
        ISuperToken(superToken).transferFrom(msg.sender, address(this), amount);

        // start flow
        superToken.createFlow(receiver, flowRate);
    }

    function return1() external pure returns (uint256) {
        return 1;
    }
}
