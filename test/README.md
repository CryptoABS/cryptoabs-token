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

- [CryptoABS.sol](./CRYPTO_ABS.md)
- [Multisig.sol](./MULTISIG.md)
