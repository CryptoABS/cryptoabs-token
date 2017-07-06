var CryptoABS = artifacts.require("../contracts/CryptoABS.sol");

/**
 * Test cases should include following:
 * 1.  owner initialize with parameters
 *     1.1.  before owner initialize should fail when send transaction
 *     1.2.  owner send wrong parameters should fail
 *     1.3.  owner send wrong parameters should success  
 * 2.  anyone can finalize
 *     2.1. owner should finalize at anytime, before or after end block
 *     2.2. anyone should finalize success when over end block
 *     2.3. anyone should finalize fail when over end block 
 * 3.  payee buy token
 *     3.1.  less then ether limit should fail
 *     3.2.  over then ether limit should success
 *     3.3.  should refund when more then expect ether
 * 3.  payee transfer token
 * 4.  owner deposit interest
 * 5.  payee check interest amount
 * 6.  payee withdraw interest
 * 7.  owner put interest
 * 8.  owner put capital
 * 9.  payee withdraw capital
 * 10. owner add asset
 *     10.1.  get asset data
 *     10.2.  get asset count
 */
contract("CryptoABS", function(accounts) {
  var tokenExchangeRate = 1000000000000000000; // 1 Token = 1 ETH = n USD

  /**
   * 1.1 before owner initialize should fail when send transaction
   */
  it("1.1. before owner initialize should fail when send transaction", function() {
    var cryptoABS;
    var ether = 3;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      web3.eth.sendTransaction({ from: accounts[4], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 200000 });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    });
  });

  /**
   * 1.2 owner send wrong parameters should fail
   */

  /**
   * 1.3 owner send wrong parameters should success
   */
  it("1.3. owner send wrong parameters should success", function() {
    var cryptoABS;
    var name = "CryptoABS";
    var symbol = "CABS";
    var decimals = 0;
    var startBlock = web3.eth.blockNumber + 2;    // each transaction will add 1 block number
    var endBlock = web3.eth.blockNumber + 10000;
    var initializedTime = 0;                      // 要設定非常小的數字才有辦法測試
    var financingPeriod = 1;                      // 融資期間
    var tokenLockoutPeriod = 1;                   // 閉鎖期間
    var tokenMaturityPeriod = 86400 * 2;          // 債券到期日
    var minEthInvest = 1000000000000000000;    // 購買 Token 最小單位
    var maxTokenSupply = 10000;
    var interestRate = 8;
    var interestPeriod = 86400 * 30;
    var ethExchangeRate = 1000000000000000000 / 280;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.initialize(
        name,
        symbol,
        decimals,
        cryptoABS.address,
        startBlock, 
        endBlock, 
        initializedTime, 
        financingPeriod, 
        tokenLockoutPeriod,
        tokenMaturityPeriod,
        minEthInvest,
        maxTokenSupply,
        interestRate,
        interestPeriod,
        tokenExchangeRate,
        ethExchangeRate);
    }).then(function() {
      return cryptoABS.initialized.call();
    }).then(function(initialized) {
      assert.equal(initialized, true, "initialized wasn't correctly");
    });
  });

  /**
   * 2.1. less then ether limit: buy token fail 
   */
  it("2.1. less then ether limit: buy token fail", function() {
    var cryptoABS;
    var ether = 0.1;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      web3.eth.sendTransaction({ from: accounts[3], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 2000000 });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    });
  });

  /**
   * 2.2. over then ether limit should success
   * 2.3. should refund when more then expect ether
   */
  it("2.2. over then ether limit should success \r\n      2.3. should refund when more then expect ether", function() {
    var cryptoABS;
    var ether = 2.1;
    var realEther = 2;
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
      web3.eth.sendTransaction({ from: accounts[2], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 2000000 });
      return cryptoABS.totalSupply.call();
    }).then(function(totalSupply) {
      assert.equal(totalSupply, web3.toWei(realEther, "ether") / tokenExchangeRate, "total supply wasn't correctley");
      return cryptoABS.balanceOf(accounts[2]);
    }).then(function(balance) {
      owner_end_amount = web3.eth.getBalance(accounts[0]).toNumber();
      payee_end_amount = web3.eth.getBalance(accounts[2]).toNumber();
      assert.equal(web3.fromWei(owner_start_amount), web3.fromWei(owner_end_amount) - realEther, "owner wasn't accept ether correctley");
      assert.equal(payee_end_amount < payee_start_amount, true, "payee wasn't send ether correctley");
      assert.equal(balance.valueOf(), web3.toWei(realEther, "ether") / tokenExchangeRate, "token amount wasn't correctly in the first account");
    });
  });

  /**
   * 4.1. new payee should add to payee list correctly
   * 4.2. payee should transfer success when contract non paused
   */
  it("4.1. new payee should add to payee list correctly \r\n      4.2. payee should transfer success when contract non paused", function() {
    var cryptoABS;
    var token = 1;
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

  /**
   * 5.1. should pause contract success
   */
  it("5.1. should pause contract success", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerPauseContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) {
      assert.equal(paused, true, "pause contract wasn't correctly");
    });
  });

  /**
   * 5.2. should resume contract fail
   */
  it("5.2. should resume contract fail", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerResumeContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) {
      assert.equal(paused, false, "resume contract wasn't correctly");
    });
  });

  /**
   * 6.1. owner set exchange rate should success
   */
  it("6.1. owner set exchange rate should success", function() {
    var cryptoABS;
    var exchangeRateCount;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.nextExchangeRateIndex.call();
    }).then(function(nextExchangeRateIndex) {
      exchangeRateCount = nextExchangeRateIndex;
      assert.equal(nextExchangeRateIndex, 1, "nextExchangeRateIndex wasn't correctly");
      return cryptoABS.ownerSetExchangeRateInWei(tokenExchangeRate);
    }).then(function() {
      return cryptoABS.exchangeRateArray(exchangeRateCount);
    }).then(function(result) {
      assert.equal(result[1].toNumber(), tokenExchangeRate, "exchange rate wasn't correctly");
    });
  });

  /**
   * 6.2. owner should put interest to contract fail when contract not paused
   */
  it("6.2. owner should put interest to contract fail when contract not paused", function() {
    var cryptoABS;
    var interest = 1;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, false, "contract not pause wasn't correctly");
      return cryptoABS.ownerPutInterest(1, {from: accounts[0], value: web3.toWei(interest, "ether")});
    }).catch(function(err) {
      assert.isDefined(err, "owner put interest should have thrown");
    });
  });

  /**
   * 6.3. owner should put interest to contract success when contract paused
   */
  it("6.3. owner should put interest to contract success when contract paused", function() {
    var cryptoABS;
    var interest = 0.3;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerPauseContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, true, "pause contract wasn't correctly");
      return cryptoABS.ownerPutInterest(1, {from: accounts[0], value: web3.toWei(interest, "ether")});
    }).then(function() {
      return cryptoABS.ownerDepositInterest({from: accounts[0], gas: 4500000});
    }).then(function() {
      return cryptoABS.interestOf.call(accounts[2]);
    }).then(function(interest) {
      assert.equal(interest.toNumber(), web3.toWei(0.15, "ether"), "add interest wasn't correctly");
      return cryptoABS.ownerResumeContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, false, "resume contract wasn't correctly");
    });
  });

  /**
   * 10.1. transfer ownership should fail when not owner
   */
  it("10.1. transfer ownership should fail when not owner", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.owner.call();
    }).then(function(owner) {
      assert.equal(owner, accounts[0], "owner wasnt' correctly");
      return cryptoABS.transferOwnership({from: accounts[1]});
    }).catch(function(err) {
      assert.isDefined(err, "transfer ownership should have thrown");
    });
  });

  /**
   * 10.2. transfer ownership should success when not owner
   */
  it("10.2. transfer ownership should success when not owner", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.owner.call();
    }).then(function(owner) {
      assert.equal(owner, accounts[0], "owner wasnt' correctly");
      return cryptoABS.transferOwnership(accounts[1]);
    }).then(function() {
      return cryptoABS.owner.call();
    }).then(function(owner) {
      assert.equal(owner, accounts[1], "transfer ownership wasnt' correctly");
    });
  });

  /**
   * 11.1. owner should disabled payee success
   */
  it("11.1. owner should disabled payee success", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerDisablePayee(accounts[2], {from: accounts[1]});
    }).then(function() {
      return cryptoABS.payees(accounts[2]);
    }).then(function(result) {
      assert.equal(result[1], false, "disable payee wasn't correctly");
    });
  });

  /**
   * 11.2. owner should enabled payee success
   */
  it("11.2. owner should enabled payee success", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerEnablePayee(accounts[2], {from: accounts[1]});
    }).then(function() {
      return cryptoABS.payees(accounts[2]);
    }).then(function(result) {
      assert.equal(result[1], true, "enable payee wasn't correctly");
    });
  });

  /**
   * 11.3. should fail when disabled payee is not owner
   */
  it("11.3. should fail when disabled payee is not owner", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerDisablePayee(accounts[2], {from: accounts[0]});
    }).catch(function(err) {
      assert.isDefined(err, "disable payee should have thrown");
    });
  });

  /**
   * 12.1. owner add asset
   */
  it("12.1. owner add asset", function() {
    var cryptoABS;
    var data = "test";
    var num = 0;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerAddAsset(data, {from: accounts[1]});
    }).then(function() {
      return cryptoABS.assetArray.call(num);
    }).then(function(result) {
      assert.equal(result, data, "get asset data wasn't correctly");
    });
  });

  /**
   * 12.2. get asset count
   */
  it("12.2. get asset count", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.getAssetCount.call();
    }).then(function(count){
      assert.equal(count.toNumber(), 1, "add asset wasn't correctly");
    });
  });

  /**
   * 13. get payee count
   */
  it("13. get payee count", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.getPayeeCount.call();
    }).then(function(count){
      assert.equal(count.toNumber() > 0, true, "payee count wasn't correctly");
    });
  });

  /**
   * 14. get interest count
   */
  it("14. get interest count", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.getInterestCount.call();
    }).then(function(count){
      assert.equal(count.toNumber() > 0, true, "interest count wasn't correctly");
    });
  });

});
