## CryptoABS Token

- [Whitepaper](whitepaper.pdf)

### Technical definition
----

At the technical level CABS are a ERC20-compliant tokens.

### Techincal Stack
----

Use `truffle` to create, compile, deploy and test smart contract.  
Use `open zeppelin` for smart contract security.  
Use `testrpc` for local testing.

### Contract Design principle
----

Take a look on [SMART_CONTRACT.md](SMART_CONTRACT.md) and [OPEN_ZEPPELIN.md](OPEN_ZEPPELIN.md).

### Contracts
----

[CryptoABS.sol](./contracts/cryptoabs/CryptoABS.sol): Main contract for the token.  
[BasicToken.sol](./contracts/cryptoabs/BasicToken.sol): ERC20Basic.sol interface implementation.  
[ERC20.sol](./contracts/cryptoabs/ERC20.sol): ERC20 standrad interfaces.  
[ERC20Basic.sol](./contracts/cryptoabs/ERC20Basic.sol): ERC20 standrad interfaces.  
[Ownable.sol](./contracts/cryptoabs/Ownable.sol): Owner ship.  
[SafeMath.sol](./contracts/cryptoabs/SafeMath.sol): Math operations with safety checks.  
  
[PullPayment.sol](./contracts/cryptoabs/payment/PullPayment.sol): Pull payment implementation.  
[PushPayment.sol](./contracts/cryptoabs/payment/PushPayment.sol): Push payment implementation.  
