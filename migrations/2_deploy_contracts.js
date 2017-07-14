var CryptoABS = artifacts.require("./CryptoABS.sol");
var MultisigWallet = artifacts.require("./Multisig.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(CryptoABS);
  deployer.deploy(MultisigWallet, accounts.slice(0, 4), 2);
};
