pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Bonds.sol";

contract TestBonds {

  function testInitialBalanceUsingDeployedContract() {
    Bonds bonds = Bonds(DeployedAddresses.Bonds());

    uint expected = 0;

    Assert.equal(bonds.balanceOf(tx.origin), expected, "Owner should have 0 BONDS initially");
  }

  function testInitialTokenSupplyAfterDeployedContract() {
    Bonds bonds = Bonds(DeployedAddresses.Bonds());

    uint expected = 0;

    Assert.equal(bonds.totalSupply(), expected, "Contract should have 0 BONDS token");
  }

  function testInitialMaximumTokenSupplyAfterDeployedContract() {
    Bonds bonds = Bonds(DeployedAddresses.Bonds());

    uint expected = 1000;

    Assert.equal(bonds.MAXIMUM_TOKEN_SUPPLY(), expected, "Contract should have 1000 BONDS maximum token supply");
  }

  // 這邊會需要透過 block 來判斷時間的操作
}
