/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

console.log(process.env.INFURA_KEY)
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: process.env.INFURA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY_TESTNET]
    }
  }
};