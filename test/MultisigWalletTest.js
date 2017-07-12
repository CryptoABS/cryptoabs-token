var MultisigWallet = artifacts.require("../contracts/MultisigWallet.sol");

contract("MultisigWallet", function(accounts) {
  it("", function() {
    var multisigWallet;
    var ether = 3;

    return MultisigWallet.deployed().then(function(instance) {
      multisigWallet = instance;
      web3.eth.sendTransaction({ from: accounts[4], to: multisigWallet.address, value: web3.toWei(ether, "ether"), gas: 200000 });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    });
  });
});
