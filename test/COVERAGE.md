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
    ✓ 1.1. before owner initialize should fail when send transaction (241ms)
    ✓ 1.2. owner send wrong parameters should fail (651ms)
    ✓ 1.3. owner send correct parameters should success (900ms)
    ✓ 2.1. less then ether limit: buy token fail (262ms)
    ✓ 2.2. over then ether limit should success
      2.3. should refund when more then expect ether (1328ms)
    ✓ 3.1. anyone should finalize fail when not over end block (127ms)
    ✓ 3.2. owner should finalize at anytime, before or after end block (280ms)
    ✓ 3.4. anyone should fail send transaction after finalize (284ms)
    ✓ 4.1. new payee should add to payee list correctly
      4.2. payee should transfer success when contract non paused (10400ms)
    ✓ 5.1. should pause contract success (95ms)
    ✓ 4.3. payee should transfer fail when contract paused (157ms)
    ✓ 4.4. over token limit should fail (178ms)
    ✓ 4.5. allow another payee to withdraw from origin payee account
      4.6. returns the amount which another payee is still allowed to withdraw from origin payee (110ms)
    ✓ 5.2. should resume contract success (100ms)
    ✓ 4.7. payee transfer tokens from one address to another (462ms)
    ✓ 6.1. owner set exchange rate should success (172ms)
    ✓ 6.2. owner should put interest to contract fail when contract not paused (78ms)
    ✓ 6.3. owner should put interest to contract success when contract paused (561ms)
    ✓ 7.1. payee should withdraw interest fail when contract paused (271ms)
    ✓ 7.2. payee should withdraw interest fail when contract paused (273ms)
    ✓ 7.3. payee should withdraw interest fail when over interest amount (88ms)
    ✓ 7.4. payee should fail withdraw interest when disabled payee (188ms)
    ✓ 8.1. owner should put capital to contract fail when contract not paused (75ms)
    ✓ 8.2. owner should put capital to contract success when contract paused (267ms)
    ✓ 9.1. payee should withdraw capital fail when not over maturity (131ms)
    ✓ 9.2. payee should withdraw capital fail when disabled payee (10081ms)
    ✓ 9.3. payee should withdraw capital success when contract paused and over maturity (210ms)
    ✓ 10.1. transfer ownership should fail when not owner (38ms)
    ✓ 10.2. transfer ownership should success when not owner (146ms)
    ✓ 11.1. owner should disabled payee success (131ms)
    ✓ 11.2. owner should enabled payee success (102ms)
    ✓ 11.3. should fail when disabled payee is not owner (39ms)
    ✓ 12.1. owner add asset (107ms)
    ✓ 12.2. get asset count
    ✓ 13. get payee count (48ms)
    ✓ 14. get interest count (40ms)
    ✓ 15. owner withdraw contract balance (533ms)


  37 passing (29s)

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |    87.74 |    55.56 |    83.33 |    89.41 |                |
  BasicToken.sol    |    33.33 |       50 |    66.67 |    42.86 |    22,33,34,35 |
  CryptoABS.sol     |      100 |       50 |      100 |      100 |                |
  ERC20.sol         |      100 |      100 |      100 |      100 |                |
  ERC20Basic.sol    |      100 |      100 |      100 |      100 |                |
  Ownable.sol       |      100 |       75 |      100 |      100 |                |
  SafeMath.sol      |    35.71 |      100 |       25 |    35.71 |... 33,37,41,45 |
  StandardToken.sol |       40 |       50 |    66.67 |    44.44 | 27,32,33,34,35 |
 contracts/payment/ |        0 |        0 |        0 |        0 |                |
  PullPayment.sol   |        0 |        0 |        0 |        0 |... 73,74,76,80 |
  PushPayment.sol   |        0 |        0 |        0 |        0 |... 76,79,81,85 |
--------------------|----------|----------|----------|----------|----------------|
All files           |    67.66 |    27.78 |     59.7 |    68.47 |                |
--------------------|----------|----------|----------|----------|----------------|

Istanbul coverage reports generated
Cleaning up...
```
