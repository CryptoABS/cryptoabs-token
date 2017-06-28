# Bonds Contract

## Abstract

The following describes crypto abs functions has been implement.

## Specification

This contract have to satisfy following reqires:
- 合約基礎定義
    - token name
    - 利息
    - token 與 ether 的匯率設定
    - 發行 token，使用 fallback function
    - token 允許 ETH 最小購買金額
    - token 最大發行上限
    - token 允許兌換成 coin 的鎖定時間
    - token 閉鎖期
    - 合約終止 function
- 合約邏輯
    - 利息的派發模式，push or pull
    - token transfer 的方法
- 合約權限
    - function 操作權限的設計，modifier owner payee

### Version

0.1

### Imports

- SafeMath.sol
- Ownable.sol
- BasicToken.sol
- StandardToken.sol
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

#### Initialize contract

```
function initialize(
  address _contractAddress,
  uint256 _startBlock,
  uint256 _endBlock,
  uint256 _initializedTime,
  uint256 _financingPeriod,
  uint256 _tokenLockoutPeriod,
  uint256 _tokenMaturityPeriod,
  uint256 _minEthInvest,
  uint256 _maxTokenSupply) onlyOwner;
```

Only owner can initialize contract with several parameter

#### Finalize contract

```
function finalize() public initialized;
```

This method will can be called by the owner before the ICO period end or by anybody after the `endBlock`.

#### Fallback function

```
function () payable notPaused;
```

Make contract accept ETH

#### Proxy payment

```
function proxyPayment(address recipient) public payable notPaused isInitialized isContractOpen returns (bool);
```

Accept payment and create tokens to recipient

#### Override transfer

```
function transfer(address _to, uint256 _value) onlyPayloadSize(2 * 32) notLockout notPaused isInitialized isContractOpen;
```

#### Deposit interest

```
function depositInterest(address _payee, uint256 _interest) onlyOwner notPaused isInitialized isContractOpen;
```

Add interest to every payee

#### Get interest

```
function interestOf(address _address) isInitialized isContractOpen returns (uint256 result);
```

Get interest by address

#### Payee withdraw interest

```
function withdrawInterest(uint256 _interest) payable isPayee notPaused isInitialized notLockout isContractOpen;
```

Let payee withdraw interest from this contract

#### Payee withdraw capital

```
function withdrawCapital() payable isPayee notPaused isInitialized overMaturity isContractOpen;
```

Let payee withdraw capital from this contract

#### Pause/Resume contract

```
function pauseContract() onlyOwner;
function resumeContract() onlyOwner;
```

Only owner can pause/resume contract by emergency

#### Get/Set ETH exchange rate

```
function setEthExchangeRate(uint256 _ethExchangeRate) onlyOwner;
function getEthExchangeRate() returns (uint256 result);
```

#### Disable/Enable payee

```
function disablePayee(address _address) onlyOwner;
function enablePayee(address _address) onlyOwner;
```

Enable or disable payee on emergency

#### Block number

```
function getBlockNumber() internal constant returns (uint256);
```

#### Payee count

```
function getPayeeCount() returns (uint256 result);
```

Return payee count

#### Payee payable status

```
function isPayeePayable() constant returns (bool result);
```

Return payee payable status

#### Put interest

```
function interest(uint256 times) payable onlyOwner;
```

Only owner can put interest into this contract

#### Put capital

```
function capital() payable onlyOwner;
```

Only owner can put capital into this contract

#### Withdraw from contract

```
function withdraw() onlyOwner;
```

Only owner can withdraw balance from contract
