var sleep = require("sleep");
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
  var unixTime = Math.round(new Date() / 1000);
  var financingPeriod = 5;                      // 融資期間
  var tokenLockoutPeriod = 5;                   // 閉鎖期間
  var tokenMaturityPeriod = 15;                 // 債券到期日

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
  it("1.2. owner send wrong parameters should fail", function() {
    var cryptoABS;
    var name = "CryptoABS";
    var symbol = "CABS";
    var decimals = 0;
    var startBlock = web3.eth.blockNumber;     // each transaction will add 1 block number
    var endBlock = web3.eth.blockNumber + 10000;
    var initializedTime = 0;                      
    var minEthInvest = 1000000000000000000;    // 購買 Token 最小單位
    var maxTokenSupply = 10000;
    //var interestRate = 8;
    //var interestPeriod = 86400 * 30;
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
        //interestRate,
        //interestPeriod,
        tokenExchangeRate,
        ethExchangeRate);
    }).catch(function(err) {
      assert.isDefined(err, "initialize fail");
      return cryptoABS.initialized.call();
    }).then(function(initialized) {
      assert.equal(initialized, false, "initialized fail wasn't correctly");
    });
  });

  /**
   * 1.3 owner send correct parameters should success
   */
  it("1.3. owner send correct parameters should success", function() {
    var cryptoABS;
    var name = "CryptoABS";
    var symbol = "CABS";
    var decimals = 0;
    var startBlock = web3.eth.blockNumber + 2;    // each transaction will add 1 block number
    var endBlock = web3.eth.blockNumber + 10;
    var initializedTime = unixTime;               
    var minEthInvest = 1000000000000000000;       // 購買 Token 最小單位
    var maxTokenSupply = 10000;
    //var interestRate = 8;
    //var interestPeriod = 15;
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
        //interestRate,
        //interestPeriod,
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

      web3.eth.sendTransaction({ from: accounts[4], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 2000000 });
    });
  });

  /**
   * 3.1. anyone should finalize fail when not over end block
   */
  it("3.1. anyone should finalize fail when not over end block", function() {
    var cryptoABS;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.finalize({from: accounts[5]});
    }).then(function() {
      assert.equal(false, true, "finalize call wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "finalize fail");
      return cryptoABS.finalizedTime.call();
    }).then(function(finalizedTime) {
      assert.equal(finalizedTime, 0, "finalizedTime wasn't correctly");
      return cryptoABS.finalizedBlock.call();
    }).then(function(finalizedBlock) {
      assert.equal(finalizedBlock, 0, "finalizedTime wasn't correctly");
    });
  });

  /**
   * 3.2. owner should finalize at anytime, before or after end block
   */
  it("3.2. owner should finalize at anytime, before or after end block", function() {
    var cryptoABS;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.finalize({from: accounts[0]});
    }).then(function() {
      return cryptoABS.finalizedTime.call();
    }).then(function(finalizedTime) {
      assert.equal(finalizedTime > 0, true, "finalizedTime wasn't correctly");
      return cryptoABS.finalizedBlock.call();
    }).then(function(finalizedBlock) {
      assert.equal(finalizedBlock.toNumber(), web3.eth.blockNumber, "finalizedBlock wasn't correctly");
    });
  });

  /**
   * 3.4. anyone should fail send transaction after finalize
   */
  it("3.4. anyone should fail send transaction after finalize", function() {
    var cryptoABS;
    var ether = 3;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      web3.eth.sendTransaction({ from: accounts[6], to: cryptoABS.address, value: web3.toWei(ether, "ether"), gas: 2000000 });
    }).then(function() {
      assert.equal(false, true, "transaction wasn't fail correctly");
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
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
      // during LockOut period should fail transfer
      return cryptoABS.transfer(accounts[3], token, {from: accounts[2]});
    }).catch(function(err) {
      assert.equal(Math.round(new Date() / 1000) < (unixTime + financingPeriod + tokenLockoutPeriod), true, "during lock out period wasn't correctly");
      assert.isDefined(err, "during lock out period should throw");
      // Wait for 10 seconds, until LockOut period open
      sleep.sleep(10);
      return cryptoABS.transfer(accounts[3], token, {from: accounts[2]});
    }).then(function() {
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      receiver_end_token = balance.valueOf();
      assert.equal(receiver_end_token - token, receiver_start_token, "token transfer wasn't correctly");
      return cryptoABS.getPayeeCount.call();
    }).then(function(count){
      assert.equal(count, 3, "after transfer payee count wasn't correctly");
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
   * 4.3. payee should transfer fail when contract paused
   */
  it("4.3. payee should transfer fail when contract paused", function() {
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
      assert.equal(false, true, "payee transfer fail when contract paused wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "transfer fail when contract paused");
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      receiver_end_token = balance.valueOf();
      assert.equal(receiver_end_token, receiver_start_token, "token transfer wasn't correctly");
    });
  });

  /**
   * 4.4. over token limit should fail
   */
  it("4.4. over token limit should fail", function() {
    var cryptoABS;
    var token = 10;
    var receiver_start_token;
    var receiver_end_token;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      receiver_start_token = balance.valueOf();
      return cryptoABS.transfer(accounts[3], token, {from: accounts[2]});
    }).then(function() {
      assert.equal(false, true, "payee transfer fail wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "transfer fail when contract paused");
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      receiver_end_token = balance.valueOf();
      assert.equal(receiver_end_token, receiver_start_token, "token transfer wasn't correctly");
    });
  });

  /**
   * 4.5. allow another payee to withdraw from origin payee account
   */
  it("4.5. allow another payee to withdraw from origin payee account \r\n      " + 
    "4.6. returns the amount which another payee is still allowed to withdraw from origin payee", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.approve(accounts[7], 1, {from: accounts[4]});
    }).then(function() {
      return cryptoABS.allowance(accounts[4], accounts[7]);
    }).then(function(remaing) {
      assert.equal(remaing, 1, "remaing token amount wasn't correctly");
    });
  });

  /**
   * 5.2. should resume contract success
   */
  it("5.2. should resume contract success", function() {
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
   * 4.7. payee transfer tokens from one address to another
   */
  it("4.7. payee transfer tokens from one address to another", function() {
    var cryptoABS;
    var sender_start_token;
    var sender_end_token;
    var receiver_start_token;
    var receiver_end_token;
    var token = 1;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.balanceOf(accounts[4]);
    }).then(function(balance) {
      sender_start_token = balance.toNumber();
      return cryptoABS.balanceOf(accounts[7]);
    }).then(function(balance) {
      receiver_start_token = balance.toNumber();
      return cryptoABS.transferFrom(accounts[4], accounts[7], token, {from: accounts[7]});
    }).then(function() {
      return cryptoABS.balanceOf(accounts[4]);
    }).then(function(balance) {
      sender_end_token = balance.toNumber();
      return cryptoABS.balanceOf(accounts[7]);
    }).then(function(balance) {
      receiver_end_token = balance.toNumber();
      assert.equal(sender_start_token - token, sender_end_token, "sender token balance wasn't correctly");
      assert.equal(receiver_end_token - token, receiver_start_token, "receiver token balance wasn't correctly");
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
    }).then(function() {
      assert.equal(false, true, "owner put interest when contract not pause wasn't correctly");
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
      assert.equal(interest.toNumber() > 0, /*web3.toWei(0.075, "ether")*/ true, "add interest wasn't correctly");
      return cryptoABS.ownerResumeContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, false, "resume contract wasn't correctly");
    });
  });

  /**
   * 7.1. payee should withdraw interest fail when contract paused
   */
  it("7.1. payee should withdraw interest fail when contract paused", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerPauseContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, true, "pause contract wasn't correctly");
    }).then(function() {
      return cryptoABS.interestOf.call(accounts[2]);
    }).then(function(interest) {
      assert.equal(interest.toNumber(), web3.toWei(0.15, "ether"), "get interest wasn't correctly");
      return cryptoABS.payeeWithdrawInterest(web3.toWei(0.1, "ether"), {from: accounts[2]});
    }).then(function() {
      assert.equal(false, true, "payee withdraw interest fail wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "payee withdraw interest fail should throw");
      return cryptoABS.ownerResumeContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, false, "resume contract wasn't correctly");
    });
  });

  /**
   * 7.2. payee should withdraw interest success when contract not paused
   */
  it("7.2. payee should withdraw interest success when contract not paused", function() {
    var cryptoABS;
    var totalInterest;
    var payee_start_amount;
    var payee_end_amount;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      payee_start_amount = web3.eth.getBalance(accounts[4]).toNumber();
      return cryptoABS.interestOf.call(accounts[4]);
    }).then(function(interest) {
      totalInterest = interest.toNumber();
      assert.equal(totalInterest > 0, true, "payee interest wasn't correctly");
      return cryptoABS.payeeWithdrawInterest({from: accounts[4]});
    }).then(function() {
      return cryptoABS.interestOf.call(accounts[4]);
    }).then(function(interest) {
      payee_end_amount = web3.eth.getBalance(accounts[4]).toNumber();
      assert.equal(interest.toNumber(), 0, "payee withdraw interest wasn't correctly");
      assert.equal((payee_end_amount - payee_start_amount) > 0, true, "payee amount wasn't correctly");
    });
  });

  /**
   * 7.3. payee should withdraw interest fail when over interest amount
   */
  it("7.3. payee should withdraw interest fail when over interest amount", function() {
    var cryptoABS;
    var withdrawAmount = web3.toWei(0.1, "ether");

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.payeeWithdrawInterest(withdrawAmount, {from: accounts[2]});
    }).then(function() {
      assert.equal(false, true, "payee withdraw interest wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "payee withdraw interest over interest remaing should throw");
    });
  });

  /**
   * 7.4. payee should fail withdraw interest when disabled payee
   */
  it("7.4. payee should fail withdraw interest when disabled payee", function() {
    var cryptoABS;
    var withdrawAmount;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.interestOf.call(accounts[2]);
    }).then(function(interest) {
      withdrawAmount = interest.toNumber();
      return cryptoABS.ownerDisablePayee(accounts[2]);
    }).then(function() {
      return cryptoABS.payees(accounts[2]);
    }).then(function(result) {
      assert.equal(result[1], false, "disable payee wasn't correctly");
      return cryptoABS.payeeWithdrawInterest(withdrawAmount, {from: accounts[2]});
    }).then(function() {
      assert.equal(false, true, "payee withdraw interest when disabled wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "payee withdraw interest when disabled should throw");
    });
  });

  /**
   * 8.1. owner should put capital to contract fail when contract not paused
   */
  it("8.1. owner should put capital to contract fail when contract not paused", function() {
    var cryptoABS;
    var capital = 10;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, false, "contract not pause wasn't correctly");
      return cryptoABS.ownerPutCapital({from: accounts[0], value: web3.toWei(capital, "ether")});
    }).then(function() {
      assert.equal(false, true, "owner put capital when contract not pause wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "owner put capital should have thrown");
    });
  });

  /**
   * 8.2. owner should put capital to contract success when contract paused
   */
  it("8.2. owner should put capital to contract success when contract paused", function() {
    var cryptoABS;
    var capital = 10;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerPauseContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, true, "pause contract wasn't correctly");
      return cryptoABS.ownerPutCapital({from: accounts[0], value: web3.toWei(capital, "ether")});
    }).then(function() {
      return cryptoABS.finalizedCapital.call();
    }).then(function(finalizedCapital) {
      assert.equal(finalizedCapital.toNumber(), web3.toWei(capital, "ether"), "put capital wasn't correctly");
      return cryptoABS.ownerResumeContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) { 
      assert.equal(paused, false, "resume contract wasn't correctly");
    });
  });

  /**
   * 9.1. payee should withdraw capital fail when not over maturity
   */
  it("9.1. payee should withdraw capital fail when not over maturity", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.ownerPauseContract();
    }).then(function() {
      return cryptoABS.paused.call();
    }).then(function(paused) {
      assert.equal(paused, true, "pause contract wasn't correctly");
      return cryptoABS.payeeWithdrawCapital({from: accounts[2]});
    }).then(function() {
      assert.equal(false, true, "payee withdraw capital fail when not over maturity wasn't correctly");
    }).catch(function(err) {
      assert.equal(Math.round(new Date() / 1000) < (unixTime + financingPeriod + tokenMaturityPeriod), true, "during maturity period wasn't correctly");
      assert.isDefined(err, "payee withdraw capital should have thrown");
    });
  });

  /**
   * 9.2. payee should withdraw capital fail when disabled payee
   */
  it("9.2. payee should withdraw capital fail when disabled payee", function() {
    var cryptoABS;

    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      cryptoABS = instance;
      return cryptoABS.payees(accounts[2]);
    }).then(function(payee) {
      assert.equal(payee[1], false, "disabled payee wasn't correctly");
      sleep.sleep(10);
      assert.equal(Math.round(new Date() / 1000) > (unixTime + financingPeriod + tokenMaturityPeriod), true, "over maturity period wasn't correctly");
      return cryptoABS.payeeWithdrawCapital({from: accounts[2]});
    }).then(function() {
      assert.equal(false, true, "payee withdraw capital fail when disabled payee wasn't correctly");
    }).catch(function(err) {
      assert.isDefined(err, "payee withdraw capital should have thrown");
    });
  });

  /**
   * 9.3. payee should withdraw capital success when contract paused and over maturity
   */
  it("9.3. payee should withdraw capital success when contract paused and over maturity", function() {
    var cryptoABS;
    var payee_start_balance;
    var payee_end_balance;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      payee_start_balance = balance.toNumber();
      assert.equal(payee_start_balance > 0, true, "payee start balance wasn't correctly");
      return cryptoABS.payeeWithdrawCapital({from: accounts[3]});
    }).then(function() {
      return cryptoABS.balanceOf(accounts[3]);
    }).then(function(balance) {
      payee_end_balance = balance.toNumber();
      assert.equal(payee_end_balance, 0, "payee withdraw capital success when over maturity wasn't correctly");
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

  /**
   * 15. owner withdraw contract balance
   */
  it("15. owner withdraw contract balance", function() {
    var cryptoABS;
    var owner_start_amount;
    var owner_end_amount;
    var contract_start_amount;
    var contract_end_amount;
    return CryptoABS.deployed().then(function(instance) {
      cryptoABS = instance;
      owner_start_amount = web3.eth.getBalance(accounts[1]).toNumber();
      contract_start_amount = web3.eth.getBalance(cryptoABS.address).toNumber();
      assert.equal(contract_start_amount > 0, true, "contract start balance wasn't correctly");
      return cryptoABS.ownerWithdraw({from: accounts[1]});
    }).then(function() {
      owner_end_amount = web3.eth.getBalance(accounts[1]).toNumber();
      contract_end_amount = web3.eth.getBalance(cryptoABS.address).toNumber();
      assert.equal(contract_end_amount, 0, "contract end balance wasn't correctly");
      assert.equal(owner_end_amount > owner_start_amount, true, "owner balance wasn't correctly");
    });
  });

});
