var CryptoABS = artifacts.require("../contracts/CryptoABS.sol");

contract("CryptoABS", function(accounts) {

  it("should fail when contract not initialize", function() {
    var cryptoABS;
    var ether = 3;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      web3.eth.sendTransaction({ from: accounts[4], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 200000 });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    });
  });

  it("should initalize contract", function() {
    var cryptoABS;
    var name = "CryptoABS";
    var symbol = "CABS";
    var decimals = 0;
    var contractAddress = "";
    var startBlock = web3.eth.blockNumber + 2;  // each transaction will add 1 block number
    var endBlock = 10000;
    var initializedTime = 0;                    // 要設定非常小的數字才有辦法測試
    var financingPeriod = 1;                    // 融資期間
    var tokenLockoutPeriod = 1;                 // 閉鎖期間
    var tokenMaturityPeriod = 86400 * 2;        // 債券到期日
    var minEthInvest = 1;                       // 購買 Token 最小單位
    var maxTokenSupply = 10000;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.initialize(
        name,
        symbol,
        decimals,
        contractAddress,
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

  it("should fail when less minimum ether invest", function() {
    var cryptoABS;
    var ether = 0.1;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      web3.eth.sendTransaction({ from: accounts[3], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 200000 });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
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
      assert.equal(web3.fromWei(payee_end_amount) < web3.fromWei(payee_start_amount), true, "payee wasn't send ether correctley");
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
  
  it("should transfer CABS token", function() {
    var cryptoABS;
    var token = 50;
    var receiver_start_token;
    var receiver_end_token;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      receiver_start_token = balance.valueOf();
      return cryptoABS.transfer(accounts[3], token, {from: accounts[2]});
    }).then(function() {
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      receiver_end_token = balance.valueOf();
      assert.equal(receiver_end_token - token, receiver_start_token, "token transfer wasn't correctly");
      return cryptoABS.getPayeeCount.call();
    }).then(function(count){
      assert.equal(count, 2, "after transfer payee count wasn't correctly");
    });
  });

  it("should add interest to payee", function() {
    var cryptoABS;
    var ether = 3;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.depositInterest(accounts[2], ether);
    }).then(function() {
      return cryptoABS.interestOf.call(accounts[2]);
    }).then(function(interest) {
      assert.equal(interest.toNumber(), ether, "add interest wasn't correctly");
    });
  });

});
