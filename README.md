# CryptoABS Token

- Website: http://cryptoabs.com/
- Whitepaper: 
- CryptoABS Contract: https://github.com/CryptoABS/cryptoabs-token/CRYPTO_ABS.md

----

# Table of contents

- [Technical Definition](#technical-definition)
- [Technical Stack](#technical-stack)
- [Updates](#updates)
- [Requirements](#requirements)
- [TODO](#todo)
- [Testing](#testing)
- [Contracts](#contracts)
- [Reviewers And Audits](#reviewers-and-audits)

## Technical Definition

At the technical level CABS are a ERC20-compliant tokens.

## Techincal Stack

Use `truffle` to create, compile, deploy and test smart contract.  
Use `open zeppelin` for smart contract security.  
Use `testrpc` for local testing.

## Updates

## Requirements

- Token Identifier
    - symbol `CABS`
    - name `CryptoABS Token`
    - decimals `0`
- ETH/CABS Transfer rate

## TODO

- Multiple Signature Wallet
- Decentralize Token Exchange

## Contract Design principle

Take a look on [SMART_CONTRACT.md](SMART_CONTRACT.md) and [OPEN_ZEPPELIN.md](OPEN_ZEPPELIN.md).

## Testing

See [test](test) for details.

## Contracts

[CryptoABS.sol](./contracts/CryptoABS.sol): Main contract for the token, CryptoABS is only partially-ERC20-compliant as it does not implement the `approve(...)`, `allowance(...)` and `transferFrom(...)` functions, and the `Approval(...)` event.  
[BasicToken.sol](./contracts/BasicToken.sol): ERC20Basic.sol interface implementation.  
[StandardToken.sol](./contracts/StandardToken.sol): ERC20.sol interface implementation.
[ERC20.sol](./contracts/ERC20.sol): ERC20 standard interfaces.
[ERC20Basic.sol](./contracts/ERC20Basic.sol): ERC20 basic interfaces.  
[Ownable.sol](./contracts/Ownable.sol): Owner ship.  
[SafeMath.sol](./contracts/SafeMath.sol): Math operations with safety checks.  
  
[PullPayment.sol](./contracts/payment/PullPayment.sol): Pull payment implementation.  
[PushPayment.sol](./contracts/payment/PushPayment.sol): Push payment implementation.  

## Reviewers And Audits

Code for the CryptoABS token is being reviewed by:

Phyrex Tsai, Author.
