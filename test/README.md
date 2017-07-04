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

- [v] owner initialize
    - [v] before owner initialize
- [v] payee buy token
    - [v] less then ether limit
- [v] payee transfer token
- [v] owner deposit interest
- [ ] payee check interest amount
- [ ] payee withdraw interest
- [ ] owner put interest
- [ ] owner put capital
- [ ] payee withdraw capital
