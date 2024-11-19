// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

using SuperTokenV1Library for ISuperToken;

/**
 * @title FlowForwarder - poor man's vesting
 */
contract FlowStarter {
    function startFlow(ISuperToken superToken, uint256 amount, address receiver, int96 flowRate) external {
        ISuperToken(superToken).transferFrom(msg.sender, address(this), amount);
        superToken.createFlow(receiver, flowRate);
    }
}
