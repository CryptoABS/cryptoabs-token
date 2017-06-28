var HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = process.env.TEST_MNEMONIC || "bonds bonds bonds bonds bonds bonds bonds bonds bonds bonds bonds bonds";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  kovan: {
    network_id: 42,
    provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io"),
    gas: 4.5e6 // Note: lower gas limit when failing on contract deployment. 
  },
};
