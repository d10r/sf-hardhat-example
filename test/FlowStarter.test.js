const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { deployContractsAndToken } = require("@superfluid-finance/ethereum-contracts/dev-scripts/deploy-contracts-and-token");
const SuperTokenArtifact = require("@superfluid-finance/ethereum-contracts/build/hardhat/contracts/superfluid/SuperToken.sol/SuperToken.json");

describe("FlowStarter", function () {
    let flowStarter;
    let superToken;
    let owner;
    let receiver;


    before(async function () {
        [owner, receiver] = await ethers.getSigners();

        //network.config.allowUnlimitedContractSize = true;

        console.log("owner", owner.address);
        console.log("receiver", receiver.address);

        console.log("Deploy Superfluid Test Framework...");
        const result = await deployContractsAndToken();
        //console.log(result);

        const deployer = result.deployer;
        const frameworkAddresses = await deployer.getFramework();
        //console.log("frameworkAddresses", frameworkAddresses);

        const superTokenAddr = result.tokenDeploymentOutput.pureSuperTokenData.pureSuperTokenAddress;
        console.log("superTokenAddr", superTokenAddr);
        superToken = await ethers.getContractAt(SuperTokenArtifact.abi, superTokenAddr);
    });

    beforeEach(async function () {
        // Deploy the FlowStarter contract
        const FlowStarter = await ethers.getContractFactory("FlowStarter");
        flowStarter = await FlowStarter.deploy();
        await flowStarter.deployed();

        // check own supertoken balance (supertoken is erc20 compatible)
        // first instantiate superToken
        const balance = await superToken.balanceOf(owner.address);
        // print human readable format
        console.log("balance", ethers.utils.formatUnits(balance, 18));

        // Set up the superToken and receiver address
        // Note: You will need to deploy or reference an actual superToken contract
//        superToken = "0x..."; // Replace with actual superToken address
//        receiver = "0x..."; // Replace with actual receiver address
//        [owner] = await ethers.getSigners();
        
    });

    it("should start flow correctly", async function () {
        // give approval for 1000 SuperTokens to the flowStarter contract
        const amount = ethers.utils.parseUnits("1000", 18); // Example amount
        await superToken.connect(owner).approve(flowStarter.address, amount);

        // start flow
        // flowrate: 1 token per day (remember it's 18 decimals) - need integer value
        const flowRatePerSecond = Math.floor(ethers.utils.parseUnits("1", 18) / (24 * 60 * 60));
        console.log("flowRatePerSecond", flowRatePerSecond);

        // Add your test logic here
        // e.g., call startFlow and check the state changes

        await flowStarter.startFlow(superToken.address, amount, receiver.address, flowRatePerSecond);

        // how do I get the flowrate for assertion?
    });

    // Add more tests as needed
});
