require("@nomiclabs/hardhat-ethers");

// Function to check if a contract is a test contract
function isTestContract(contractPath) {
  return contractPath.includes('/test/') || 
         contractPath.includes('/mocks/') ||
         contractPath.toLowerCase().includes('test') ||
         contractPath.toLowerCase().includes('mock');
}

// Task to check contract sizes
task("check-contract-sizes", "Checks that production contracts don't exceed size limit")
  .setAction(async function (_, { artifacts }) {
    const contractNames = await artifacts.getAllFullyQualifiedNames();
    let hasOversizedContract = false;

    for (const contractName of contractNames) {
      const artifact = await artifacts.readArtifact(contractName);
      const contractSize = artifact.deployedBytecode.length / 2;
      
      // Skip size check for test contracts
      if (isTestContract(contractName)) {
        continue;
      }

      if (contractSize > 24576) {
        console.error(
          `Error: Contract ${contractName} is too large (${contractSize} bytes)! ` +
          `Production contracts must not exceed 24576 bytes.`
        );
        hasOversizedContract = true;
      }
    }

    if (hasOversizedContract) {
      throw new Error("One or more production contracts exceed size limit!");
    }
});

// Override the built-in compile task
task("compile")
  .setAction(async function (args, hre, runSuper) {
    await runSuper(args);
    await hre.run("check-contract-sizes");
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
};
