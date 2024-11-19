# Hardhat with Superfluid

This project demonstrates
- how to use the Superfluid framework deployer
- how to enforce the EIP-170 contract size limit while allowing tests to deploy larger contracts

`test/Flowstarter.test.js` deploys the SF framework using the recommended method: @superfluid-finance/ethereum-contracts/dev-scripts/deploy-contracts-and-token.js
This requires the hardhat network to be configured with `allowUnlimitedContractSize`.

Recommendation: deploy-contracts-and-token.js should check if this is set and abort with precise instructions if not.
Example output with that in place:
```
...
  1 passing (749ms)
  1 failing

  1) FlowStarter
       "before all" hook for "should start flow":
     Error: 
The Superfluid deployer for test environments requires the EIP-170 contract size limit to be disabled on the test network.
You can do this by setting "allowUnlimitedContractSize = true" in the hardhat config file:

  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  }
        
      at deployContractsAndToken (node_modules/@superfluid-finance/ethereum-contracts/dev-scripts/deploy-contracts-and-token.js:10:15)
      at Context.<anonymous> (test/FlowStarter.test.js:22:59)



error Command failed with exit code 1.
```
Note that the output is also colored.

`hardhat.config.js` shows how to enforce the contract size limit on production contracts even when the hardhat network does so: by overriding the compile task.
This leads to an error when one of the project contracts is above the limit.
Example output:
```
$ yarn test
yarn run v1.22.19
$ hardhat test
Warning: Contract code size is 24781 bytes and exceeds 24576 bytes (a limit introduced in Spurious Dragon). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
 --> contracts/OversizedContract.sol:4:1:
  |
4 | contract OversizedContract {
  | ^ (Relevant source part starts here and spans across multiple lines).


Compiled 1 Solidity file successfully (evm target: paris).
An unexpected error occurred:

Error: Contract contracts/OversizedContract.sol:OversizedContract is too large (24781 bytes)! Must not exceed 24576 bytes (EIP-170).
    at OverriddenTaskDefinition._action (/home/didi/src/sf/hh-test-proj/hardhat.config.js:17:15)
    at Environment._runTaskDefinition (/home/didi/src/sf/hh-test-proj/node_modules/hardhat/src/internal/core/runtime-environment.ts:351:14)
    at Environment.run (/home/didi/src/sf/hh-test-proj/node_modules/hardhat/src/internal/core/runtime-environment.ts:184:14)
    at SimpleTaskDefinition.action (/home/didi/src/sf/hh-test-proj/node_modules/hardhat/src/builtin-tasks/test.ts:187:9)
    at Environment._runTaskDefinition (/home/didi/src/sf/hh-test-proj/node_modules/hardhat/src/internal/core/runtime-environment.ts:351:14)
    at Environment.run (/home/didi/src/sf/hh-test-proj/node_modules/hardhat/src/internal/core/runtime-environment.ts:184:14)
    at main (/home/didi/src/sf/hh-test-proj/node_modules/hardhat/src/internal/cli/cli.ts:322:7)
error Command failed with exit code 1.
```

In order to trigger this error, uncomment the constant in the `contracts/OversizedContract.sol`, then run `yarn build`.

Note that even with this compile task override a clear warning is shown.