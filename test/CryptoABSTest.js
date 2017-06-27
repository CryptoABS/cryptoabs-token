var CryptoABS = artifacts.require("../contracts/cryptoabs/CryptoABS.sol");

contract('CryptoABS', function(accounts) {
  it("should initalize contract", function() {
    var cryptoABS;
    var startBlock = 100;
    var endBlock = 10000;
    var initializedTime = 86400;
    var financingPeriod = 86400;
    var tokenLockoutPeriod = 86400;
    var tokenMaturityPeriod = 86400 * 2;
    var minEthInvest = 1;
    var maxTokenSupply = 10000;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.initialize(
        startBlock, 
        endBlock, 
        initializedTime, 
        financingPeriod, 
        tokenLockoutPeriod,
        tokenMaturityPeriod,
        minEthInvest,
        maxTokenSupply);
    }).then(function() {
      return cryptoABS.initialized.call();
    }).then(function(initialized) {
      console.log('##initialized: ', initialized);
      assert.equal(initialized, true, "200 wasn't in the first account");
    });
  });

  it("should buy CABS by send transaction", function() {
    var cryptoABS;
    var ether = 2;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.initialized.call();
    }).then(function(initialized) {
      console.log('##initialized: ', initialized);
      web3.eth.sendTransaction({ from: accounts[2], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 200000 });
      return cryptoABS.balanceOf.call();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 200, "200 wasn't in the first account");
    });
  });

});
