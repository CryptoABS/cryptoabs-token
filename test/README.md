# Truffle 

## Environment Setup

```
sudo npm install -g truffle
sudo npm install -g ethereumjs-testrpc
sudo npm install -g web3
sudo npm install -g truffle-config
sudo npm install -g truffle-expect
```

## Common command

Start geth/testrpc first, for deploy contracts

```
testrpc
```

```
-- start a project
truffle init
-- start build contracts
truffle migrate
-- run console for REPL
truffle console
-- test all test/ files
truffle test
```

## Solidity coverage

See [COVERAGE.md](./COVERAGE.md) for more details.

## Test cases

- owner initialize with parameters
    - [x] `proxyPayment`, `sendTransaction`: before owner initialize should fail when send transaction
    - [x] `initialize`: owner send wrong parameters should fail
    - [x] `initialize`: owner send wrong parameters should success
- payee buy token
    - [x] `proxyPayment`, `sendTransaction`: less then ether limit should fail
    - [x] `proxyPayment`, `sendTransaction`: over then ether limit should success
    - [x] `proxyPayment`, `sendTransaction`: should refund when more then expect ether
- anyone can finalize 
    - [x] `finalize`: anyone should finalize fail when not over end block
    - [x] `finalize`: owner should finalize at anytime, before or after end block
    - [x] `finalize`: anyone should fail send transaction after finalize
- payee transfer token
    - [x] `transfer`: new payee should add to payee list correctly
    - [x] `transfer`: payee should transfer success when contract non paused
    - [x] `transfer`: payee should transfer fail when contract paused
    - [x] `transfer`: over token limit should fail
    - [ ] `transferFrom`: payee transfer tokens from one address to another
- owner pause contract
    - [x] `ownerPauseContract`: should pause contract success
    - [x] `ownerResumeContract`: should resume contract success
- owner deposit interest
    - [x] `ownerSetExchangeRateInWei`: owner set exchange rate should success
    - [x] `ownerPutInterest`: owner should put interest to contract fail when contract not paused
    - [x] `ownerPutInterest`: owner should put interest to contract success when contract paused
- payee withdraw interest
    - [x] `payeeWithdrawInterest`: payee should withdraw interest fail when contract paused
    - [x] `payeeWithdrawInterest`: payee should withdraw interest success when contract not paused
    - [x] `payeeWithdrawInterest`: payee should withdraw interest fail when over interest amount
    - [x] `payeeWithdrawInterest`: payee should fail withdraw interest when disabled payee
- owner put capital
    - [x] `ownerPutCapital`: owner should put capital to contract fail when contract not paused
    - [x] `ownerPutCapital`: owner should put capital to contract success when contract paused
- payee withdraw capital
    - [x] `payeeWithdrawCapital`: payee should withdraw capital fail when not over maturity
    - [x] `payeeWithdrawCapital`: payee should withdraw capital fail when disabled payee
    - [x] `payeeWithdrawCapital`: payee should withdraw capital success when contract paused and over maturity
- ownership switch
    - [x] `transferOwnership`: transfer ownership should fail when not owner
    - [x] `transferOwnership`: transfer ownership should success when not owner
- owner disabled payee
    - [x] `ownerDisablePayee`: owner should disabled payee success
    - [x] `ownerEnablePayee`: owner should enabled payee success
    - [x] `ownerDisablePayee`: should fail when disabled payee is not owner
- asset
    - [x] `ownerAddAsset`: owner add asset
    - [x] `getAssetCount`: get asset count
- [x] `getPayeeCount`: get payee count
- [x] `getInterestCount`: get interest count
- [ ] `ownerWithdraw`: owner withdraw contract balance
