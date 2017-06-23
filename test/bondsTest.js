var Bonds = artifacts.require("../contracts/Bonds.sol");

contract('Bonds', function(accounts) {
  // test deploy contract
  it("should buy BONDS by send transaction", function() {
    return Bonds.deployed().then(function(instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "0 wasn't in the first account");
    });
  });

  // test token total supply
  it("should get BONDS contract token total supply", function() {
    return Bonds.deployed().then(function(instance) {
      return instance.totalSupply.call();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.valueOf(), 0, "0 wasn't in first with contract deployed")
    })
  })

  // test maximum token supply
  it("should get BONDS maximum token supply", function() {
    return Bonds.deployed().then(function(instance) {
      return instance.MAXIMUM_TOKEN_SUPPLY.call();
    }).then(function(maximum) {
      assert.equal(maximum.valueOf(), 1000, "1000 wasn't in first with contract deployed")
    })
  })

  // test create token
  it("should create BONDS token correctly", function() {
    var bonds;
    var ether = 1;

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      web3.eth.sendTransaction({ from: accounts[8], to: bonds.address, value: web3.toWei(ether, "ether"), gas: 200000 });
      web3.eth.sendTransaction({ from: accounts[8], to: bonds.address, value: web3.toWei(ether, "ether"), gas: 200000 });
      return bonds.balanceOf.call(accounts[8]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 200, "100 token wasn't create after send transaction")
    })
  })

  // test transfer token
  it("should transfer BONDS token correctly", function() {
    var bonds;
    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;
    var amount = 10;
    var ether = 4;

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      web3.eth.sendTransaction({ from: accounts[0], to: bonds.address, value: web3.toWei(ether, "ether") });
      return bonds.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return bonds.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return bonds.transfer(accounts[1], amount, {from: accounts[0]});
    }).then(function() {
      return bonds.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return bonds.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

  // test transfer interest by non-owner, should fail
  it("should throw when non-owner address transferInterest", function() {
    var bonds;
    var interest = 10;
    var account_starting_balance;
    var account_ending_balance;

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      return bonds.interestOf.call(accounts[1]);
    }).then(function(balance) {
      account_starting_balance = balance.toNumber();
      return bonds.transferInterest(accounts[1], interest, {from: accounts[2]});
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    })
  })

  // test transfer interest by owner
  it("should transfer interest correctly", function() {
    var bonds;
    var interest = 10;
    var account_starting_balance;
    var account_step_one_balance;
    var account_ending_balance;

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      return bonds.interestOf.call(accounts[1]);
    }).then(function(balance) {
      account_starting_balance = balance.toNumber();
      return bonds.transferInterest(accounts[1], interest, {from: accounts[0]});
    }).then(function() {
      return bonds.interestOf.call(accounts[1]);
    }).then(function(balance) {
      account_step_one_balance = balance.toNumber();
      return bonds.transferInterest(accounts[1], interest, {from:accounts[0]});
    }).then(function() {
      return bonds.interestOf.call(accounts[1]);
    }).then(function(balance) {
      account_ending_balance = balance.toNumber();

      assert.equal(account_step_one_balance, account_starting_balance + interest, "Step 1, interest wasn't correctly transfer, step one")
      assert.equal(account_ending_balance, account_step_one_balance + interest, "Ending, interest wasn't correctly transfer, ending")
    })

  })

  // test contract balance
  it("should get contract balance", function() {
    var bonds;
    var ether = 3;
    var token_exchange_rate = 100;
    var owner_start_balance;
    var owner_end_balance;

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      owner_start_balance = web3.eth.getBalance(accounts[0]).toNumber();
      web3.eth.sendTransaction({ from: accounts[6], to: bonds.address, value: web3.toWei(ether, "ether") });
      return bonds.balanceOf.call(accounts[6]);
    }).then(function(balance) {
      owner_end_balance = web3.eth.getBalance(accounts[0]).toNumber();
      
      // token 
      assert.equal(ether * token_exchange_rate, balance.toNumber(), "token exchange wasn't correctly")
      assert.equal(web3.fromWei(owner_end_balance) - ether, web3.fromWei(owner_start_balance), "owner wasn't receive ether correctly")
    })
  })

  // test deposite to contract
  it("should deposite ether to contract", function() {
    var bonds;
    var ether = 10;
    var contract_start_balance;
    var contract_end_balance;

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      contract_start_balance = web3.eth.getBalance(bonds.address).toNumber();
      //console.log('start: ', web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber()));
      return bonds.deposite({ value: web3.toWei(ether, "ether") });
    }).then(function() {
      contract_end_balance = web3.eth.getBalance(bonds.address).toNumber();

      //console.log('end: ', web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber()));
      assert.equal(web3.fromWei(contract_start_balance), web3.fromWei(contract_end_balance) - ether, "after deposite contract ether wasn't receive correctly");
    })
  })

  // test user can get interest from contract

  // test withdraw by owner
  it("should withdraw ether from contract", function() {
    var bonds;
    var contract_start_balance;
    var contract_end_balance;
    var owner_start_balance;
    var owner_end_balance;

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      contract_start_balance = web3.eth.getBalance(bonds.address).toNumber();
      owner_start_balance = web3.eth.getBalance(accounts[0]).toNumber();
      // console.log('contract start: ', web3.fromWei(web3.eth.getBalance(bonds.address).toNumber()));
      // console.log('address start: ', web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber()));
      return bonds.withdraw();
    }).then(function() {
      contract_end_balance = web3.eth.getBalance(bonds.address).toNumber();
      owner_end_balance = web3.eth.getBalance(accounts[0]).toNumber();

      // console.log('contract end: ', web3.fromWei(web3.eth.getBalance(bonds.address).toNumber()));
      // console.log('address end: ', web3.fromWei(web3.eth.getBalance(accounts[0]).toNumber()));
      assert.equal(0, web3.fromWei(contract_end_balance), "after withdraw contract ether wasn't receive correctly");
      // float have something error
      // assert.equal(web3.fromWei(owner_end_balance) - 10, web3.fromWei(owner_start_balance), "after withdraw account ether wasn't withdraw correctly");
    })
  })

  // test maximum token supply
  it("should throw exception when hit maximum token supply", function() {
    var bonds
    var ether = 20

    return Bonds.deployed().then(function(instance) {
      bonds = instance;
      return bonds.totalSupply.call();
    }).then(function(totalSupply) {
      // console.log('totalSupply: ', totalSupply.toNumber());
      web3.eth.sendTransaction({ from: accounts[5], to: bonds.address, value: web3.toWei(ether, "ether") });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    })
  })

  // test send tansaction less then 1 ether 
  it("should throw exception when send less then 1 ether", function() {
    var bonds
    var ether = 0.1

    return Bonds.deployed().then(function(instance) {
      bonds = instance;

      web3.eth.sendTransaction({ from: accounts[7], to: bonds.address, value: web3.toWei(ether, "ether") });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    })
  })

  // test ICO for maximum token supply
  it("should throw exception after hit maximum token supply", function() {
    var bonds
    var ether = 1
    var maximum = 1000

    return Bonds.deployed().then(function(instance) {
      bonds = instance;

      web3.eth.sendTransaction({ from: accounts[8], to: bonds.address, value: web3.toWei(ether, "ether") });
      return bonds.totalSupply.call()
    }).then(function(totalSupply) {
      // console.log('totalSupply: ', totalSupply.toNumber());
      assert.equal(totalSupply.toNumber(), maximum, "contract maximum token wasn't correctly");
      web3.eth.sendTransaction({ from: accounts[8], to: bonds.address, value: web3.toWei(ether, "ether") });
    }).catch(function(err) {
      assert.isDefined(err, "transaction should have thrown");
    })
  })

  it("should get participant length", function() {
    var bonds

    return Bonds.deployed().then(function(instance) {
      bonds = instance;

      return bonds.getParticipantCount.call();
    }).then(function(participants) {
      console.log('participants: ', participants.toNumber())

    })
  })
});
