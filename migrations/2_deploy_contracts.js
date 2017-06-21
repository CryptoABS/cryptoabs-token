var Bonds = artifacts.require("./Bonds.sol");
var Payment = artifacts.require("./Payment.sol");

module.exports = function(deployer) {
  deployer.deploy(Bonds)
  deployer.deploy(Payment)
};
