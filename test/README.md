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

- [x] owner initialize
    - [x] before owner initialize
- [x] payee buy token
    - [x] less then ether limit
- [x] payee transfer token
- [x] owner deposit interest
- [ ] payee check interest amount
- [ ] payee withdraw interest
- [ ] owner put interest
- [ ] owner put capital
- [ ] payee withdraw capital
- [ ] ownership switch
- [ ] add asset
    - [ ] get asset count
    - [ ] get asset data 
