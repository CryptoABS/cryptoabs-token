var CryptoABS = artifacts.require("../contracts/CryptoABS.sol");

contract("CryptoABS", function(accounts) {
  it("should initalize contract", function() {
    var cryptoABS;
    var startBlock = web3.eth.blockNumber + 2;  // each transaction will add 1 block number
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
      assert.equal(initialized, true, "200 wasn't in the first account");
    });
  });

  it("should buy CABS by send transaction", function() {
    var cryptoABS;
    var ether = 2;
    var payee_start_amount;
    var payee_end_amount;
    var owner_start_amount;
    var owner_end_amount;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      owner_start_amount = web3.eth.getBalance(accounts[0]).toNumber();
      payee_start_amount = web3.eth.getBalance(accounts[2]).toNumber();
      return cryptoABS.initialized.call();
    }).then(function(initialized) {
      assert.equal(initialized, true, "contract wasn't initalize");
      web3.eth.sendTransaction({ from: accounts[2], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 200000 });
      return cryptoABS.balanceOf(accounts[2]);
    }).then(function(balance) {
      owner_end_amount = web3.eth.getBalance(accounts[0]).toNumber();
      payee_end_amount = web3.eth.getBalance(accounts[2]).toNumber();

      assert.equal(web3.fromWei(owner_start_amount), web3.fromWei(owner_end_amount) - ether, "owner wasn't accept ether correctley");
      assert.equal(web3.fromWei(payee_end_amount) < web3.fromWei(payee_start_amount), true, "owner wasn't send ether correctley");
      assert.equal(balance.valueOf(), 200, "200 wasn't in the first account");
    });
  });

  it("should get payee count", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.getPayeeCount.call();
    }).then(function(count){
      assert.equal(count, 1, "payee count wasn't correctly");
    });
  });

  it("should return payee payable", function() {
    var cryptoABS;
    var correctPayee;
    var incorrectPayee;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.isPayeePayable({from: accounts[2]});
    }).then(function(bool) {
      correctPayee = bool;
      return cryptoABS.isPayeePayable({from: accounts[3]});
    }).then(function(bool) {
      incorrectPayee = bool;
      assert.equal(correctPayee, true, "payee payable wasn't correctly");
      assert.equal(incorrectPayee, false, "payee payable wasn't correctly");
    });
  });
  
});
