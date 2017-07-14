var Multisig = artifacts.require("../contracts/Multisig.sol");
var abi = require("ethereumjs-abi");

contract("Multisig", function(accounts) {
  /**
   * 1. send ETH to multisig wallet
   */
  it("1. send ETH to multisig wallet", function() {
    var multisig;
    var ether = 3;
    var wallet;

    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      web3.eth.sendTransaction({ from: accounts[4], to: multisig.address, value: web3.toWei(ether, "ether"), gas: 200000 });
      wallet = web3.eth.getBalance(multisig.address).toNumber();
      assert.equal(wallet, web3.toWei(ether, "ether"), "wallet balance wasn't correctly");
      return multisig.required.call();
    }).then(function(required) {
      assert.equal(2, required, "required wasn't correctly");
    });
  });

  /**
   * 2.1. get owners
   */
  it("2.1. get owners", function() {
    var multisig;
    
    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.getOwners.call();
    }).then(function(owners) {
      assert.equal(owners.length, 4, "owners count wasn't correctly");
      assert.equal(owners[0], accounts[0], "owners[0] wasn't correctly");
      assert.equal(owners[1], accounts[1], "owners[0] wasn't correctly");
      assert.equal(owners[2], accounts[2], "owners[0] wasn't correctly");
      assert.equal(owners[3], accounts[3], "owners[0] wasn't correctly");
    });
  });

  /**
   * Default 4 accounts
   * 3.1. add owner not exists should success
   */
  it("3.1. submit transaction to add not exists owner should success \r\n      7. check transaction count", function() {
    var multisig;
    
    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.getOwners.call();
    }).then(function(owners) {
      assert.equal(owners.length, 4, "owners count wasn't correctly");
      var encoded = abi.methodID("addOwner", [ "address" ]).toString("hex") + abi.rawEncode([ "address" ], [ accounts[4] ]).toString("hex");
      return multisig.submitTransaction(multisig.address, 0, "0x" + encoded);
    }).then(function() {
      return multisig.getTransactionCount(true, true);
    }).then(function(count) {
      assert.equal(count.toNumber(), 1, "submit transaction to add owner wasn't correctly");
      return multisig.getTransactionIds(0, 1, true, false);
    }).then(function(transactionIds) {
      assert.equal(transactionIds.length, 1, "transactionIds wasn't correctly");
      return multisig.isConfirmed(0);
    }).then(function(result) {
      assert.equal(result, false, "0 transactionId confirmed wasn't correctly");
      return multisig.confirmTransaction(0, {from: accounts[1]});
    }).then(function() {
      return multisig.getConfirmations(0);
    }).then(function(confirmations) {
      assert.equal(confirmations.length, 2, "confirmation wasn't correctly");
      return multisig.isConfirmed(0);
    }).then(function(result) {
      assert.equal(result, true, "2 transactionId confirmed wasn't correctly");
      return multisig.getOwners.call();
    }).then(function(owners) {
      assert.equal(owners.length, 5, "owners count wasn't correctly");
    });
  });

  /**
   * 3.2. submit transaction to remove owner already exists should success
   */
  it("3.2. submit transaction to remove owner already exists should success", function() {
    var multisig;
    
    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.getOwners.call();
    }).then(function(owners) {
      assert.equal(owners.length, 5, "owners count wasn't correctly");
      var encoded = abi.methodID("removeOwner", [ "address" ]).toString("hex") + abi.rawEncode([ "address" ], [ accounts[4] ]).toString("hex");
      return multisig.submitTransaction(multisig.address, 0, "0x" + encoded);
    }).then(function() {
      return multisig.confirmTransaction(1, {from: accounts[1]});
    }).then(function() {
      return multisig.getOwners();
    }).then(function(owners) {
      assert.equal(owners.length, 4, "owners count wasn't correctly");
    });
  });

  /**
   * 3.3. submit transaction to replace owner should success
   */
  it("3.3. submit transaction to replace owner should success", function() {
    var multisig;
    var originOwner;
    var newOwner;
    
    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.getOwners.call();
    }).then(function(owners) {
      assert.equal(owners.length, 4, "owners count wasn't correctly");
      originOwner = owners[3];
      assert.equal(originOwner, accounts[3], "origin owner wasn't correctly");
      var encoded = abi.methodID("replaceOwner", [ "address", "address" ]).toString("hex") + 
        abi.rawEncode([ "address" ], [ accounts[3] ]).toString("hex") + 
        abi.rawEncode([ "address" ], [ accounts[4] ]).toString("hex");
      return multisig.submitTransaction(multisig.address, 0, "0x" + encoded);
    }).then(function() {
      return multisig.confirmTransaction(2, {from: accounts[2]});
    }).then(function() {
      return multisig.getOwners();
    }).then(function(owners) {
      assert.equal(owners.length, 4, "owners count wasn't correctly");
      newOwner = owners[3];
      assert.equal(newOwner, accounts[4], "new owner wasn't correctly");
    });
  });

  /**
   * 4. submit transaction to change requirement should success
   */
  it("4. submit transaction to change requirement should success", function() {
    var multisig;

    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.required.call();
    }).then(function(require) {
      assert.equal(require.toNumber(), 2, "before change, required count wasn't correctly");
      var encoded = abi.methodID("changeRequirement", [ "uint256" ]).toString("hex") + 
        abi.rawEncode([ "uint256" ], [ 3 ]).toString("hex");
      return multisig.submitTransaction(multisig.address, 0, "0x" + encoded);
    }).then(function() {
      return multisig.confirmTransaction(3, {from: accounts[2]});
    }).then(function() {
      return multisig.required.call();
    }).then(function(require) {
      assert.equal(require, 3, "after change, required count wasn't correctly");
    });
  });

  /**
   * 5. revoke sumbitted transaction should success
   */
  it("5. revoke sumbitted transaction should success", function() {
    var multisig;

    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      var encoded = abi.methodID("changeRequirement", [ "uint256" ]).toString("hex") + 
        abi.rawEncode([ "uint256" ], [ 2 ]).toString("hex");
      return multisig.submitTransaction(multisig.address, 0, "0x" + encoded);
    }).then(function() {
      return multisig.getConfirmationCount(4);
    }).then(function(count) {
      assert.equal(count.toNumber(), 1, "before confirmation count wasn't correctly");
      return multisig.revokeConfirmation(4);
    }).then(function() {
      return multisig.getConfirmationCount(4);
    }).then(function(count) {
      assert.equal(count.toNumber(), 0, "before confirmation count wasn't correctly");
    });
  });

  /**
   * 6. check confirmation count
   */
  it("6. check confirmation count", function() {
    var multisig;
    
    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.getConfirmationCount(0);
    }).then(function(count) {
      assert.equal(count.toNumber(), 2, "confirmation count wasn't correctly");
    });
  });

  /**
   * 8. get confirmation information
   */
  it("8. get confirmation information", function() {
    var multisig;
    
    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.getConfirmations(0);
    }).then(function(confirmation) {
      assert.equal(confirmation.length , 2, "confirmation information wasn't correctly");
    });
  });

  /**
   * 9. get transaction information by id
   */
  it("9. get transaction information by id", function() {
    var multisig;

    return Multisig.deployed().then(function(instance) {
      multisig = instance;
      return multisig.getTransactionCount(false, true);
    }).then(function(count) {
      return multisig.getTransactionIds(0, count.toNumber(), false, true);
    }).then(function(transaction) {
      assert.equal(transaction.length > 0, true, "transaction information wasn't correctly");
    });
  });
});
