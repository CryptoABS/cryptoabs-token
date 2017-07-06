# CryptoABS Contract

## Abstract

The following describes CryptoABS functions has been implement.

## Specification

This contract have to satisfy following reqires:
- Contract definition
    - name
    - symbol
    - decimals
    - interest
        - rate
        - times
        - period
    - eth exchange rate
    - total supply
    - minimum ether invest
    - maximum token supply
    - token lockout period
    - financing period
    - token maturity period
- Contract permission
    - contract owner 
    - payee

### Version

0.1

### Imports

- SafeMath.sol
- Ownable.sol
- ERC20Basic.sol
- ERC20.sol
- BasicToken.sol
- StandardToken.sol

### Structs

#### Payee

```javascript
struct Payee {
  bool isExists;                                      
  bool isPayable;                                     
  uint256 interest;
}
```

Payee structure, store payee payable status and interest amount.

#### Asset

```javascript
struct Asset {
  string data;                                        
}
```

Asset structure, store asset data/information.

### Methods

#### ERC20 interface

```javascript
uint public totalSupply;
function balanceOf(address who) constant returns (uint);
function transfer(address to, uint value);
function allowance(address owner, address spender) constant returns (uint);
function transferFrom(address from, address to, uint value);
function approve(address spender, uint value);
event Approval(address indexed owner, address indexed spender, uint value);
event Transfer(address indexed from, address indexed to, uint value);
```

#### Initialize contract

```javascript
function initialize(
  string _name,
  string _symbol,
  uint256 _decimals,
  address _contractAddress,
  uint256 _startBlock,
  uint256 _endBlock,
  uint256 _initializedTime,
  uint256 _financingPeriod,
  uint256 _tokenLockoutPeriod,
  uint256 _tokenMaturityPeriod,
  uint256 _minEthInvest,
  uint256 _maxTokenSupply,
  uint256 _interestRate,
  uint256 _interestPeriod,
  uint256 _ethExchangeRate) onlyOwner;
```

Only owner can initialize contract with several parameter

#### Finalize contract

```javascript
function finalize() public initialized;
```

This method will can be called by the owner before the ICO period end or by anybody after the `endBlock`.

#### Fallback function

```javascript
function () payable notPaused;
```

Make contract accept ETH

#### Proxy payment

```javascript
function proxyPayment(address recipient) public payable notPaused isInitialized isContractOpen returns (bool);
```

Accept payment and create tokens to recipient

#### Override transfer

```javascript
function transfer(address _to, uint256 _value) onlyPayloadSize(2 * 32) notLockout notPaused isInitialized isContractOpen;
```

ERC20 standard

#### Override transferFrom

```javascript
function transferFrom(address _from, address _to, uint _value) onlyPayloadSize(3 * 32) notLockout notPaused isInitialized ;
```

#### Deposit interest

```javascript
function depositInterest(address _payee, uint256 _interest) onlyOwner notPaused isInitialized isContractOpen;
```

Add interest to every payee

#### Get interest

```javascript
function interestOf(address _address) isInitialized constant returns (uint256 result);
```

Get interest by address

#### Payee withdraw interest

```javascript
function withdrawInterest(uint256 _interest) payable isPayee notPaused isInitialized notLockout isContractOpen;
```

Let payee withdraw interest from this contract

#### Payee withdraw capital

```javascript
function withdrawCapital() payable isPayee notPaused isInitialized overMaturity isContractOpen;
```

Let payee withdraw capital from this contract

#### Pause/Resume contract

```javascript
function pauseContract() onlyOwner;
function resumeContract() onlyOwner;
```

Only owner can pause/resume contract by emergency

#### Get/Set ETH exchange rate

```javascript
function setEthExchangeRate(uint256 _ethExchangeRate) onlyOwner;
```

#### Disable/Enable payee

```javascript
function disablePayee(address _address) onlyOwner;
function enablePayee(address _address) onlyOwner;
```

Enable or disable payee on emergency

#### Block number

```javascript
function getBlockNumber() internal constant returns (uint256);
```

#### Add asset

```javascript
function addAsset(string _data) onlyOwner;
```

Add asset data for audit

### Get asset count

```javascript
function getAssetCount() constant returns (uint256 result);
```

#### Payee count

```javascript
function getPayeeCount() constant returns (uint256 result);
```

Return payee count

#### Put interest

```javascript
function interest(uint256 times) payable onlyOwner;
```

Only owner can put interest into this contract

#### Put capital

```javascript
function capital() payable onlyOwner;
```

Only owner can put capital into this contract

#### Withdraw from contract

```javascript
function withdraw() onlyOwner;
```

Only owner can withdraw balance from contract
