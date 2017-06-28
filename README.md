## CryptoABS Token

- [Whitepaper](whitepaper.pdf)

## Technical definition

At the technical level CABS are a ERC20-compliant tokens.

## Techincal Stack

Use `truffle` to create, compile, deploy and test smart contract.  
Use `open zeppelin` for smart contract security.  
Use `testrpc` for local testing.

## Contract Design principle

Take a look on [SMART_CONTRACT.md](SMART_CONTRACT.md) and [OPEN_ZEPPELIN.md](OPEN_ZEPPELIN.md).

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
