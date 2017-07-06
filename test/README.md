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

## Test cases

- owner initialize with parameters
    - [ ] `initialize`: owner send wrong parameters should fail
    - [x] `initialize`: owner send wrong parameters should success
    - [x] `proxyPayment`, `sendTransaction`: before owner initialize should fail
- anyone can finalize 
    - [ ] `finalize`: owner should finalize at anytime, before or after end block
    - [ ] `finalize`: anyone should finalize success when over end block
    - [ ] `finalize`: anyone should finalize fail when over end block
- payee buy token
    - [x] `proxyPayment`, `sendTransaction`: less then ether limit should fail
    - [x] `proxyPayment`, `sendTransaction`: over then ether limit should success
    - [x] `proxyPayment`, `sendTransaction`: should refund when more then expect ether
- payee transfer token
    - [x] `transfer`: new payee should add to payee list correctly
    - [x] `transfer`: payee should transfer success when contract non paused
    - [ ] `transfer`: payee should transfer fail when contract paused
    - [ ] `transfer`: over token limit should fail
    - [ ] `transferFrom`: payee should trigger transferFrom fail when contract paused
- owner pause contract
    - [x] `ownerPauseContract`: should pause contract success
    - [x] `ownerResumeContract`: should resume contract success
- [ ] `ownerSetExchangeRateInWei`: owner set exchange rate should success
- [x] owner deposit interest
    - [x] `ownerPutInterest`: owner should put interest to contract success when contract paused
    - [x] `ownerPutInterest`: owner should put interest to contract fail when contract not paused
- [ ] `interestOf`: payee get interest amount
- [ ] `balanceOf`: payee get balance amount
- [ ] payee withdraw interest
    - [ ] `payeeWithdrawInterest`: payee should withdraw interest success when non-paused
    - [ ] `payeeWithdrawInterest`: payee should withdraw interest fail when paused
    - [ ] `payeeWithdrawInterest`: payee should withdraw interest fail when over interest amount
- [ ] owner put capital
    - [ ] `ownerPutCapital`: owner should put capital to contract success when contract paused
    - [ ] `ownerPutCapital`: owner should put capital to contract fail when contract not paused
- [ ] payee withdraw capital
    - [ ] `payeeWithdrawCapital`: payee should withdraw capital success when contract paused
    - [ ] `payeeWithdrawCapital`: payee should withdraw capital fail when contract not paused
- [ ] ownership switch
    - [ ] `transferOwnership`: transfer ownership should fail when not owner
    - [ ] `transferOwnership`: transfer ownership should success when not owner
- [ ] owner disabled payee
    - [ ] `ownerDisablePayee`: should disabled payee success
    - [ ] `ownerEnablePayee`: should enabled payee success
- [x] `ownerAddAsset`: owner add asset
    - [x] `getAssetCount`: get asset count
