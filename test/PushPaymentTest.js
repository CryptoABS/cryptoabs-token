var PushPayment = artifacts.require("../contracts/PushPayment.sol");

contract('PushPayment', function(accounts) {
  it("should send ETH to contract", function() {
    var payment;
    var ether = 10;

    return PushPayment.deployed().then(function(instance) {
      payment = instance;
      web3.eth.sendTransaction({ from: accounts[8], to: payment.address, value: web3.toWei(ether, "ether"), gas: 200000 });
    }).then(function() {

      assert.equal(web3.fromWei(web3.eth.getBalance(payment.address).toNumber()), ether, "10 wasn't in the contract");
    });
  });
  
  it("should add payee to contract", function() {
    var payment;
    var ether = 2;

    return PushPayment.deployed().then(function(instance) {
      payment = instance;

      return payment.addPayee(accounts[1], ether);
    }).then(function() {
      return payment.getPayeeCount.call();
    }).then(function(count) {
      // console.log(count.toNumber())
      assert.equal(count.toNumber(), 2, "payee count wasn't correctly");
    })
  })
})


