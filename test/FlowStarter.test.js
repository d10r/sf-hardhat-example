const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContractsAndToken } = require("@superfluid-finance/ethereum-contracts/dev-scripts/deploy-contracts-and-token");
const SuperTokenArtifact = require("@superfluid-finance/ethereum-contracts/build/hardhat/contracts/superfluid/SuperToken.sol/SuperToken.json");
const CFAv1Artifact = require("@superfluid-finance/ethereum-contracts/build/hardhat/contracts/agreements/ConstantFlowAgreementV1.sol/ConstantFlowAgreementV1.json");
const BigNumber = ethers.BigNumber;

describe("FlowStarter", function () {
    // contract being tested
    let flowStarter;
    // Superfluid
    let sfFramework;
    let superToken;
    let cfaV1;
    // accounts used
    let owner, receiver;

    // Deploy the Superfluid test environment (Framework + SuperTokens)
    before(async function () {
        [owner, receiver] = await ethers.getSigners();

        const { deployer, tokenDeploymentOutput } = await deployContractsAndToken();
        sfFramework = await deployer.getFramework();
        // we choose the pureSuperToken for this test (no upgrade/downgrade needed)
        superToken = await ethers.getContractAt(
            SuperTokenArtifact.abi,
            tokenDeploymentOutput.pureSuperTokenData.pureSuperTokenAddress
        );
        cfaV1 = await ethers.getContractAt(CFAv1Artifact.abi, sfFramework.cfa);
    });

    beforeEach(async function () {
        // Deploy the FlowStarter contract
        const FlowStarter = await ethers.getContractFactory("FlowStarter");
        flowStarter = await FlowStarter.deploy();
        await flowStarter.deployed();        
    });

    it("should start flow", async function () {
        // give approval for 1000 SuperTokens to the flowStarter contract
        const amount = ethers.utils.parseUnits("1000", 18); // Example amount
        await superToken.connect(owner).approve(flowStarter.address, amount);

        // start flow with a flowrate of 1 token per day
        const flowRatePerSecond = ethers.utils.parseUnits("1", 18).div(BigNumber.from(24 * 60 * 60));
        await flowStarter.startFlow(superToken.address, amount, receiver.address, flowRatePerSecond);

        const receiverFlowRate = await cfaV1.getNetFlow(superToken.address, receiver.address);
        expect(receiverFlowRate.toString()).to.equal(flowRatePerSecond.toString());
    });
});
