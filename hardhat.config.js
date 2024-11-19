require("@nomiclabs/hardhat-ethers");

// This task override enforces the contract size limit defined by EIP-170
task("compile")
  .setAction(async function (args, hre, runSuper) {
    await runSuper(args);
    
    const contractNames = await hre.artifacts.getAllFullyQualifiedNames();
    for (const name of contractNames) {
      const { deployedBytecode } = await hre.artifacts.readArtifact(name);
      // Skip if no deployed bytecode (e.g. interfaces)
      if (!deployedBytecode || deployedBytecode === "0x") continue;

      // Remove "0x" prefix and calculate bytes
      const size = (deployedBytecode.length - 2) / 2;
      if (size > 24576) {
        throw new Error(
          `Contract ${name} is too large (${size} bytes)! ` +
          `Must not exceed 24576 bytes (EIP-170).`
        );
      }
    }
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
