# Solidity coverage

## Install 

```
npm install -g mkdirp

npm install --save-dev solidity-coverage
```

## Run

```
./node_modules/.bin/solidity-coverage
```


## Report

```
Generating coverage environment
Instrumenting  ./coverageEnv/contracts/BasicToken.sol
Instrumenting  ./coverageEnv/contracts/CryptoABS.sol
Instrumenting  ./coverageEnv/contracts/ERC20.sol
Instrumenting  ./coverageEnv/contracts/ERC20Basic.sol
Skipping instrumentation of  ./coverageEnv/contracts/Migrations.sol
Instrumenting  ./coverageEnv/contracts/Ownable.sol
Instrumenting  ./coverageEnv/contracts/payment/PullPayment.sol
Instrumenting  ./coverageEnv/contracts/payment/PushPayment.sol
Instrumenting  ./coverageEnv/contracts/SafeMath.sol
Instrumenting  ./coverageEnv/contracts/StandardToken.sol
Launching testrpc on port 8555
Launching test command (this can take a few seconds)...
Using network 'development'.

Compiling ./contracts/BasicToken.sol...
Compiling ./contracts/CryptoABS.sol...
Compiling ./contracts/ERC20.sol...
Compiling ./contracts/ERC20Basic.sol...
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/Ownable.sol...
Compiling ./contracts/SafeMath.sol...
Compiling ./contracts/StandardToken.sol...
Compiling ./contracts/payment/PullPayment.sol...
Compiling ./contracts/payment/PushPayment.sol...


  Contract: CryptoABS
    ✓ 1.1. before owner initialize should fail when send transaction (364ms)
    ✓ 1.2. owner send wrong parameters should fail (619ms)
    ✓ 1.3. owner send correct parameters should success (677ms)
    ✓ 2.1. less then ether limit: buy token fail (263ms)
    ✓ 2.2. over then ether limit should success
      2.3. should refund when more then expect ether (1308ms)
    ✓ 3.1. anyone should finalize fail when not over end block (329ms)
    ✓ 3.2. owner should finalize at anytime, before or after end block (809ms)
    ✓ 3.4. anyone should fail send transaction after finalize (392ms)
    ✓ 4.1. new payee should add to payee list correctly
      4.2. payee should transfer success when contract non paused (10531ms)
    ✓ 5.1. should pause contract success (155ms)
    ✓ 4.3. payee should transfer fail when contract paused (211ms)
    ✓ 4.4. over token limit should fail (202ms)
    ✓ 5.2. should resume contract fail (182ms)
    ✓ 6.1. owner set exchange rate should success (167ms)
    ✓ 6.2. owner should put interest to contract fail when contract not paused (100ms)
    ✓ 6.3. owner should put interest to contract success when contract paused (637ms)
    ✓ 7.1. payee should withdraw interest fail when contract paused (393ms)
    ✓ 7.2. payee should withdraw interest fail when contract paused (295ms)
    ✓ 7.3. payee should withdraw interest fail when over interest amount (82ms)
    ✓ 7.4. payee should fail withdraw interest when disabled payee (235ms)
    ✓ 8.1. owner should put capital to contract fail when contract not paused (122ms)
    ✓ 8.2. owner should put capital to contract success when contract paused (469ms)
    ✓ 9.1. payee should withdraw capital fail when not over maturity (146ms)
    ✓ 9.2. payee should withdraw capital fail when disabled payee (10071ms)
    ✓ 9.3. payee should withdraw capital success when contract paused and over maturity (180ms)
    ✓ 10.1. transfer ownership should fail when not owner
    ✓ 10.2. transfer ownership should success when not owner (121ms)
    ✓ 11.1. owner should disabled payee success (93ms)
    ✓ 11.2. owner should enabled payee success (100ms)
    ✓ 11.3. should fail when disabled payee is not owner (57ms)
    ✓ 12.1. owner add asset (206ms)
    ✓ 12.2. get asset count (48ms)
    ✓ 13. get payee count (54ms)
    ✓ 14. get interest count (50ms)


  34 passing (30s)

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |    77.42 |    44.44 |       75 |    79.41 |                |
  BasicToken.sol    |    33.33 |       50 |    66.67 |    42.86 |    22,33,34,35 |
  CryptoABS.sol     |       90 |       40 |    93.55 |     90.3 |... 281,283,439 |
  ERC20.sol         |      100 |      100 |      100 |      100 |                |
  ERC20Basic.sol    |      100 |      100 |      100 |      100 |                |
  Ownable.sol       |      100 |       75 |      100 |      100 |                |
  SafeMath.sol      |    35.71 |      100 |       25 |    35.71 |... 33,37,41,45 |
  StandardToken.sol |        0 |        0 |        0 |        0 |... 49,51,52,62 |
 contracts/payment/ |        0 |        0 |        0 |        0 |                |
  PullPayment.sol   |        0 |        0 |        0 |        0 |... 73,74,76,80 |
  PushPayment.sol   |        0 |        0 |        0 |        0 |... 76,79,81,85 |
--------------------|----------|----------|----------|----------|----------------|
All files           |     59.7 |    22.22 |    53.73 |    60.81 |                |
--------------------|----------|----------|----------|----------|----------------|

Istanbul coverage reports generated
Cleaning up...
```
