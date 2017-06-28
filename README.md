## CryptoABS Token

- [Whitepaper](whitepaper.pdf)

### Technical definition

At the technical level CABS are a ERC20-compliant tokens.

### Techincal Stack

Use `truffle` to create, compile, deploy and test smart contract.  
Use `open zeppelin` for smart contract security.  
Use `testrpc` for local testing.

### Contract Design principle

Take a look on [SMART_CONTRACT.md](SMART_CONTRACT.md) and [OPEN_ZEPPELIN.md](OPEN_ZEPPELIN.md).

### Contracts

[CryptoABS.sol](./contracts/cryptoabs/CryptoABS.sol)  
[BasicToken.sol](./contracts/cryptoabs/BasicToken.sol)  
[ERC20.sol](./contracts/cryptoabs/ERC20.sol)  
[ERC20Basic.sol](./contracts/cryptoabs/ERC20Basic.sol)  
[Ownable.sol](./contracts/cryptoabs/Ownable.sol)  
[SafeMath.sol](./contracts/cryptoabs/SafeMath.sol)  
  
[PullPayment.sol](./contracts/cryptoabs/payment/PullPayment.sol)  
[PushPayment.sol](./contracts/cryptoabs/payment/PushPayment.sol)  
