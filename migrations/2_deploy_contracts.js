var Bonds = artifacts.require("./Bonds.sol");
var PullPayment = artifacts.require("./PullPayment.sol");
var PushPayment = artifacts.require("./PushPayment.sol");

module.exports = function(deployer) {
  deployer.deploy(Bonds)
  deployer.deploy(PullPayment)
  deployer.deploy(PushPayment)
};
