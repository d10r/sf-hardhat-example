const { ethers } = require("hardhat");

describe("OversizedContract", function () {
    it("deploy oversized contract", async function() {
        const OversizedContract = await ethers.getContractFactory("OversizedContract");
        const oversizedContract = await OversizedContract.deploy();
        await oversizedContract.deployed();
    });
});
