var CryptoABS = artifacts.require("./CryptoABS.sol");

module.exports = function(deployer) {
  deployer.deploy(CryptoABS);
};
