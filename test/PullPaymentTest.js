var PullPayment = artifacts.require("../contracts/PullPayment.sol");

contract('PullPayment', function(accounts) {
  // test deploy contract
  it("should send ETH to contract", function() {
    var payment;
    var ether = 10;

    return PullPayment.deployed().then(function(instance) {
      payment = instance;
      web3.eth.sendTransaction({ from: accounts[8], to: payment.address, value: web3.toWei(ether, "ether"), gas: 200000 });
    }).then(function() {

      assert.equal(web3.fromWei(web3.eth.getBalance(payment.address).toNumber()), ether, "10 wasn't in the contract");
    });
  });

  it("should add payee to contract", function() {
    var payment;
    var ether = 2;

    return PullPayment.deployed().then(function(instance) {
      payment = instance;

      return payment.addPayee(accounts[1], ether);
    }).then(function() {
      return payment.getPayeeCount.call();
    }).then(function(count) {
      // console.log(count.toNumber())
      assert.equal(count.toNumber(), 2, "payee count wasn't correctly");
    })
  })

  it("should get interest of payee", function() {
    var payment;

    return PullPayment.deployed().then(function(instance) {
      payment = instance;

      return payment.getInterest.call(accounts[1]);
    }).then(function(interest) {
      assert.equal(interest.toNumber(), 2, "2 of interest wasn't correctly")

      return payment.addPayee(accounts[1], 1);
    }).then(function() {
      return payment.getInterest.call(accounts[1]);
    }).then(function(interest) {
      assert.equal(interest.toNumber(), 3, "3 of interest wasn't correctly")
    })
  })

  it("should show payee status", function() {
    var payment;

    return PullPayment.deployed().then(function(instance) {
      payment = instance;

      return payment.payeeStatus.call({ from: accounts[1] });
    }).then(function(result) {
      assert.equal(result, true, "payee status wasn't correctly")
    })
  })

  it("should withdraw interest from contract", function() {
    var payment;
    var payee_start_amount;
    var payee_end_amount;
    var payee_start_balance;
    var payee_end_balance;
    var contract_start_balance;
    var contract_end_balance;

    var ether = 1

    return PullPayment.deployed().then(function(instance) {
      payment = instance;
      payee_start_balance = web3.fromWei(web3.eth.getBalance(accounts[1])).toNumber();
      contract_start_balance = web3.fromWei(web3.eth.getBalance(payment.address)).toNumber();
      
      return payment.getInterest.call(accounts[1]);
    }).then(function(interest) {
      payee_start_amount = interest.toNumber()
      return payment.withdrawInterest.apply(this, [ether, { from: accounts[1] }]);
    }).then(function() {
      payee_end_balance = web3.fromWei(web3.eth.getBalance(accounts[1])).toNumber();
      contract_end_balance = web3.fromWei(web3.eth.getBalance(payment.address)).toNumber();

      return payment.getInterest.call(accounts[1]);
    }).then(function(interest) {
      payee_end_amount = interest.toNumber();
      // console.log('payee_start_balance: ', payee_start_balance);
      // console.log('payee_end_balance: ', payee_end_balance);
      // console.log('contract balance: ', web3.fromWei(web3.eth.getBalance(payment.address)).toNumber())
      assert.equal(payee_end_amount, payee_start_amount - ether, "interest wasn't correctly")
      assert.equal(contract_start_balance - ether, contract_end_balance, "withdraw interest wasn't correctly")
    })
  })

})