// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  console.log("call `compile` to make sure everything is compiled...")
  await hre.run('compile');
  console.log("everything is compiled ✅")

  // We get the contract to deploy
  const [owner] = await ethers.getSigners()
  console.log("current owner address", owner.address)

  const ShopNFTGenerator = await hre.ethers.getContractFactory("ShopNFTGenerator");
  const Shop = await hre.ethers.getContractFactory("Shop");
  var req;

  console.log("ongoing deployment: ShopNFTGenerator");
  let shopNFTGeneratorContract = await ShopNFTGenerator.deploy();
  await shopNFTGeneratorContract.deployTransaction.wait();
  console.log("ShopNFTGenerator contract address", await shopNFTGeneratorContract.address);

  console.log("ongoing deployment: Shop");
  let bank = "0xAb5CB38f5dA4e14e3B15cB3db4A7752D5e32908c"
  let shopContract = await Shop.deploy(bank);
  await shopContract.deployTransaction.wait();
  console.log("Shop contract address", await shopContract.address);

  console.log("ongoing calling function: ShopNFTGenerator.createContract");
  let name = "My collectibles";
  let symbol = "MC";
  let baseTokenURI = "https://robohash.org/";
  let maxSupply = "100";
  req = await shopNFTGeneratorContract.createContract(name, symbol, baseTokenURI, maxSupply);
  await req.wait();
  console.log("ShopNFTGenerator.createContract tx:", await req.hash);

  console.log("First collectible contract address (at index 0):")
  req = await shopNFTGeneratorContract.contracts(0);
  console.log(req)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });