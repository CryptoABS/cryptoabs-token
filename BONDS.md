# Bonds Contract

## Abstract

The following describes bonds functions has been implement.

## Specification

This contract have to satisfy following reqires:
- This contract have a limit sell, over that will be thrown.
- Participant can send ether to this contract to transfer token.
- This contract will transfer ether with token, and it has a transfer rate.
- Participant send ether to contract, and will send ether to contract owner.
- This contract have a minimum ether accept limit, should more then 1 ether.
- Token can transfer with other participant.
- Contract owner can deposite to this contract.
- Contract owner can withdraw from this contract.
- Participant can transfer token to ether after period time.
- Contract owner can set interest to each participant.
- Participant can withdraw interest.
- Participant can check interest balance.

### Version

0.1

### Imports

- SafeMath.sol
- Ownable.sol
- BasicToken.sol
- ERC20.sol
- ERC20Basic.sol

### Methods

#### ERC20 interface

```
uint public totalSupply;
function balanceOf(address who) constant returns (uint);
function transfer(address to, uint value);
function allowance(address owner, address spender) constant returns (uint);
function transferFrom(address from, address to, uint value);
function approve(address spender, uint value);
event Approval(address indexed owner, address indexed spender, uint value);
event Transfer(address indexed from, address indexed to, uint value);
```

#### Maximum token supply

```
uint public constant MAXIMUM_TOKEN_SUPPLY
function getMaximumTokenSupply();
```

Maximum token supply for this contract

#### Token price

```
uint public constant PRICE
function getTokenPrice();
```

Token transfer rate with ehter

#### Fallback function

```
function () payable;
```

Make contract can accept ETH

#### Create token

```
function createTokens(address recipient) payable;
```

Create tokens to recipient

#### Deposite by owner

```
function deposite() payable onlyOwner;
event Deposite(address indexed owner, uint value);
```

#### Withdraw by owner

```
function withdraw() payable onlyOwner;
event Withdraw(address indexed owner, uint value);
```

#### Get interest balance

```
function interestOf(address _owner) constant returns (uint interest);
```

#### Transfer interest by contract owner

```
function transferInterest(address _owner, uint _value) onlyOwner;
event Interest(address indexed owner, uint value, uint total);
```

